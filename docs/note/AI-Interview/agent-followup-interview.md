# Agent 面试追问库：从概念题走向工程深挖

## 这篇文章解决什么问题

很多同学能回答“Agent 是什么”“RAG 是什么”“Tool Calling 是什么”，但一遇到追问就暴露工程经验不足。

面试官真正想确认的是：

- 你是否知道 Agent 在生产环境会怎么失败。
- 你是否能解释架构取舍。
- 你是否能定位问题来源。
- 你是否能把 Demo 升级成系统。
- 你是否有安全、成本、评测和可观测意识。

这篇文章整理一组高频追问和回答方向，适合配合项目 A、项目 B 和个人博客作品集复习。

## 追问一：你的 Agent 和普通 ChatBot 有什么区别？

普通 ChatBot 通常是“用户输入 -> 模型输出”。Agent 更强调任务执行：

- 有明确目标。
- 能调用工具。
- 能维护状态。
- 能根据中间结果继续决策。
- 有执行 Trace。
- 有失败恢复和人工审批。

加分表达：

> 我不会把 Agent 简单理解成更长 Prompt 的 ChatBot。我的设计里 Agent 至少包含 Runtime、State、Tool、Memory/RAG、Trace 和 Evaluation。模型负责推理和生成，但系统要负责状态推进、工具权限、错误处理和效果评估。

## 追问二：什么时候不应该用 Agent？

以下场景不适合直接上 Agent：

- 规则稳定、流程固定，用普通工作流即可。
- 输出必须强确定性，模型不适合作主决策。
- 风险高但没有人工审批。
- 任务只需要一次模型调用。
- 没有评测数据，无法判断效果。

加分表达：

> 我会优先判断任务是否真的需要模型自主决策。如果流程固定，我会用 workflow；如果只是单次生成，我会用普通 LLM 调用；只有当任务需要根据中间结果动态选择工具、分解步骤或恢复状态时，才考虑 Agent。

## 追问三：Agent 出错怎么排查？

按执行链路定位：

1. 用户输入是否清楚。
2. Context 是否污染或缺失。
3. RAG 召回是否正确。
4. Prompt / schema 是否约束不足。
5. 模型输出是否不符合结构。
6. 工具参数是否错误。
7. 工具执行是否失败。
8. State 是否推进错误。
9. 权限或审批是否阻断。

加分表达：

> 我会通过 run_id 查完整 Trace，看每个 step 的输入、输出、工具调用、RAG 证据、错误类型和耗时。然后判断失败来自检索、上下文、模型、工具、权限还是业务规则，而不是只看最终回答。

## 追问四：如何评估一个 Agent？

按任务分指标：

- 任务完成率。
- 工具调用正确率。
- 参数正确率。
- 引用准确率。
- 幻觉率。
- 人工修改率。
- 失败恢复率。
- 平均成本和延迟。

加分表达：

> 我会把 Agent 评测拆成离线测试集、线上日志抽样和失败样本库。每次 Prompt、模型、检索策略或工具 schema 变更后，都用固定样本做版本对比。评测不是只看最终答案，还要看中间工具调用和证据链是否正确。

## 追问五：多 Agent 为什么不一定更好？

多 Agent 会带来：

- 协作成本。
- 状态同步问题。
- 重复调用。
- 结果冲突。
- Trace 更复杂。
- 成本和延迟增加。

加分表达：

> 我会先用单 Agent 做稳定闭环，只有当任务确实需要不同专业角色、不同工具权限或并行处理时才拆多 Agent。多 Agent 的关键不是角色名，而是职责边界、handoff contract、共享状态和结果聚合机制。

## 追问六：Tool Calling 怎么保证安全？

工具安全要做分层：

- 工具白名单。
- 参数 schema。
- 权限 scope。
- 高风险动作审批。
- 幂等键。
- 审计日志。
- 超时和重试限制。
- 输出脱敏。

加分表达：

> 我不会让模型直接执行任意工具。模型只能表达调用意图，真正执行前由系统做参数校验、权限检查和风险分级。写操作需要幂等键，高风险操作需要人工审批，所有 tool_call 都要进入 Trace。

## 追问七：MCP 和 Function Calling 有什么区别？

- Function Calling 是模型表达工具调用意图的能力。
- MCP 是工具和上下文接入的协议标准。
- Function Calling 更偏模型接口。
- MCP 更偏工具生态和服务接入。

加分表达：

> Function Calling 解决“模型如何表示我要调用哪个函数”，MCP 解决“外部工具、资源和 Prompt 如何被标准化发现和调用”。简单工具可以直接 Function Calling；工具数量多、跨系统复用、需要标准化接入时，MCP 更合适。

