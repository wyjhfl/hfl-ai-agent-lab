# MCP Server 从零到作品集：把工具能力做成可展示项目

很多人写 MCP Server 只停留在“把一个函数暴露给模型调用”。真正能放进作品集、简历和面试答辩的 MCP 项目，应该证明三件事：

1. **工具边界清晰**：知道什么能力适合做成 MCP tool、resource、prompt。
2. **工程治理完整**：有 schema、权限、沙箱、审计、版本、测试和观测。
3. **能支撑 Agent 场景**：能被多 Agent / Coding Agent / RAG Agent 调用，并且出错可排查。

> 参考：MCP 官方文档把 server 能力拆成 tools、resources、prompts 等概念；OpenAI Apps SDK 也围绕工具描述、组件资源和安全 scheme 组织工具接入。作品集里要讲的是“如何设计这些边界”，而不是只展示一个 hello world。

---

## 1. 选一个适合展示的场景

不要从“我会写 MCP Server”开始，而要从业务问题开始。

| 场景 | MCP Server 可以提供什么 | 作品集价值 |
|---|---|---|
| 简历/岗位匹配 Agent | 读取岗位 JD、匹配项目证据、生成追问清单 | 和求职目标强相关 |
| 代码仓库分析 Agent | 读取 repo 结构、测试命令、最近 diff、风险文件 | 能连接 Coding Agent 项目 |
| 企业知识库 Agent | 查询知识库、返回 citation、检查 ACL | 能连接 RAG 工程体系 |
| 文档智能 Agent | 查询抽取字段、复核状态、PII 风险 | 能连接 Project F |
| 运维排障 Agent | 查询日志、指标、runbook、变更记录 | 能体现生产级能力 |

**推荐个人作品集优先做：Repo Context MCP Server。**  
原因：容易准备样例数据，能和 Coding Agent、评测、CI、面试表达都串起来。

---

## 2. 设计 tool / resource / prompt 边界

一个可展示 MCP Server 至少要包含三类能力。

### Tools：有副作用或需要执行的动作

示例：

```json
{
  "name": "repo.search_files",
  "description": "按 glob 和关键词检索仓库文件，返回路径、片段和匹配原因。",
  "inputSchema": {
    "type": "object",
    "properties": {
      "glob": { "type": "string", "description": "例如 src/**/*.ts" },
      "query": { "type": "string", "description": "要检索的关键词" },
      "limit": { "type": "integer", "minimum": 1, "maximum": 20 }
    },
    "required": ["query"]
  }
}
```

设计要点：

- `description` 写给模型看，不是写给人类 API 文档看。
- 参数要有约束：枚举、范围、默认值、必填字段。
- 工具输出要稳定：不要把原始异常直接抛给模型。
- 有副作用的工具必须标记风险，并进入审批流。

### Resources：稳定上下文

示例：

- `repo://summary`：仓库语言、目录、测试命令、包管理器。
- `repo://recent-diff`：最近改动摘要。
- `repo://quality-gates`：lint/test/build 门禁定义。

Resources 适合放“经常被读取、但不应该每次都重新计算”的上下文。

### Prompts：可复用任务模板

示例：

- `review_changed_files`：审查最近 diff。
- `write_test_plan`：根据功能改动生成测试计划。
- `summarize_repo_context`：压缩仓库上下文给 Coding Agent。

Prompts 适合把团队工作流固化下来，不要把所有提示词散落在应用代码里。

---

## 3. 把安全边界前置

MCP Server 一旦接入 Agent，就不能假设调用方永远善意。

### 最小安全清单

- **路径沙箱**：只能读写 workspace 白名单目录。
- **命令白名单**：测试命令、格式化命令、只读 git 命令分级。
- **敏感文件拦截**：`.env`、密钥、token、证书默认不可读。
- **输出脱敏**：日志、异常、diff 中的 secret 要做 redaction。
- **审批分级**：只读工具自动执行；写文件、网络、删除、部署必须审批。
- **审计日志**：记录调用者、工具名、参数摘要、风险等级、结果状态。

可以直接关联站内内容：

- [MCP Sandbox Profile](/note/Engineering/mcp-sandbox-profile)
- [MCP 安全与授权](/note/Engineering/mcp-security-auth)
- [Tool Risk Classification](/note/Engineering/tool-risk-classification)
- [Agent Approval Workflow](/note/Engineering/agent-approval-workflow)

---

## 4. 写测试，不要只写 Demo

作品集里的 MCP Server 最容易被追问：

> “你怎么保证工具调用是稳定的？模型乱传参数怎么办？工具失败怎么办？”

