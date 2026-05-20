# LangChain / LangGraph 面试题

## 高频问题地图

- LangChain 解决什么问题？
- Chain、Agent、Tool 有什么区别？
- 为什么复杂 Agent 更适合用 LangGraph？
- State、Node、Edge、Conditional Edge 分别是什么？
- Checkpoint 有什么价值？
- Human-in-the-loop 如何设计？
- LangGraph 和普通 Agent Loop 有什么区别？
- 什么时候不用框架，选择手搓 Agent？
- 如何做框架选型？

## 核心概念速记

**LangChain**：LLM 应用开发框架，提供 Chain（链式调用）、Agent（自主决策）、Tool（工具封装）、Memory（上下文管理）等抽象，简化 LLM 应用开发。

**Chain**：预定义的执行流程，输入 → 处理 → 输出。适合流程固定、不需要动态决策的场景。

**Agent**：基于 LLM 的自主决策循环，能根据当前状态动态选择下一步行动。适合需要灵活判断的场景。

**Tool**：Agent 可调用的外部能力，定义名称、描述、参数 schema 和执行函数。

**LangGraph**：LangChain 生态的状态图编排框架。把 Agent 执行流程建模为有向图，节点是处理步骤，边是流转规则。

**State**：LangGraph 中贯穿整个图的状态对象，所有节点共享同一个 State，通过读写 State 传递数据。

**Node**：图中的处理节点，接收 State，执行逻辑，返回 State 更新。

**Edge**：节点之间的连接，定义执行顺序。

**Conditional Edge**：条件分支，根据 State 中的值决定下一个节点。

**Checkpoint**：状态快照，支持暂停/恢复、回溯、调试。LangGraph 的核心特性之一。

**Human-in-the-loop**：在 Agent 执行流程中插入人工审核节点，让人类在关键步骤确认或修改。

## 标准回答模板

后续补充正式回答模板。

## 面试官追问

后续补充追问。

## 工程化理解

LangChain / LangGraph 面试题要能讲清楚工程化细节：

- 状态管理：State 如何设计、如何持久化、如何处理并发
- 流程控制：Conditional Edge 的条件表达式、循环终止条件、超时处理
- 人工审核：如何暂停执行等待人工输入、如何恢复执行、如何处理审核拒绝
- 框架选型：什么场景用 LangChain、什么场景用 LangGraph、什么场景手搓

## 常见误区

- 认为 LangChain 适合所有场景：简单场景直接调用 API 可能更高效
- 混淆 Chain 和 Agent：Chain 是固定流程，Agent 是动态决策
- 不理解 State 的共享机制：所有节点读写同一个 State，要注意并发和一致性
- 过度依赖框架：理解底层原理比会用框架更重要

## 背诵版总结

后续补充。

## 后续补充

- 标准回答模板
- 面试官追问及应对
- 背诵版总结
- LangGraph 状态图示例
- 框架选型决策树
- 手搓 Agent vs 框架 Agent 对比
