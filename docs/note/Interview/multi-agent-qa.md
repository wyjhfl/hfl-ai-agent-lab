# Multi-Agent 设计问答

## Q：为什么用多 Agent 而不是单 Agent？

单 Agent 在复杂场景下会遇到上下文过长、职责不清、难以调试的问题。多 Agent 通过职责分离，让每个 Agent 专注于自己的任务，提高可维护性和可扩展性。

## Q：如何设计 Agent 间的通信？

在项目 B 中，Agent 通过 LangGraph 的状态传递进行通信。每个 Agent 读取全局状态，完成任务后将结果写回状态。

## Q：如何处理 Agent 失败？

通过 Evaluator 检查执行结果，识别失败原因，并决定是重试、跳过还是终止流程。

## Q：多 Agent 的调度策略是什么？

采用 Supervisor 模式，由 Supervisor Agent 根据任务类型和当前状态决定调用哪个 Agent。

待继续补充。
