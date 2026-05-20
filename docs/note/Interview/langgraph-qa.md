# LangGraph 设计问答

## Q：为什么选择 LangGraph？

LangGraph 提供了状态机的方式来编排 Agent 流程，支持条件路由、循环、暂停恢复，适合复杂的 Multi-Agent 场景。

## Q：状态机的核心设计是什么？

每个节点是一个 Agent 或处理逻辑，边定义了节点间的流转条件。全局状态在节点间传递，每个节点可以读取和写入状态。

## Q：如何实现 Human-in-the-loop？

LangGraph 支持 interrupt 节点，可以在需要人工确认的地方暂停执行，等待人工输入后恢复。

## Q：如何处理长流程的状态管理？

通过 Checkpointing 机制保存中间状态，支持断点恢复和流程回溯。

待继续补充。
