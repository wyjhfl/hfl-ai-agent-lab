# LLM Gateway：多模型接入、路由、成本和审计

## 这篇文章解决什么问题

很多 LLM 应用早期会直接在业务代码里调用某个模型 API。Demo 阶段这样很快，但一旦进入项目阶段，就会出现一批工程问题：

- 模型供应商想切换，业务代码到处要改。
- 不同场景需要不同模型，但没有统一路由。
- 成本失控，不知道哪个接口最贵。
- 调用失败没有降级。
- Prompt、输入、输出、错误没有统一审计。
- 流式输出、工具调用、结构化输出的格式不一致。
- API Key 分散在多个服务里，权限难控。

LLM Gateway 的目标是把模型调用从业务代码里抽出来，形成统一的模型访问层。

## LLM Gateway 的定位

LLM Gateway 位于业务服务和模型供应商之间。

```text
Frontend / Backend / Agent Runtime
        ↓
LLM Gateway
        ↓
OpenAI / Anthropic / Gemini / Local Model / Rerank Model / Embedding Model
```

它不替代 Agent Runtime，也不替代业务服务。它负责模型访问的工程治理：路由、鉴权、限流、重试、缓存、日志、成本、审计和降级。

## Gateway 应该做什么

| 能力 | 作用 |
|---|---|
| 统一接口 | 业务侧不用关心不同供应商 API 差异 |
| 模型路由 | 按任务、成本、延迟、质量选择模型 |
| 鉴权和配额 | 控制调用者能用哪些模型、多少额度 |
| Prompt 模板管理 | 记录模板版本，支持回滚和对比 |
| 成本统计 | 统计 token、调用量、缓存命中、费用 |
| 错误处理 | 超时、限流、供应商错误统一分类 |
| 降级策略 | 主模型失败时切换备用模型或返回可解释错误 |
| 审计日志 | 保存输入摘要、输出摘要、模型、延迟、错误 |
| 安全过滤 | 阻断敏感数据、危险输出或越权调用 |
| Trace 对接 | 将模型调用纳入 Agent run/step 追踪 |

## Gateway 不应该做什么

LLM Gateway 不应该承载太多业务逻辑。

不建议放进 Gateway 的内容：

- 复杂业务流程。
- 多 Agent 调度。
- RAG 检索策略。
- 工具权限审批。
- 用户界面状态。
- 项目专属 Prompt 决策。

这些应该由 Agent Runtime、业务服务或 RAG 服务负责。Gateway 只做模型访问治理。

## 最小接口设计

一个最小 Gateway 可以抽象出三类接口：

```text
POST /v1/llm/generate
POST /v1/llm/embed
POST /v1/llm/rerank
```

### Generate 请求

```json
{
  "task_type": "support_answer",
  "model_policy": "balanced",
  "messages": [
    {"role": "system", "content": "You are a support diagnosis assistant."},
    {"role": "user", "content": "设备过热怎么办？"}
  ],
  "response_format": {
    "type": "json_schema",
    "schema_name": "support_answer"
  },
  "trace": {
    "run_id": "run_001",
    "step_id": "step_003"
  }
}
```

### Generate 响应

```json
{
  "ok": true,
  "provider": "openai",
  "model": "strong_reasoning_model",
  "output": {
    "answer": "先检查风扇、散热口和负载电流。",
    "citations": ["manual-001#p12"]
  },
  "usage": {
    "input_tokens": 1200,
    "output_tokens": 300,
    "cached_tokens": 800
  },
  "latency_ms": 1240,
  "trace_id": "llm_call_001"
}
```

业务侧只依赖 Gateway 返回的稳定结构，不直接依赖供应商 SDK。

## 模型路由策略

模型路由不是“永远用最强模型”。应该根据任务类型做分层。

| 任务类型 | 推荐策略 |
|---|---|
| 简单分类 | 小模型、低温度、短超时 |
| Query Rewrite | 小模型或中模型，要求结构化输出 |
| RAG 最终回答 | 中高质量模型，要求引用和 JSON 输出 |
| 高风险决策 | 高质量模型 + 规则校验 + 人工审批 |
| 批量评测 | 成本敏感模型 + 抽样人工复核 |
| 代码生成 | 代码能力强的模型 + 测试验证 |
| 长上下文总结 | 长上下文模型 + 分段压缩 |

路由可以从简单规则开始：

```text
if task_type == "classification": use cheap_model
if task_type == "final_answer" and risk == "high": use strong_model
if provider_error == "rate_limit": fallback to backup_provider
```

后续再加入质量评分、成本预算和动态实验。

## 成本控制

LLM Gateway 必须记录成本，否则很难进入真实业务。

需要记录：

- 调用方。
- 任务类型。
- 模型。
- 输入 token。
- 输出 token。
- 缓存命中 token。
- 延迟。
- 失败次数。
- 预估费用。

