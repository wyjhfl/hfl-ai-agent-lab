# Tool Call Replay Debugging：工具调用失败如何回放排查

## 这篇文章解决什么问题

Agent 失败经常发生在工具调用环节：参数错、权限错、外部 API 超时、MCP Server schema 变更、工具返回结构不符合预期。只看最终答案，很难知道是模型选错工具、参数生成错、执行层拒绝，还是工具本身失败。

Tool Call Replay Debugging 的目标是把一次工具调用变成可重放、可对比、可归因的调试对象。

## 需要记录什么

一次工具调用至少记录：

| 字段 | 说明 |
|---|---|
| run_id / step_id | 关联 Agent 执行 |
| tool_call_id | 工具调用 ID |
| tool_name | 工具名 |
| schema_version | 工具 schema 版本 |
| args_raw | 原始参数，敏感字段脱敏 |
| args_hash | 参数 hash |
| args_validated | 校验后的参数 |
| caller_context | 用户、租户、角色、权限摘要 |
| prompt_version | 生成参数的 Prompt |
| model | 生成参数的模型 |
| policy_result | 权限和风险判断 |
| approval_id | 审批记录 |
| response | 工具返回摘要 |
| error_code | 错误码 |
| latency_ms | 耗时 |

没有这些字段，工具失败只能靠猜。

## Replay 类型

| 类型 | 目的 |
|---|---|
| dry replay | 不真正执行副作用，只校验参数和策略 |
| mock replay | 使用录制的工具返回测试 Agent 后续逻辑 |
| live replay | 在隔离环境重新执行工具 |
| diff replay | 对比新旧工具 schema 或新旧 Prompt |
| regression replay | 把失败样本加入回归测试 |

写操作默认不能 live replay，除非在沙箱或测试环境。

## 回放流程

1. 选择失败 tool_call_id。
2. 还原当时的 schema_version、prompt_version、policy_version。
3. 读取脱敏参数和上下文摘要。
4. 先做 dry replay：参数校验、权限校验、审批校验。
5. 如果 dry replay 通过，再用 mock response 检查 Agent 后续步骤。
6. 必要时在 staging 做 live replay。
7. 对比当前版本和失败版本差异。
8. 写入失败归因和回归样本。

Replay 的核心是还原“当时环境”，而不是拿当前代码随便跑一遍。

## 失败归因

| 归因 | 现象 |
|---|---|
| tool_selection_error | 模型选错工具 |
| args_generation_error | 参数字段缺失、类型错、枚举错 |
| schema_mismatch | 工具 schema 变化导致调用失败 |
| permission_denied | 权限或租户不匹配 |
| approval_missing | 高风险工具缺少审批 |
| external_timeout | 外部服务超时 |
| response_parse_error | 工具返回结构无法解析 |
| side_effect_conflict | 写操作重复或状态冲突 |
| policy_regression | 新策略误拦截或漏拦截 |

失败归因要进入错误分类和评测集，不能只在复盘里写一句“工具失败”。

## 安全注意事项

工具回放很容易造成二次副作用：

- 写操作必须默认 dry replay。
- live replay 只能在隔离环境。
- 参数中的 token、密钥、PII 必须脱敏。
- 回放环境使用测试账号和测试租户。
- 审批通过不能自动复用到回放。
- 回放日志也要进入审计。

Debug 不能成为绕过审批和权限的后门。

## 面试表达模板

我会为每次工具调用记录 tool_call_id、schema_version、args_hash、policy_result、approval_id、response、error_code 和 latency。工具失败后先做 dry replay，还原当时的 Prompt、schema 和策略版本，判断是参数生成、schema 漂移、权限、审批、外部超时还是返回解析问题。写操作不会直接 live replay，而是在隔离环境或 mock response 下回放，最后把失败样本加入 regression set。

## 常见误区

### 误区一：工具失败只看错误堆栈

堆栈只能说明执行层出错，不能说明模型为什么生成这个工具调用。

### 误区二：回放就是重新执行一遍

高风险工具不能随便 live replay，必须区分 dry、mock 和 live。

### 误区三：只修当前 bug，不沉淀回归

工具调用失败很容易重复出现，必须转成 contract test 或 conversation regression。

## 相关链接

- [Tool Registry 工程化](/note/Engineering/tool-registry-engineering)
- [Agent Contract Testing](/topics/agent-contract-testing)
- [Conversation Regression Testing](/topics/conversation-regression-testing)
- [MCP Client 测试](/note/Engineering/mcp-client-testing)
- [Agent 错误分类](/note/Engineering/agent-error-taxonomy)
