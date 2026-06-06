# AI 编程工具与项目导师工作流

这个栏目用于整理 Claude Code、Codex 等 AI 编程工具在项目推进中的使用方式。重点不是简单介绍工具，而是总结如何把它们组织成"教学式项目导师"和"版本迭代助手"。

## 核心模块

| 模块 | 内容 |
|------|------|
| Claude Code 拆解 | 仓库级修改、批量重构、文档整理、构建检查、Git 提交 |
| Codex 拆解 | IDE 内代码生成、局部实现、函数级修改、教学式开发 |
| AI Coding Workflow | ChatGPT 规划 + Claude Code / Codex 执行的完整工作流 |
| Skills 编写 | 把重复提示词沉淀成可复用工作流，包含 `SKILL.md`、脚本、参考资料和验收标准 |
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

## 当前状态

当前已经形成 AI 编程协作、Claude Code、Codex 和 Skills 编写四个入口。后续继续补充 MCP 工具创建、项目导师工作流和版本迭代案例。