准备以下测试证据：

| 测试类型 | 要证明什么 |
|---|---|
| schema validation | 错误参数会被拒绝，并返回模型可理解的错误 |
| golden response | 固定输入能返回稳定结构 |
| permission test | 越权路径、敏感文件、危险命令会被拦截 |
| failure injection | 依赖超时、文件不存在、命令失败时可恢复 |
| client integration | 至少用一个 MCP client 或 Agent harness 调通 |

推荐把测试结果做成一张小表放进项目 README：

| Gate | Case | Status | Evidence |
|---|---|---|---|
| Schema | 缺少 `query` 参数 | PASS | `tests/schema/search_files.invalid.json` |
| Sandbox | 读取 `.env` | BLOCKED | audit log id |
| Failure | repo 不存在 | PASS | normalized error |
| Integration | Coding Agent 读取 repo summary | PASS | trace screenshot |

相关站内内容：

- [MCP Server Testing Harness](/note/Engineering/mcp-server-testing-harness)
- [MCP Tool Schema 设计](/note/Engineering/mcp-tool-schema-design)
- [MCP Observability Metrics](/note/Engineering/mcp-observability-metrics)

---

## 5. Demo 页面应该展示什么

一个优秀 MCP Server 作品集页面，不要只贴代码仓库链接。建议展示 5 个证据块：

1. **能力卡片**：tools / resources / prompts 分别有哪些。
2. **调用链路图**：Agent → MCP Client → MCP Server → 本地/远端系统。
3. **安全策略**：读、写、网络、命令、审批等级。
4. **Trace 示例**：一次成功调用、一次被拦截调用、一次失败恢复。
5. **评测结果**：schema 通过率、权限拦截率、平均延迟、失败分类。

示例页面结构：

```markdown
## Repo Context MCP Server

### Problem
Coding Agent 做任务前缺少稳定 repo context，容易误改文件、漏跑测试。

### Capabilities
- tools: repo.search_files, repo.read_file, repo.run_test
- resources: repo://summary, repo://recent-diff
- prompts: review_changed_files, write_test_plan

### Security
- read-only 默认允许
- run_test 只允许白名单命令
- write/delete/network 需要人工审批

### Evaluation
- 36 schema cases
- 12 sandbox cases
- 8 failure injection cases
```

---

## 6. 面试讲法

一句话版本：

> 我做的不是一个单点工具，而是一个面向 Coding Agent 的 MCP Server：它把 repo context、文件检索、测试命令和 review prompt 统一成可治理接口，并用 schema、sandbox、审批、audit 和测试 harness 保证 Agent 调用安全可控。

三分钟版本：

1. **背景**：Agent 写代码前需要可信 repo context，否则容易误判项目结构。
2. **设计**：把能力拆成 tools、resources、prompts，避免所有能力都塞进一个 tool。
3. **治理**：对路径、命令、敏感文件、输出内容做权限和脱敏。
4. **评测**：用 schema case、sandbox case、failure injection 和 integration trace 验证。
5. **结果**：Agent 可以稳定获取上下文、运行测试、生成 review 计划，同时危险操作会进入审批。

---

## 7. 作品集落地清单

- [ ] 选定一个真实场景，例如 Repo Context / JD Match / RAG Admin。
- [ ] 列出 3-5 个 tools，2-3 个 resources，2 个 prompts。
- [ ] 每个 tool 写清楚 input schema、output schema、错误格式。
- [ ] 给每个 tool 标注风险等级和审批策略。
- [ ] 写 schema、sandbox、failure injection、integration 测试。
- [ ] 做一张控制台或 README 证据图。
- [ ] 写一分钟介绍和深挖问答。

下一步可以继续看：

- [Agent Builder Hub](/topics/agent-builder-hub)
- [MCP Server Template for Agents](/note/Engineering/mcp-server-template-for-agents)
- [Project C：MCP Gateway 与 Skill Hub](/projects/project-c-mcp-gateway-skill-hub)
- [MCP Server 面试答辩](/topics/mcp-server-interview-playbook)

---

## 参考资料

- [Model Context Protocol：Understanding MCP servers](https://modelcontextprotocol.io/docs/learn/server-concepts)
- [Model Context Protocol：Build an MCP server](https://modelcontextprotocol.io/quickstart)
- [OpenAI Agents SDK：Model Context Protocol](https://openai.github.io/openai-agents-js/guides/mcp/)
- [OpenAI Apps SDK 说明](https://help.openai.com/en/articles/12515353-build-with-the-apps-sdk)
