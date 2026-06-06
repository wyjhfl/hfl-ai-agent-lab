# Agent 工具沙箱与权限边界：让工具调用可控

## 这篇文章解决什么问题

Tool Calling 是 Agent 从“会说”走向“会做”的关键。但工具一旦能执行真实动作，风险也会急剧上升：

- 模型误调用删除工具。
- Prompt Injection 诱导 Agent 泄漏数据。
- MCP Server 暴露了过大的文件或网络权限。
- 用户越权访问其他租户的数据。
- 工具参数未经校验，导致命令注入或 SQL 注入。
- Agent 在没有审批的情况下发送邮件、创建订单、写数据库。

工具沙箱的目标是：让 Agent 能调用工具，但只能在被允许的范围内调用，并且每次调用都可审计、可回放、可阻断。

## 权限边界分层

| 层级 | 解决的问题 |
|---|---|
| 用户权限 | 这个用户能访问什么数据、执行什么业务动作 |
| Agent 权限 | 当前 Agent 被授权做什么任务 |
| 工具权限 | 工具本身是否允许读/写/删除/外联 |
| 参数权限 | 具体参数是否在允许范围内 |
| 环境权限 | 文件系统、网络、进程、密钥是否隔离 |
| 审批权限 | 高风险动作是否需要人确认 |
| 审计权限 | 谁在什么时候因为什么调用了工具 |

不要只做“工具白名单”。真正的权限控制要下沉到参数和环境。

## 工具风险分级

| 风险等级 | 工具例子 | 控制方式 |
|---|---|---|
| L0 只读低风险 | 查询公开文档、格式转换 | 直接允许，记录 Trace |
| L1 只读敏感 | 查询用户订单、读取私有文件 | 需要用户权限和数据过滤 |
| L2 可写低风险 | 创建草稿、生成报告 | 参数校验 + 可撤销 |
| L3 可写高风险 | 发送邮件、创建工单、写 CRM | 人工审批 + 幂等 |
| L4 危险操作 | 删除数据、付款、执行命令 | 默认禁止或强审批 |

工具注册时就应该声明风险等级：

```json
{
  "name": "send_email",
  "risk_level": "L3",
  "side_effect": true,
  "requires_approval": true,
  "allowed_roles": ["operator", "admin"]
}
```

## 参数校验

模型生成的工具参数不可信。必须做：

- JSON Schema 校验。
- 类型校验。
- enum 限制。
- 长度限制。
- 路径归一化。
- URL 域名 allowlist。
- SQL 参数化。
- 文件扩展名和 MIME 校验。
- 金额、数量、时间范围限制。

示例：文件路径工具不能直接接受任意路径：

```text
bad: read_file("C:\\Users\\...\\secret.txt")

better:
  base_dir = workspace_root
  normalized = resolve(base_dir, requested_path)
  assert normalized starts_with base_dir
```

## MCP Server 的安全边界

MCP Server 很适合把外部系统标准化接入 Agent，但也容易把权限放大。

需要检查：

- 这个 server 暴露了哪些 tools/resources/prompts？
- 是否默认能读取整个工作区？
- 是否能访问网络？
- 是否能执行 shell？
- 返回内容是否可能包含隐藏指令？
- 工具 schema 是否足够严格？
- 是否有鉴权和租户隔离？
- 是否记录调用审计？

MCP 不是天然安全边界，它只是工具协议。安全边界需要业务系统自己设计。

## 沙箱策略

### 1. 文件沙箱

- 限制根目录。
- 禁止 `..` 路径逃逸。
- 禁止读取密钥文件。
- 上传文件先落隔离区。
- 文件写入使用临时文件 + 原子替换。

### 2. 网络沙箱

- 域名 allowlist。
- 禁止访问内网元数据地址。
- 区分只读 API 和写 API。
- 外部请求设置超时和大小限制。

### 3. 命令沙箱

- 默认不允许模型生成任意 shell。
- 使用参数化工具代替 shell。
- 命令执行必须有白名单。
- 高风险命令必须审批。
- 不把密钥注入模型可见上下文。

### 4. 数据沙箱

- 所有查询带 tenant_id / user_id。
- metadata filter 在检索阶段执行。
- 日志脱敏。
- 返回给模型的数据最小化。

## 审批设计

审批不是弹窗问一句“是否继续”，而是要让人看懂风险：

| 审批展示 | 内容 |
|---|---|
| 动作 | 工具名称和业务含义 |
| 参数 | 关键字段摘要 |
| 影响范围 | 会修改什么对象 |
| 证据 | Agent 为什么要这么做 |
| 风险 | 是否可撤销、是否外发 |
| 替代方案 | 取消、修改参数、只生成草稿 |

审批结果也要写入 Trace。

## Prompt Injection 防护

工具系统要假设 RAG 文档、网页、邮件都可能包含恶意指令。防护原则：

- 外部内容只能作为数据，不作为系统指令。
- 工具调用决策必须依据系统规则和用户授权。
- 高风险动作必须二次确认。
- 引用证据和执行指令分离。
- 对“忽略之前规则”“读取密钥”等指令做检测。

参考：[Agent 安全威胁模型](/note/Engineering/agent-security-threat-model)。

## 面试表达模板

> 我会把 Agent 工具调用放在沙箱和权限系统里，而不是让模型直接调用任意函数。工具会按只读、敏感读、低风险写、高风险写、危险操作分级；每个工具声明 side effect、risk level、allowed roles 和是否需要审批。模型生成的参数必须经过 schema、路径、URL、租户、范围校验。文件、网络、命令和数据访问都有沙箱边界。高风险动作会展示参数、影响范围、证据和风险给用户审批，审批结果写入 Trace。MCP Server 只是协议，不是安全边界，所以仍然要做鉴权、权限过滤和审计。

## 项目落地清单

- [ ] 工具注册表包含风险等级。
- [ ] 每个工具有 schema 和参数校验。
- [ ] 文件路径不能逃逸 workspace。
- [ ] 网络访问有 allowlist。
- [ ] 命令执行默认禁止任意 shell。
- [ ] RAG 检索带权限 metadata filter。
- [ ] 高风险工具需要审批。
- [ ] 工具调用写入 Trace。
- [ ] Prompt Injection 作为测试集覆盖。
- [ ] MCP Server 权限经过审计。

## 相关链接

- [Tool Calling](/note/AI-Agent/tool-calling)
- [Tool Calling 工程化](/topics/tool-calling-engineering)
- [MCP Server 创建实战](/note/Engineering/mcp-server-build-guide)
- [API 安全与工具权限控制](/note/Engineering/api-security)
- [Agent 安全威胁模型](/note/Engineering/agent-security-threat-model)
