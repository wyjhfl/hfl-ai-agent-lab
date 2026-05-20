# 大模型工程面试题

## 高频问题地图

- Transformer 的基本结构是什么？
- Attention 机制解决什么问题？
- KV Cache 是什么？
- LoRA 微调的原理是什么？
- 模型推理为什么慢？
- 如何做推理加速？
- 如何降低大模型调用成本？
- 模型部署需要考虑哪些指标？
- Prompt 在工程中如何管理？
- 如何做模型服务的监控和评估？

## 核心概念速记

**Transformer**：基于 Self-Attention 的序列到序列架构。核心组件包括 Multi-Head Attention、Feed-Forward Network、Layer Normalization、Positional Encoding。Encoder-Decoder 结构，Decoder-only 是当前 LLM 主流。

**Attention 机制**：让模型在处理每个 token 时能"关注"到输入序列中所有相关位置。Q（Query）、K（Key）、V（Value）三个矩阵，通过 QK^T 计算注意力权重，加权 V 得到输出。

**KV Cache**：推理加速的关键技术。在自回归生成中，已生成 token 的 Key 和 Value 不需要重复计算，缓存起来复用。空间复杂度 O(n * d * L)，n 是序列长度，d 是维度，L 是层数。

**LoRA（Low-Rank Adaptation）**：参数高效微调方法。冻结原始模型权重，在旁路添加低秩矩阵 A 和 B，只训练 A 和 B。参数量大幅减少，训练成本降低。

**推理加速**：技术包括 KV Cache、Flash Attention、量化（INT8/INT4）、推测解码（Speculative Decoding）、连续批处理（Continuous Batching）、PagedAttention。

**成本优化**：包括 Prompt 缓存、模型路由（简单任务用小模型）、批量处理、Token 预算控制、上下文压缩。

## 标准回答模板

后续补充正式回答模板。

## 面试官追问

后续补充追问。

## 工程化理解

大模型工程面试题要能讲清楚工程化细节：

- 模型部署：GPU 选型、显存管理、吞吐量 vs 延迟的权衡
- 推理服务：vLLM、TGI、TensorRT-LLM 等推理框架的选型
- Prompt 管理：版本控制、A/B 测试、模板化、缓存策略
- 监控评估：Token 使用量、延迟 P50/P95/P99、准确率、幻觉率

## 常见误区

- 只知道 Attention 的概念，讲不清 QKV 的计算过程
- 不理解 KV Cache 的空间换时间原理
- 认为 LoRA 和全量微调效果一样：LoRA 在某些任务上可能不如全量微调
- 不关注推理成本：大模型调用成本是工程化的核心约束

## 背诵版总结

后续补充。

## 后续补充

- 标准回答模板
- 面试官追问及应对
- 背诵版总结
- Transformer 架构图解
- KV Cache 内存计算
- LoRA 超参数选择
