# API 安全与工具权限控制

## 这一节解决什么问题

AI Agent 能调用外部工具执行真实操作——查询数据库、读写文件、调用第三方 API、发送消息。这意味着 Agent 拥有"执行权"，如果权限控制不当，可能导致数据泄露、越权操作、甚至系统被攻破。传统的 API 安全（认证、授权、限流）在 Agent 场景下需要扩展，因为"用户"不再只是人，还包括模型生成的工具调用请求。

## 核心概念

**API Key**：服务端颁发的访问凭证，用于标识调用方身份。Agent 调用外部 API 时需要携带 API Key。

**用户权限 vs 工具权限**：用户权限决定"这个用户能调用哪些工具"，工具权限决定"这个工具能执行哪些操作"。两层权限需要独立管理。

**参数校验**：模型生成的工具参数可能不符合预期（格式错误、类型错误、恶意注入），必须在执行前做严格校验。

**高风险操作确认**：删除数据、发送邮件、修改配置等操作不能自动执行，需要人工确认。

**限流**：防止工具被过度调用，保护下游服务不被打垮。

**审计日志**：记录每次工具调用的输入、输出、执行时间、调用者身份，用于事后审计和问题追溯。

**敏感信息脱敏**：工具执行结果可能包含敏感信息（密码、token、个人数据），注入上下文前需要脱敏。

## 工程化设计

API 安全的工程设计分为四层：

**第一层：认证**。所有请求必须携带有效的 API Key 或 JWT Token。Agent 调用外部 API 时，API Key 由系统管理，不暴露给模型。

**第二层：授权**。根据用户角色和工具权限决定是否允许调用。工具权限在注册时声明，系统在调用前检查。

**第三层：参数校验**。用 JSON Schema 校验模型生成的参数格式，用白名单限制参数值范围，用正则表达式过滤危险字符。

**第四层：执行控制**。高风险操作进入人工审批流程，普通操作直接执行。执行结果经过脱敏处理后再返回给模型。

权限控制不能只交给 Prompt。Prompt 层面的限制（如"不要执行删除操作"）可以被 Prompt 注入攻击绕过。必须在系统层面做强制性的权限检查。

## 最小实现思路

```python
# 工具注册时声明权限
TOOLS = {
    "query_database": {
        "permission": "read",
        "risk_level": "low",
        "schema": {...},
    },
    "delete_record": {
        "permission": "write",
        "risk_level": "high",
        "requires_approval": True,
        "schema": {...},
    },
}

# 调用前检查
def execute_tool(tool_name, params, user):
    tool = TOOLS[tool_name]

    # 1. 认证检查
    if not user.is_authenticated:
        raise PermissionError("Authentication required")

    # 2. 授权检查
    if not user.has_permission(tool["permission"]):
        raise PermissionError(f"Missing permission: {tool['permission']}")

    # 3. 参数校验
    validate_params(params, tool["schema"])

    # 4. 高风险操作审批
    if tool.get("requires_approval"):
        if not request_human_approval(tool_name, params):
            raise ApprovalRequired("This operation requires human approval")

    # 5. 执行
    result = tool["handler"](**params)

    # 6. 结果脱敏
    sanitized = sanitize_result(result)

    # 7. 审计日志
    log_tool_call(tool_name, params, sanitized, user)

    return sanitized
```

## 生产环境注意点

**API Key 管理**：API Key 存储在环境变量或密钥管理系统中，不写入代码、不暴露给模型、不记录到日志。定期轮换 Key。

**参数注入防护**：SQL 注入、路径遍历、命令注入等攻击可能通过模型参数传入。必须用参数化查询、路径白名单、命令白名单等手段防护。

**限流策略**：按用户、按工具、按时间窗口限流。防止模型被诱导大量调用工具导致下游服务过载。

**敏感信息脱敏**：工具返回的数据中可能包含密码、token、手机号等敏感信息，注入模型上下文前需要脱敏或截断。

**审计日志**：记录每次工具调用的完整信息（调用者、工具名、参数、结果、时间），保留至少 30 天，用于安全审计和问题追溯。

## 常见误区

1. **只靠 Prompt 做权限控制**：Prompt 限制可以被注入攻击绕过，必须在系统层面做强制检查。
2. **不做参数校验就执行**：模型生成的参数可能包含恶意内容，必须校验后才能执行。
3. **不记录工具调用日志**：没有日志就无法审计和追溯，出问题时无法定位原因。
4. **API Key 暴露给模型**：模型可能在输出中泄露 Key，API Key 应由系统管理。
5. **高风险操作自动执行**：删除、发送等操作必须有人工确认环节。

## 面试表达

Agent 的工具调用意味着模型能触发真实世界的操作，所以 API 安全和权限控制是 Agent 系统最重要的安全环节。权限控制分四层：认证（验证调用者身份）、授权（检查是否有权限调用该工具）、参数校验（验证参数格式和值范围）、执行控制（高风险操作需要人工确认）。

一个关键原则是"不信任模型输出"。模型生成的参数可能包含注入攻击，Prompt 层面的限制可以被绕过，所以权限控制必须在系统层面做。工具调用需要完整记录审计日志，结果需要脱敏后再注入上下文。这些是 Agent 安全的基本工程要求。

## 相关链接

- [Tool Calling](/note/AI-Agent/tool-calling) — 工具调用机制
- [Human-in-the-loop](/note/AI-Agent/human-in-the-loop) — 人工审批节点
- [LLM 工具调用面试题](/note/AI-Interview/llm-tools-interview) — 权限控制面试题