成本优化手段包括：

- Prompt 缓存。
- 上下文压缩。
- 小模型预处理。
- RAG 证据精简。
- 批处理。
- 流式中断。
- 失败重试次数限制。
- 对高频任务做模板化输出。

成本控制不是只换便宜模型，而是减少不必要的上下文和重复调用。

## 错误分类

不同供应商的错误格式不同，Gateway 应该统一成内部错误类型。

| 类型 | 含义 | 策略 |
|---|---|---|
| `validation_error` | 请求格式错误 | 不重试，修业务代码 |
| `auth_error` | Key 或权限错误 | 不重试，告警 |
| `rate_limited` | 限流 | 指数退避或切备用 |
| `timeout` | 超时 | 可重试，限制次数 |
| `provider_error` | 供应商内部错误 | 可降级 |
| `content_blocked` | 安全策略阻断 | 返回可解释错误 |
| `schema_mismatch` | 输出不符合结构 | 可做修复重试 |

错误分类要进入 Trace，方便定位是模型问题、供应商问题、上下文问题还是业务参数问题。

## Prompt 和版本管理

生产系统不应该让 Prompt 散落在代码里。Gateway 或 Prompt Registry 至少要记录：

- `prompt_id`
- `version`
- `task_type`
- `owner`
- `model_policy`
- `created_at`
- `change_log`
- `rollback_version`

每次模型调用都记录 prompt 版本。这样线上效果变化时，可以知道是模型变了、Prompt 变了，还是上下文变了。

## 安全与隐私

Gateway 是敏感数据出口，必须做最小保护：

- API Key 只保存在服务端。
- 不把密钥写入日志。
- 对输入做敏感信息扫描。
- 对高风险输出做策略检查。
- 区分不同业务调用方的权限。
- 保留审计日志但避免保存完整隐私内容。
- 支持按用户或租户做数据隔离。

对于需要企业合规的场景，Gateway 是统一控制点。

## 与 Agent Runtime 的关系

Agent Runtime 负责“怎么执行任务”，LLM Gateway 负责“怎么调用模型”。

| 模块 | 负责内容 |
|---|---|
| Agent Runtime | 计划、状态、工具、循环、handoff、人审 |
| LLM Gateway | 模型选择、调用、重试、成本、日志、审计 |
| RAG Service | 文档检索、rerank、引用、证据 |
| Tool/MCP Layer | 外部能力和权限 |
| Trace Service | run/step/tool/model 调用记录 |

不要把所有东西塞进 Gateway。否则它会变成新的“大泥球”。

## 在项目 A / B 中怎么用

### 项目 A：RAG 工单系统

Gateway 可以统一处理：

- Query Rewrite。
- 最终答案生成。
- 工单摘要生成。
- Embedding。
- Rerank。
- 评测模型调用。

这样可以统计每个工单从检索到生成的模型成本。

### 项目 B：多 Agent 运营中台

Gateway 可以统一处理：

- Planner 任务拆解。
- Specialist 分析。
- Critic 审核。
- Summary 结果聚合。
- 高风险操作前的二次校验。

每个 Agent 不直接拿模型 Key，而是通过 Gateway 受控调用。

## 面试表达

可以这样讲 LLM Gateway：

> 我会把模型调用抽象成 LLM Gateway，而不是在业务代码里到处直接调供应商 SDK。Gateway 负责统一接口、模型路由、鉴权、限流、重试、降级、成本统计、Prompt 版本和审计日志。业务侧只传 task_type、messages、response_format 和 trace 信息，由 Gateway 根据策略选择模型并返回统一结构。这样当模型供应商切换、成本异常、输出格式变化或线上失败时，都可以在一个层面治理，而不是分散到各个业务模块里。

## 检查清单

- 是否所有模型调用都经过统一入口？
- 是否记录模型、Prompt 版本、token 和延迟？
- 是否支持按 task_type 路由？
- 是否有超时和重试策略？
- 是否有备用模型或降级输出？
- 是否能识别 schema mismatch？
- 是否避免在日志中保存密钥和隐私？
- 是否能按用户/租户/接口统计成本？
- 是否把模型调用接入 Agent Trace？
- 是否能回滚 Prompt 版本？

## 相关链接

- [FastAPI 后端接口工程化](/note/Engineering/fastapi)
- [API 安全与工具权限控制](/note/Engineering/api-security)
- [Agent Trace 执行轨迹](/note/Engineering/agent-trace)
- [Context Engineering](/note/AI-Agent/context-engineering)
- [Production Engineering](/note/AI-Agent/production)

## 参考资料

- [OpenAI Agents SDK](https://developers.openai.com/api/docs/guides/agents)
- [OpenAI Prompt Caching](https://platform.openai.com/docs/guides/prompt-caching)
- [Model Context Protocol Architecture](https://modelcontextprotocol.io/docs/learn/architecture)
