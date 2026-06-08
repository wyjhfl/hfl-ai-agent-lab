# 30 天 Agent Builder Demo 路线：做一个能展示、能答辩、能迭代的项目

这是一条面向个人作品集的 30 天路线。目标不是堆很多 demo，而是做一个能讲清楚架构、工具、评测、安全和产品价值的 Agent 项目。

推荐项目题目：

> **Repo Context Coding Agent**：一个能读取仓库上下文、生成任务计划、调用 MCP 工具、运行测试、输出 PR 说明和审查报告的 Coding Agent Workbench。

如果你更想做 RAG 或多模态，也可以替换业务场景，但 30 天结构不变。

---

## Week 1：定义问题和上下文

目标：把项目从“想做一个 Agent”变成有边界的产品需求。

### Day 1：写 PRD

产物：

- 用户是谁：个人开发者、团队 reviewer、面试官。
- 输入是什么：issue、需求描述、仓库路径、最近 diff。
- 输出是什么：任务计划、风险文件、测试建议、PR summary。
- 不做什么：不自动部署、不删除文件、不读取 secret。

参考：[AI Agent PRD 模板](/topics/ai-agent-prd-template)

### Day 2：定义能力矩阵

| 能力 | 是否必须 | 证据 |
|---|---:|---|
| Repo context packing | 必须 | repo summary resource |
| Tool calling | 必须 | MCP tool trace |
| Test gate | 必须 | test result screenshot |
| Human approval | 推荐 | approval mock |
| Eval report | 必须 | scorecard |

参考：[Agent Capability Matrix](/topics/agent-capability-matrix)

### Day 3-4：准备样例仓库和任务集

至少准备 10 个任务：

- 修复一个 bug。
- 添加一个小功能。
- 补一个测试。
- 重构一个函数。
- 更新一段文档。
- 处理一个失败测试。
- 识别一个危险操作。
- 解释一个复杂模块。
- 生成 PR summary。
- 做代码审查。

### Day 5-7：完成项目页面骨架

先建好作品集页面，不等项目完全写完：

- Problem
- Architecture
- Workflow
- MCP Tools
- Eval
- Security
- Demo Script
- Interview Notes

---

## Week 2：实现 MCP 工具与 Skill 流程

目标：让 Agent 拥有可治理的外部能力。

### Day 8-10：设计 MCP Server

最小工具集：

- `repo.summary`：返回仓库概览。
- `repo.search_files`：检索文件和片段。
- `repo.read_file`：读取安全路径内文件。
- `repo.run_test`：执行白名单测试命令。
- `repo.diff_summary`：总结改动。

资源：

- `repo://summary`
- `repo://recent-diff`
- `repo://quality-gates`

Prompts：

- `review_changed_files`
- `write_test_plan`

参考：[MCP Server 从零到作品集](/topics/mcp-server-from-zero-to-portfolio)

### Day 11-12：加入沙箱和审批

规则：

- 读文件只允许 workspace。
- `.env`、证书、token 文件默认拦截。
- `run_test` 只允许白名单命令。
- 写文件、删除、网络访问必须人工确认。

参考：

- [MCP Sandbox Profile](/note/Engineering/mcp-sandbox-profile)
- [Agent Approval Workflow](/note/Engineering/agent-approval-workflow)

### Day 13-14：沉淀 Skill

写一个 `coding-agent-task-runner` Skill：

- 输入 issue。
- 收集 repo context。
- 生成任务计划。
- 调用工具。
- 运行测试。
- 输出 PR summary 和风险说明。

参考：[Agent Skill Playbook](/topics/agent-skill-playbook)

---

## Week 3：做 UI、Trace 和评测

目标：让项目从命令行 demo 变成可展示产品。

### Day 15-17：做控制台 UI

页面至少包含：

- 左侧任务列表。
- 中间 Agent plan / trace timeline。
- 右侧 tool calls / approvals / test gates。
- 底部输出 PR summary。

