# Project B Demo 验收脚本：5 分钟讲清多 Agent Copilot

> 目标：让项目演示不是“随便问一句”，而是按主路径、权限、审批、失败恢复和 Trace 展示工程能力。

## Demo 总体节奏

| 时间 | 内容 | 证明点 |
|---|---|---|
| 0:00 - 0:30 | 介绍业务场景和任务 | 不是聊天机器人，而是运营流程助手 |
| 0:30 - 1:20 | 输入自然语言任务 | Router / Planner 能理解任务和风险 |
| 1:20 - 2:10 | 展示工具调用和证据 | Tool Registry、RAG、业务数据查询 |
| 2:10 - 3:00 | 触发高风险审批 | Human-in-the-loop、Action Preview、Audit |
| 3:00 - 4:00 | 展示 Trace / Run Replay | 可观测、可排查、可复盘 |
| 4:00 - 5:00 | 展示评测和上线门禁 | Eval Dataset、Regression、Release Gate |

## Demo 场景

用户输入：

> 帮我分析昨天 A 活动转化率下降的原因，如果确认是库存问题，就生成一条给运营负责人的工单草稿，并准备一版用户通知文案，但不要直接发送。

这个任务能覆盖：

- 指标查询
- 业务上下文检索
- 多步骤规划
- 工具调用
- 工单草稿
- 通知文案草稿
- 高风险动作不直接执行
- Trace 回放

## 主路径脚本

### Step 1：任务理解

展示 Router 输出：

```json
{
  "task_type": "operation_diagnosis",
  "risk_level": "medium",
  "needs_retrieval": true,
  "candidate_tools": [
    "search_metric_definition",
    "query_operation_snapshot",
    "create_ticket_draft",
    "draft_operation_message"
  ]
}
```

讲法：

> 我先让 Router 判断任务类型和风险，而不是直接把用户输入扔给大模型自由发挥。这样后续能决定允许哪些工具、是否需要审批、是否必须引用证据。

### Step 2：规划步骤

展示 Planner 生成计划：

1. 查询“转化率”的指标口径。
2. 查询 A 活动昨日与过去 7 天对比数据。
3. 检查库存、渠道、页面错误、价格变动等候选原因。
4. 生成诊断摘要和证据引用。
5. 生成工单草稿和通知文案草稿。
6. 等待人工确认，不直接发送。

讲法：

> 多 Agent 的价值不是角色名字多，而是每一步有清楚输入输出。Planner 只负责计划，Executor 才能调工具，Reviewer 最后检查证据和风险。

### Step 3：工具调用

展示工具调用记录：

| Tool | 输入 | 输出 |
|---|---|---|
| `search_metric_definition` | `conversion_rate` | 指标口径、分母分子、异常阈值 |
| `query_operation_snapshot` | 活动 ID、日期、维度 | 转化率下降 18%，库存不足 SKU 占比升高 |
| `create_ticket_draft` | 诊断摘要、负责人、严重级别 | 工单草稿 ID |
| `draft_operation_message` | 用户影响、补偿口径 | 通知文案草稿 |

讲法：

> Agent 不直接拼 SQL 或调用生产 API，而是通过 Tool Registry 调用受控工具。每个工具有 schema、risk level、timeout、error code 和 audit 字段。

### Step 4：人工审批

展示审批卡片：

```text
动作：创建运营工单草稿
影响：通知运营负责人排查 A 活动库存问题
风险等级：medium
证据：库存不足 SKU 占比从 2.1% 升至 14.7%
是否直接发送用户通知：否，仅生成草稿
```

讲法：

> 高风险或外部副作用动作必须进入审批。这里系统只生成草稿，不直接发通知。真正执行需要审批通过，并写入 audit log。

### Step 5：Trace 回放

展示 Trace 维度：

- run id
- task brief
- planner output
- retrieved evidence
- tool calls
- approval decision
- reviewer notes
- final answer
- token cost / latency

讲法：

> Trace 的价值是能回答“为什么 Agent 这么做”。如果答案错了，我可以定位是指标口径错、检索错、工具结果错、计划错，还是最终总结错。

## 失败路径演示

### 失败 1：工具超时

期望行为：

- 标记 `UPSTREAM_TIMEOUT`
- 最多重试一次
- 仍失败则降级为“需要人工查询”
- 不编造结果

### 失败 2：没有证据

期望行为：

- Reviewer 拒绝最终结论
- 输出“当前证据不足”
- 给出需要补充的数据项

### 失败 3：越权数据

期望行为：

- Resource / Tool 层直接拒绝
- Trace 记录 permission denied
- Agent 不尝试通过其他工具绕过

## 验收清单

- [ ] 能完成主路径演示。
- [ ] 每次工具调用都有结构化输入输出。
- [ ] 高风险动作进入审批，不直接执行。
- [ ] Trace 能回放完整 run。
- [ ] 至少演示一个失败恢复路径。
- [ ] 最终答案带证据和下一步建议。

## 面试收尾话术

> 这个 Demo 我重点展示的不是“模型回答得多流畅”，而是 Agent 在真实业务系统里的工程控制：任务理解、工具调用、权限审批、Trace 回放、失败降级和评测门禁。这样项目更接近企业可上线 Copilot，而不是一个 Prompt Demo。
