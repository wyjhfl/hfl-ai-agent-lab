# Agent Run Replay：Agent 执行过程怎么回放

## 这篇文章解决什么问题

Agent 线上失败后，最怕只能看到一句“模型回答错了”。真实系统要能回放一次 run：当时的输入是什么、Prompt 版本是什么、检索到了哪些证据、工具参数是什么、审批状态是什么、模型输出是什么、哪一步失败、失败后如何重试或降级。

Agent Run Replay 的目标是把一次长任务从黑盒变成可复现、可调试、可评测的工程资产。

## Run Replay 和 Tool Replay 的区别

| 类型 | 粒度 | 用途 |
|---|---|---|
| Tool Call Replay | 单次工具调用 | 排查参数、权限、schema、外部服务失败 |
| Agent Run Replay | 整个任务 run | 复盘任务状态、上下文、模型、检索、工具、审批和输出 |
| Conversation Replay | 多轮对话 | 验证多轮上下文、记忆和用户体验回归 |
| Eval Replay | 固定评测样本 | 比较版本效果和防止历史问题复发 |

Run Replay 通常会调用 Tool Replay，但它的范围更大，包含状态机和上下文构建。

## 需要记录的快照

| 快照 | 内容 |
|---|---|
| input snapshot | 用户输入、文件、会话、tenant、role |
| config snapshot | model、prompt_version、route_policy、tool_policy、budget |
| context snapshot | system rules、RAG context、memory、history、tool results |
| retrieval snapshot | query rewrite、filters、top-k、rerank、citations |
| state snapshot | task state、step state、transition、retry_count |
| tool snapshot | tool_id、schema_version、args_hash、approval_id、result_hash |
| model snapshot | request metadata、temperature、tokens、response hash |
| output snapshot | final answer、structured output、citations、safety result |

注意：snapshot 不等于保存所有明文。敏感信息要脱敏，密钥只保存 hash 和 scope。

## Replay 模式

| 模式 | 说明 | 适用场景 |
|---|---|---|
| dry replay | 不调用模型和真实工具，只按快照重放状态 | 复盘和展示 |
| mock replay | 使用 mock 模型/工具结果 | CI 回归、前端验收 |
| deterministic replay | 固定模型响应或缓存响应 | Prompt 回归和失败复现 |
| live replay | 重新调用模型和工具 | 验证修复是否真的生效 |
| partial replay | 从某个 step 继续 | 长任务断点恢复和排障 |

## 回放流程

1. 选择 run_id；
2. 加载 config snapshot 和 state snapshot；
3. 校验当前 schema 是否兼容；
4. 根据模式决定使用 mock、deterministic 还是 live；
5. 从指定 step 开始执行；
6. 比较原始输出和回放输出；
7. 记录 diff：状态、工具、引用、成本、延迟、安全；
8. 将复现样本转入 eval case lifecycle。

## 安全边界

Replay 特别容易引发副作用，因此必须限制：

- 默认禁止 replay 高风险写工具；
- live replay 必须重新审批；
- secret 不从历史快照恢复；
- 外部消息、删除、转账、命令执行默认 mock；
- replay 结果必须带 replay_run_id，不覆盖原始 run；
- replay 需要审计 actor、reason 和 mode。

## 面试表达模板

> 我会为每个 Agent run 保存输入、配置、上下文、检索、状态、工具、模型和输出快照。线上失败后可以 dry replay 复盘状态，也可以 mock replay 做 CI 回归，必要时从失败 step 做 live replay。高风险工具在回放时默认 mock 或重新审批，避免排障过程产生真实副作用。

## 常见误区

### 误区一：只保存最终答案

最终答案无法解释为什么错，也无法复现检索、工具、审批和状态转移问题。

### 误区二：回放时直接重跑所有工具

真实工具可能发邮件、改配置、删数据。回放必须默认无副作用。

### 误区三：Replay 不进入评测闭环

能复现的问题应该转成 regression case，否则下次仍可能复发。

## 相关链接

- [Tool Call 回放调试](/note/Engineering/tool-call-replay-debugging)
- [Agent Trace 执行轨迹](/note/Engineering/agent-trace)
- [Agent Workflow 状态机设计](/note/Engineering/agent-workflow-state-machine)
- [Eval Case Lifecycle](/note/Engineering/eval-case-lifecycle)
- [Prompt Regression Testing](/note/Engineering/prompt-regression-testing)
