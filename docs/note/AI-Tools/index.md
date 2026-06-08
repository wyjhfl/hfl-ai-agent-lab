# AI 编程工具与项目导师工作流

这个栏目用于整理 Claude Code、Codex 等 AI 编程工具在项目推进中的使用方式。重点不是简单介绍工具，而是总结如何把它们组织成"教学式项目导师"和"版本迭代助手"。

## 核心模块

| 模块 | 内容 |
|------|------|
| Claude Code 拆解 | 仓库级修改、批量重构、文档整理、构建检查、Git 提交 |
| Codex 拆解 | IDE 内代码生成、局部实现、函数级修改、教学式开发 |
| AI Coding Workflow | ChatGPT 规划 + Claude Code / Codex 执行的完整工作流 |
| Skills 编写 | 把重复提示词沉淀成可复用工作流，包含 `SKILL.md`、脚本、参考资料和验收标准 |
| Skill 与 MCP 组合实战 | 用 Skill 固化 MCP Server 创建、测试和上线流程，让 Agent 既会调用工具，也会按流程做对 |
| Skill 评测闭环 | 用触发测试、执行轨迹复盘、输出 rubric 和回归样例持续改进 Skill |
| Skill 测试与版本管理 | 让可复用能力有版本号、changelog、触发测试、流程测试、安全测试和回归样例 |
| Skill Review Checklist | 像代码审查一样检查 Skill 的触发、流程、渐进加载、脚本、验收标准和安全边界 |
| MCP Tool Schema 设计 | 把工具命名、参数、输出、错误、风险等级和版本管理做成可复用规范 |
| MCP Server Hardening | 把 MCP 工具服务的参数校验、风险分级、超时、审计和 schema version 做成上线前必查项 |
| MCP Supply Chain Risk | 管理 MCP Server 来源、版本 pin、schema diff、依赖、沙箱和工具返回内容注入风险 |
| Skill 运营手册 | 把 Skill 的版本、触发、测试、反馈、漂移和废弃做成长期维护流程 |
| AGENTS.md / Skill | 项目提示词、版本迭代推进方式 |

## 工具定位

### ChatGPT

负责规划、审查、提示词生成。适合做架构讨论、版本目标制定、代码审查和提示词优化。

### Claude Code

负责仓库执行、文档重构、构建检查。适合批量文件修改、站点结构调整、多文件内容同步。

### Codex

负责代码实现、IDE 内辅助、局部开发。适合函数实现、测试补全、接口修改、代码解释。

### Skills

负责把重复工作流固化下来。适合博客内容批次、项目版本推进、简历材料整理、MCP 工具创建等需要固定步骤和验收标准的任务。

## 工作流核心思想

用 ChatGPT 做规划和审查，用 Claude Code / Codex 做仓库级执行和版本推进。每个工具各司其职，避免让一个工具做所有事。

## 推荐阅读路径

| 目标 | 推荐内容 |
|---|---|
| 建立 AI 编程工具分工 | [AI Coding Workflow](/note/AI-Tools/ai-coding-workflow) |
| 学仓库级协作 | [Claude Code 拆解](/note/AI-Tools/claude-code) |
| 学局部代码实现 | [Codex 拆解](/note/AI-Tools/codex) |
| 把流程沉淀成可复用能力 | [Skills 编写](/note/AI-Tools/skill-authoring) |
| 测试和演进 Skill | [Skill 测试与版本管理](/note/AI-Tools/skill-testing-versioning) → [Skill Review Checklist](/note/AI-Tools/skill-review-checklist) → [Skill 运营手册](/note/AI-Tools/skill-operations-playbook) |
| 把 Skill 和 MCP 组合成项目能力 | [Skill 与 MCP 组合实战](/note/AI-Tools/skill-mcp-integration) → [MCP、Tools 与 Skills 选型](/topics/mcp-skills-agent-extension-strategy) → [MCP Server Testing Harness](/note/Engineering/mcp-server-testing-harness) → [Skill 评测闭环](/note/AI-Tools/skill-evaluation-loop) |
| 创建可治理 MCP 工具 | [MCP Tool Schema 设计](/note/Engineering/mcp-tool-schema-design) → [MCP Server 创建实战](/note/Engineering/mcp-server-build-guide) → [MCP Server Template for Agents](/note/Engineering/mcp-server-template-for-agents) → [MCP Server Hardening](/note/Engineering/mcp-server-hardening) → [MCP 供应链风险](/note/Engineering/mcp-supply-chain-risk) |

## 当前状态

当前已经形成 AI 编程协作、Claude Code、Codex、Skills 编写、Skill 测试版本管理、Skill Review Checklist、Skill 运营手册、Skill 与 MCP 组合实战、Skill 评测闭环、MCP Tool Schema、MCP Server Template、MCP Server Hardening 和 MCP Server Testing Harness 等入口。后续继续补充项目导师工作流、MCP Server 生成模板、版本迭代案例和自动化验收流程。
