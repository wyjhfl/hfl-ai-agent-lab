# Project C 深挖问答：MCP Gateway 与 Skill Hub

> 这页用于准备 Project C 项目深挖，重点回答 MCP、Skills、安全、评测和企业平台治理问题。

## Q1：MCP Gateway 和普通 MCP Server 有什么区别？

普通 MCP Server 暴露某个系统的工具、资源和 Prompt；MCP Gateway 是多个 MCP Server 前面的统一治理层。它负责工具发现过滤、权限校验、风险分级、审批、审计、限流、版本和评测。

如果说 MCP Server 是“能力提供者”，Gateway 就是“能力治理入口”。

## Q2：为什么需要 Skill Hub？

企业里很多 Agent 工作不是单个工具调用，而是重复流程，比如 PR Review、事故复盘、周报、MCP Server 创建、数据分析报告。Skill Hub 把这些流程沉淀成可版本化包：`SKILL.md`、references、scripts、assets、eval cases 和 changelog。

这样团队不需要每次复制提示词，而是复用经过测试的工作流。

## Q3：如何防止 tool poisoning？

我会从发布前和运行时两层控制：

- 发布前扫描 tool description，禁止可疑指令、越权暗示和不一致描述。
- 工具必须有 owner、risk、schema、approval policy 和 eval suite。
- Agent 看到的是 Gateway 过滤后的工具，而不是原始全部工具。
- 工具返回内容进入 output sanitizer，避免把不可信文本当作系统指令。

## Q4：Tool Registry 需要哪些字段？

至少包括：name、serverId、owner、version、description、input schema、output schema、risk level、approval policy、allowed scopes、schema hash、eval suite、deprecatedAt 和 audit fields。

这些字段让工具可以被审查、授权、回滚、评测和审计。

## Q5：高风险工具如何审批？

工具按 read、write_draft、write、destructive 分级。write 和 destructive 默认进入 Approval Center。审批卡会展示 action preview、参数、影响范围、证据、回滚方案和调用者身份。

审批结果写入 audit log。拒绝后工具不执行，Agent 只能生成替代建议。

## Q6：Skill 如何评测？

Skill 评测包括触发测试和流程测试：

- should-trigger：明确应该调用该 Skill 的任务。
- should-not-trigger：相似但不该触发的任务。
- workflow completeness：是否按规定读取 references、运行 scripts、执行验证。
- output rubric：输出是否符合模板和质量标准。
- regression cases：历史失败样本是否修复。

## Q7：多租户权限如何设计？

Gateway 在 discovery 和 call 两层都过滤：

- discovery 层：用户看不到无权工具和资源。
- call 层：即使拿到工具名，也要校验 tenant、role、scope。
- resource 层：URI template 和查询参数必须绑定 tenant boundary。
- audit 层：每次调用记录 user、tenant、scope 和 tool version。

## Q8：怎么处理工具 schema 变更？

schema 变更必须产生 version 和 schema hash。Gateway 会跑 contract tests 和 replay tests。如果 required 字段、enum、输出结构发生 breaking change，就需要灰度、兼容层或版本并存。

## Q9：项目最大难点是什么？

最大难点是“治理复杂度”。工具越多，风险越高：schema 不一致、权限不一致、description 不可信、Skill 误触发、评测缺失。Project C 的价值就是把这些治理问题平台化。

## 面试总结句

> Project C 不是单个 MCP Server，而是企业 Agent 能力治理平台。它把 tools、resources、prompts 和 skills 纳入统一注册、权限、审批、审计和评测，让 Agent 扩展能力能被安全复用和持续演进。

## 关联材料

- [Project C 主入口](/projects/project-c-mcp-gateway-skill-hub)
- [Project C 架构设计](/projects/project-c-architecture)
- [Project C 安全与评测方案](/projects/project-c-security-eval-plan)
- [Project C Demo 验收脚本](/projects/project-c-demo-script)
