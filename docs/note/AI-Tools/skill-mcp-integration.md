# Skill 与 MCP 组合实战：让 Agent 会做事，也会按流程做对

Skill 和 MCP 解决的是两个不同问题：

- **MCP** 给 Agent 外部能力：读数据、调 API、执行动作、暴露资源和 Prompt。
- **Skill** 给 Agent 过程知识：什么时候问问题、怎么选方案、怎么生成代码、怎么验证、怎么交付。

把两者组合起来，才能把“可调用工具”升级成“可复用工程能力”。

## 组合模式

| 模式 | 说明 | 适合场景 |
|---|---|---|
| Skill 调用 MCP | Skill 规定流程，Agent 在流程中调用 MCP 工具 | 数据分析、PR 审查、项目巡检 |
| Skill 生成 MCP | Skill 指导 Agent 创建 MCP Server | 为企业 API、数据库、内部系统做 AI 接口 |
| MCP 暴露 Prompt，Skill 管理流程 | MCP 提供 domain prompt，Skill 管理开发/测试/上线 | 领域工作流平台 |
| Skill + references 固化 MCP 规范 | 把 tool schema、auth、错误码、部署模板放进 references | 团队统一 MCP Server 标准 |

## 一个好用的 MCP 开发 Skill 应该包含什么

```text
build-enterprise-mcp-server/
  SKILL.md
  references/
    deployment-models.md
    tool-design-patterns.md
    auth-and-permissions.md
    testing-harness.md
  assets/
    tool-contract-template.md
    server-readme-template.md
  scripts/
    validate_tool_schema.py
```

### SKILL.md 只放核心流程

- 什么时候使用该 Skill。
- 先做 discovery，不急着写代码。
- 根据场景选择 stdio / HTTP / MCPB / MCP App。
- 生成 tool contract，再生成实现。
- 必须跑 schema 校验、smoke test、权限测试。

### references 放细节

- OAuth / API Key / no-auth 选择。
- Tool risk classification。
- Elicitation 使用边界。
- Error code 和 audit log 规范。
- CI/CD 和发布清单。

## Discovery 问题模板

1. 这个 MCP Server 连接什么系统：云 API、本地文件、数据库、桌面应用，还是硬件？
2. 谁会用：个人、团队、企业租户，还是公开发布？
3. 工具数量：几个高价值动作，还是要包装一整个 API？
4. 是否需要写操作：读、写、删除、发送消息、付款、部署？
5. 是否需要用户补信息：普通表单、复杂 UI、OAuth、secret？
6. 是否需要审计：trace、approval、replay、合规日志？

## Tool Contract 模板

```markdown
## Tool: create_ticket

- Purpose: 根据已确认的问题描述创建工单。
- Not for: 模糊咨询、未确认用户身份、批量创建。
- Input schema:
  - title: string, 5-80 chars
  - severity: enum P0/P1/P2/P3
  - assignee: optional string
- Risk level: write
- Approval: P0/P1 需要人工确认
- Output:
  - ok: boolean
  - ticketId: string
  - url: string
  - error.code: enum
- Tests:
  - success
  - missing title
  - invalid severity
  - permission denied
  - upstream timeout
```

## 验收清单

- [ ] Skill description 能准确触发，不会覆盖所有编程任务。
- [ ] `SKILL.md` 不超过核心流程，细节放到 references。
- [ ] MCP tool contract 先于代码实现。
- [ ] 每个 tool 有 schema、错误码、风险等级和测试样例。
- [ ] stdio server 不向 stdout 打普通日志。
- [ ] 需要用户补信息时区分 elicitation、approval、auth。
- [ ] 高风险动作进入人工确认和审计。
- [ ] 交付物包含 README、配置示例、测试命令、上线清单。

## 求职项目怎么包装

可以把这个组合做成作品集项目：

> 我设计了一个“企业 MCP Server 生成 Skill”。它会先询问外部系统、用户范围、动作风险、认证方式和部署模型，再生成 Tool Contract、MCP Server 脚手架、测试样例和上线清单。这样团队新增 MCP 工具时，不再依赖临时提示词，而是走统一的工程流程。

## 参考资料

- [Agent Skills Overview](https://agentskills.io/)
- [Agent Skills Specification](https://agentskills.io/specification)
- [Best practices for skill creators](https://agentskills.io/skill-creation/best-practices)
- [Build with Agent Skills](https://modelcontextprotocol.io/docs/develop/build-with-agent-skills)
- [Build an MCP Server](https://modelcontextprotocol.io/docs/develop/build-server)