参考：[Agent UI Pattern Library](/topics/agent-ui-pattern-library)

### Day 18-20：加入 Trace

每次运行记录：

- user request
- context pack
- model decision
- tool call
- tool result
- approval event
- test result
- final answer

参考：

- [Agent Trace 执行轨迹](/note/Engineering/agent-trace)
- [Agent Run Replay](/note/Engineering/agent-run-replay)

### Day 21：写 Eval Scorecard

最小评分项：

| 指标 | 含义 |
|---|---|
| task success | 是否完成任务 |
| test correctness | 是否运行并通过正确测试 |
| file relevance | 是否改了相关文件 |
| safety | 是否避免危险操作 |
| explanation quality | PR summary 是否可读 |

参考：[LLM Evaluation Scorecard](/note/Engineering/llm-evaluation-scorecard)

---

## Week 4：上线包装与面试材料

目标：让项目可以被招聘方快速理解。

### Day 22-24：做 Demo 脚本

准备三条演示路径：

1. 成功路径：输入 issue → 生成计划 → 调用工具 → 运行测试 → 输出 PR summary。
2. 风险路径：尝试读取 secret → 被 sandbox 拦截 → 写入 audit log。
3. 失败恢复：测试失败 → Agent 解释失败原因 → 给出下一步建议。

参考：[AI Agent Demo Acceptance Script](/topics/ai-agent-demo-acceptance-script)

### Day 25-26：写项目文章

项目文章不要写成流水账。建议结构：

1. 背景问题。
2. 架构图。
3. 核心 workflow。
4. MCP tools 设计。
5. Skill 封装。
6. Eval 和安全。
7. Demo 和截图。
8. 面试讲法。

参考：[AI Agent 作品集 Case Study 模板](/topics/ai-agent-portfolio-case-study-template)

### Day 27-28：准备面试问答

高频追问：

- 为什么不用普通 function calling？
- MCP Server 怎么做权限隔离？
- Agent 如何决定什么时候调用工具？
- 测试失败怎么恢复？
- 如何评测这个 Agent 是否真的有用？
- 如何防止 prompt injection 或工具滥用？

参考：[AI Agent 面试追问地图](/topics/ai-agent-interview-followup-map)

### Day 29：做作品集审查

检查：

- 首页是否能在 15 秒内看懂项目价值。
- 项目页是否有架构、UI、评测、安全和 Demo 证据。
- 简历 bullet 是否和项目证据一致。
- 面试讲法是否能支撑深挖问题。

参考：[AI Agent Offer Portfolio Review](/topics/ai-agent-offer-portfolio-review)

### Day 30：发布和复盘

发布前执行：

- 构建通过。
- 链接可访问。
- Demo 脚本可复现。
- 测试结果截图保存。
- README 与博客互相链接。

复盘内容：

- 哪些能力已经可证明？
- 哪些只是文档，还缺代码或截图？
- 下一版要补什么指标？

---

## 最终交付物清单

- [ ] 一个可运行的 Agent Demo。
- [ ] 一个 MCP Server。
- [ ] 一个 Skill 或可复用 workflow。
- [ ] 一个控制台 UI 或截图 mock。
- [ ] 一份 Eval Scorecard。
- [ ] 一份安全/审批策略。
- [ ] 一份 Demo 脚本。
- [ ] 一篇项目 case study。
- [ ] 一份面试深挖问答。

完成后，可以把项目挂到：

- [项目实战](/projects)
- [Agent Builder Hub](/topics/agent-builder-hub)
- [项目面试表达](/note/Interview/)
- [能力证据地图](/topics/ai-agent-job-search-evidence-map)

---

## 参考资料

- [Model Context Protocol：Understanding MCP servers](https://modelcontextprotocol.io/docs/learn/server-concepts)
- [OpenAI Agents SDK：MCP guide](https://openai.github.io/openai-agents-js/guides/mcp/)
- [Claude Docs：Skills overview](https://claude.com/docs/skills/overview)
