# Project C 一分钟介绍

## 版本一：面试开场版

Project C 是一个企业 MCP Gateway 与 Skill Hub，用来解决 Agent 工具和工作流扩展后的治理问题。它把企业内部 API、数据库、工单系统和文件系统统一封装成 MCP Tools / Resources / Prompts，同时把常用开发和运营流程沉淀成 Skills。

我设计的重点不是“接入更多工具”，而是让工具可发现、可授权、可审批、可审计、可评测。Gateway 负责工具注册、schema、风险等级、权限和调用日志；Skill Hub 负责 `SKILL.md`、references、scripts、版本和评测；安全扫描负责检查工具投毒、Prompt Injection、越权资源和危险 schema。

这个项目展示的是企业级 Agent 平台能力：当 Agent 开始真正操作业务系统时，如何保证工具和 Skills 可控、可复用、可回归。

## 版本二：简历项目版

设计 Enterprise MCP Gateway & Skill Hub，将多个 MCP Server 和团队自定义 Skills 接入统一控制台，提供 Tool Registry、Skill Hub、Policy Engine、Security Scanner、Approval Center、Trace Audit 和 Eval Gate。为每个工具维护 schema、owner、risk level、approval policy 和 eval suite，为每个 Skill 维护触发描述、references、scripts、changelog 和回归样例。

## 30 秒压缩版

Project C 是一个企业 Agent 扩展能力治理平台。它用 MCP Gateway 统一管理工具、资源和 Prompt，用 Skill Hub 管理可复用工作流，用 Policy / Approval / Audit / Eval 控制安全和版本回归。这个项目证明我不仅会写 MCP Server，也能设计 MCP Server 在企业里如何被安全使用和持续维护。

## 可追问点

- MCP Gateway 和普通 MCP Server 的区别？
- 如何防止 tool poisoning？
- Tool Registry 需要哪些字段？
- Skill Hub 如何做评测？
- 高风险工具如何审批？
- Gateway 如何做多租户权限过滤？
- 工具 schema 变更如何防止回归？

## 关联材料

- [Project C 主入口](/projects/project-c-mcp-gateway-skill-hub)
- [Project C 架构设计](/projects/project-c-architecture)
- [Project C Gateway Console UI](/projects/project-c-gateway-console-ui)
- [Project C Demo 验收脚本](/projects/project-c-demo-script)
- [Project C 安全与评测方案](/projects/project-c-security-eval-plan)
