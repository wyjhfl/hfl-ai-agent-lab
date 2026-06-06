# RAG vs Fine-tuning：什么时候检索，什么时候微调

## 这篇文章解决什么问题

很多大模型项目遇到回答不准时，会立刻问：“要不要微调？”但大多数企业知识问答问题，第一反应应该是 RAG，而不是 Fine-tuning。

RAG 和 Fine-tuning 解决的问题不同：

- RAG 解决“模型不知道最新/私有知识”的问题。
- Fine-tuning 更适合解决“模型应该怎么表现、怎么输出、怎么遵循任务模式”的问题。

如果把两者混淆，项目会走偏：该检索的去微调，导致知识更新困难；该训练格式和行为的只做 RAG，导致输出不稳定。

## 核心区别

| 维度 | RAG | Fine-tuning |
|---|---|---|
| 解决问题 | 外部知识、私有知识、最新知识 | 行为模式、输出风格、任务格式 |
| 知识更新 | 更新文档和索引即可 | 需要重新训练或继续训练 |
| 可解释性 | 可以引用来源 | 通常不能直接说明训练来源 |
| 成本 | 推理时多检索成本 | 训练成本 + 推理成本 |
| 适合场景 | 企业知识库、客服、售后、文档问答 | 结构化输出、领域风格、分类/抽取模式 |
| 风险 | 检索失败、引用错误 | 训练数据质量差、遗忘、过拟合 |

## 什么时候优先用 RAG

优先用 RAG 的场景：

- 知识经常更新。
- 需要引用来源。
- 数据是私有文档。
- 问题答案依赖具体资料。
- 希望能解释答案来自哪里。
- 不希望把所有知识写进模型参数。

例如：

- 设备手册问答。
- 公司制度问答。
- 售后故障诊断。
- 法规/政策检索。
- 项目文档助手。

## 什么时候考虑 Fine-tuning

Fine-tuning 更适合：

- 固定输出格式。
- 固定语气和风格。
- 领域分类。
- 信息抽取。
- 模型经常不遵循特定任务规范。
- 大量高质量示例能代表目标行为。

例如：

- 把客服对话分类成固定标签。
- 把非结构化文本抽取成固定 JSON。
- 让模型学会某种报告风格。
- 让小模型在特定任务上接近大模型表现。

Fine-tuning 不适合用来硬塞大量动态知识。

## 常见决策树

```text
问题是模型不知道事实吗？
  是 -> 优先 RAG
  否 -> 看下一步

问题是输出格式/风格不稳定吗？
  是 -> 先 Prompt + schema；仍不稳定再考虑 fine-tuning
  否 -> 看下一步

问题是工具选择或流程决策不稳定吗？
  是 -> 优先改 Agent Runtime、State、Tool schema、Eval
  否 -> 看下一步

问题是成本太高吗？
  是 -> 先做路由、缓存、上下文压缩；再考虑小模型微调
```

## RAG + Fine-tuning 可以组合

两者不是互斥的。

典型组合：

- RAG 提供最新知识和引用。
- Fine-tuning 让模型稳定输出企业格式。
- Tool schema 控制工具调用。
- Eval Dataset 检查效果。

例如售后诊断系统：

```text
RAG：检索设备手册和历史工单
Fine-tuning：学习诊断报告格式和工单字段抽取
Tool Calling：创建工单草稿
Eval：检查引用、字段完整性和建议可执行性
```

## 不要把这些问题甩给 Fine-tuning

### 检索质量差

如果 gold document 都没召回，微调不能解决知识缺失。先优化 chunk、embedding、query rewrite、rerank。

### 上下文太乱

如果 Context Engineering 做得差，微调也会被噪声干扰。

### 工具 schema 不清楚

工具调用失败通常要先改 schema、参数校验、错误返回，而不是微调。

### 评测集没有

没有 eval dataset 时，微调后也不知道是否变好。

## 面试表达

可以这样回答 RAG vs Fine-tuning：

> 我会先判断问题类型。如果模型缺少外部知识、需要引用来源、知识经常更新，我优先用 RAG；如果模型知道信息但输出格式、风格、分类或抽取模式不稳定，才考虑 Fine-tuning。RAG 让知识留在外部可更新系统里，Fine-tuning 更适合把高质量示例固化成行为模式。实际项目中两者可以组合：RAG 提供证据，Fine-tuning 稳定输出格式，Tool Calling 执行业务动作，Evaluation 负责验证效果。

## 相关链接

- [RAG 基础](/note/AI-Agent/rag)
- [RAG 工程化](/note/Engineering/rag-engineering)
- [Eval Dataset 设计](/note/Engineering/eval-dataset-design)
- [LLM Gateway](/note/Engineering/llm-gateway)
- [大模型工程面试题](/note/AI-Interview/llm-engineering-interview)

## 参考资料

- [OpenAI Fine-tuning guide](https://platform.openai.com/docs/guides/fine-tuning)
- [OpenAI Retrieval guide](https://platform.openai.com/docs/guides/retrieval)