## 追问八：Context Engineering 和 Prompt Engineering 有什么区别？

- Prompt Engineering 写指令。
- Context Engineering 设计模型每一步可见的信息。
- Context 包含系统规则、任务状态、RAG 证据、工具结果、Memory、Trace 摘要。

加分表达：

> Context Engineering 不是塞更多内容，而是控制上下文质量。我会把系统规则、任务 State、RAG 证据、工具结果和长期 Memory 分层管理；工具结果只保留结构化摘要；多 Agent handoff 传递事实和决策，不传完整聊天记录。

## 追问九：Agent 怎么控制成本？

成本来自：

- 输入 token。
- 输出 token。
- 工具调用。
- 检索和 rerank。
- 重试。
- 多 Agent 并行。

控制手段：

- LLM Gateway。
- 小模型预处理。
- Prompt 缓存。
- 上下文压缩。
- 限制重试。
- 任务路由。
- 评测抽样。
- 工具结果摘要。

加分表达：

> 我会通过 LLM Gateway 记录 task_type、model、token、latency 和费用。简单分类用小模型，高风险最终回答用强模型。长上下文任务先压缩再生成，重复系统 Prompt 尽量利用缓存，失败重试要限制次数。

## 追问十：Agent 如何支持长任务恢复？

需要：

- 结构化 State。
- 持久化 checkpoint。
- 幂等工具调用。
- Trace。
- 可恢复任务队列。
- 人工审批状态。

加分表达：

> 我不会把长任务只放在内存里。每个 run 都要保存 state、step、tool_call 和 checkpoint。服务重启后可以根据 task_id 恢复到待执行步骤，已经成功的幂等工具调用不重复执行，人工审批状态也要持久化。

## 追问十一：RAG 答错了怎么定位？

分层排查：

1. 文档解析是否失败。
2. Chunk 是否切得不合理。
3. Embedding 是否召回不到。
4. Query Rewrite 是否偏题。
5. Rerank 是否把正确证据排掉。
6. Context Pack 是否丢证据。
7. 模型是否忽略证据。
8. 引用是否错配。

加分表达：

> 我会保留 query、rewrite query、召回列表、rerank 分数、最终进入上下文的 evidence ids 和答案引用。这样可以判断是召回问题、排序问题、上下文组装问题还是生成问题。

## 追问十二：如果上线后模型变差怎么办？

需要版本化和回滚：

- Prompt 版本。
- 模型版本。
- RAG 参数版本。
- 工具 schema 版本。
- 评测基线。
- 灰度发布。
- 回滚策略。

加分表达：

> 我会把 Prompt、模型、检索参数和工具 schema 都记录到每次 run 的元数据里。上线前跑固定评测集，线上灰度后观察失败样本和人工修改率。如果效果下降，可以定位是哪一层变更导致，并回滚到上一个版本。

## 高频追问速记表

| 追问 | 关键词 |
|---|---|
| Agent vs ChatBot | Runtime、Tool、State、Trace、Eval |
| 什么时候不用 Agent | 固定流程、单次调用、高风险无审批 |
| 怎么排查失败 | run_id、step、RAG、tool_call、error_type |
| 怎么评估 | 测试集、指标、失败样本、版本对比 |
| 多 Agent 价值 | 职责边界、handoff、共享状态 |
| 工具安全 | schema、scope、审批、幂等、审计 |
| MCP vs Function Calling | 模型意图 vs 工具协议 |
| Context Engineering | 信息选择、压缩、分层、恢复 |
| 成本控制 | Gateway、路由、缓存、压缩、小模型 |
| 长任务恢复 | checkpoint、state、queue、幂等 |

## 背诵版总结

> 我做 Agent 项目时，会先判断任务是否真的需要 Agent，而不是一上来套框架。Agent 和普通 ChatBot 的区别在于它有 Runtime、State、Tool、Trace 和 Evaluation，可以根据中间结果推进任务。工程上我会用结构化 State 保存执行进度，用 Tool schema 和权限控制外部动作，用 Trace 记录每一步，用 Evaluation 判断效果，用 LLM Gateway 控制模型调用和成本。多 Agent 只有在职责确实需要拆分时才引入，并通过 handoff contract 和共享状态避免失控。

## 相关链接

- [Agent 面试题](/note/AI-Interview/agent-interview)
- [RAG 面试题](/note/AI-Interview/rag-interview)
- [LLM 工具调用面试题](/note/AI-Interview/llm-tools-interview)
- [Context Engineering](/note/AI-Agent/context-engineering)
- [Agent 开发 Playbook](/topics/agent-development-playbook)
- [LLM Gateway](/note/Engineering/llm-gateway)

