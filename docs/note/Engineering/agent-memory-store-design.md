# Agent Memory Store Design：Agent 记忆存储怎么设计

## 这篇文章解决什么问题

Agent Memory 不能只是“把历史对话存进数据库”。长期记忆会影响未来决策，必须处理写入标准、更新、遗忘、隐私、权限、检索和评测。

Agent Memory Store 的目标是让记忆可控、可解释、可删除、可评估。

## 记忆类型

| 类型 | 示例 | 生命周期 |
|---|---|---|
| 用户偏好 | 喜欢中文回答、偏好表格 | 长期，可用户修改 |
| 项目上下文 | 当前项目技术栈、目标 | 项目周期 |
| 工作流状态 | 某个长任务进展 | run / task 周期 |
| 事实记忆 | 公司政策、个人信息 | 需要权限和过期时间 |
| 负面记忆 | 用户不希望记录什么 | 长期，优先级高 |

## Memory Schema

| 字段 | 说明 |
|---|---|
| memory_id | 唯一 ID |
| tenant_id / user_id | 权限边界 |
| scope | global、project、task、session |
| memory_type | preference、fact、task_state、do_not_remember |
| content_summary | 脱敏摘要 |
| source_ref | 来自哪次对话或工具 |
| confidence | 置信度 |
| effective_from / expires_at | 生效和过期时间 |
| sensitivity | public、internal、pii、secret |
| write_policy | 自动写入、需确认、禁止写入 |
| embedding_ref | 检索向量引用 |
| version | 记忆版本 |

## 写入策略

不是所有信息都应该记住。

| 输入 | 策略 |
|---|---|
| 明确偏好 | 可写入，最好让用户可查看 |
| 临时任务信息 | 写入 task scope，不进入长期记忆 |
| PII | 默认不写，除非业务必要且有授权 |
| Secret | 永不写入 Memory |
| 用户说“不要记住” | 写入负面记忆，阻止后续写入 |
| 模型推测出的偏好 | 低置信度，需确认后升级 |

## 检索策略

Memory 注入上下文前要过滤：

1. tenant / user / project scope。
2. expires_at 是否过期。
3. sensitivity 是否允许进入模型。
4. 与当前任务是否相关。
5. 是否被 do_not_remember 覆盖。
6. token budget 是否允许。

## 用户控制

生产级 Memory 需要用户可控：

- 查看我记住了什么。
- 修改某条记忆。
- 删除某条记忆。
- 暂停记忆。
- 导出记忆。
- 项目结束后清理项目记忆。

## 评测

| 测试集 | 目标 |
|---|---|
| should_remember | 应该写入的偏好是否写入 |
| should_not_remember | 敏感或临时信息是否不写 |
| update_memory | 新信息是否覆盖旧信息 |
| forget_request | 用户要求遗忘是否生效 |
| stale_memory | 过期记忆是否不注入 |
| injection | 外部内容能否诱导写入错误记忆 |

## 面试表达

可以这样讲：

> 我不会把 Memory 简单做成聊天记录表，而是区分 preference、fact、task_state、do_not_remember 等类型，并记录 scope、sensitivity、expires_at、source_ref 和 write_policy。写入前要判断是否应该记，注入前要按权限、过期、敏感级别和相关性过滤，用户也能查看、修改和删除记忆。

## 落地检查清单

- [ ] Memory 是否有 scope 和 sensitivity？
- [ ] Secret 是否永不写入？
- [ ] 是否支持 expires_at 和 version？
- [ ] 用户能否查看/删除记忆？
- [ ] 注入前是否做权限和相关性过滤？
- [ ] 是否有 should/should-not remember 评测集？