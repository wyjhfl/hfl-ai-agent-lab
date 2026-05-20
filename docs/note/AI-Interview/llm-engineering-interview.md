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

---

## Q1：Transformer 的基本结构是什么？

### 标准回答

Transformer 是一种基于 Self-Attention 机制的序列处理架构，由 Google 在 2017 年论文"Attention Is All You Need"中提出。原始 Transformer 是 Encoder-Decoder 结构，Encoder 负责理解输入序列，Decoder 负责生成输出序列。

Encoder 由多层相同的模块堆叠而成，每层包含两个子模块：Multi-Head Self-Attention 和前馈神经网络（Feed-Forward Network）。每个子模块都有残差连接（Residual Connection）和层归一化（Layer Normalization）。Self-Attention 让每个 token 都能关注到输入序列中的所有其他 token，捕获全局依赖关系。

Decoder 的结构类似，但多了一个 Cross-Attention 层，让 Decoder 在生成每个 token 时能关注到 Encoder 的输出。Decoder 的 Self-Attention 使用了掩码（Mask），确保生成第 N 个 token 时只能看到前 N-1 个 token，防止信息泄露。

当前大语言模型的主流架构是 Decoder-only，去掉了 Encoder 和 Cross-Attention，只保留 Decoder 部分。这是因为 Decoder-only 架构在大规模预训练中表现出更好的扩展性和性能。

### 面试官追问

1. 为什么 Decoder-only 架构成为主流？Encoder-Decoder 有什么劣势？
2. Positional Encoding 的作用是什么？没有它会怎样？
3. Multi-Head Attention 中"多头"的作用是什么？

### 工程化理解

从工程角度看，Transformer 的计算瓶颈在 Self-Attention 层。Self-Attention 的计算复杂度是 O(n²)，n 是序列长度，这意味着序列越长，计算量呈平方增长。这也是长上下文模型推理成本高的根本原因。前馈网络的参数量占模型总参数量的大部分（约 2/3），是量化和剪枝的主要目标。残差连接和层归一化保证了深层网络的训练稳定性，没有这两个技术，几十层甚至上百层的 Transformer 很难训练收敛。

### 常见误区

1. 只知道 Transformer 的概念，讲不清 Attention 的计算过程：面试时需要能画出 QKV 的计算流程。
2. 认为 Attention 能关注所有位置就是最好的：长序列中 Attention 的 O(n²) 复杂度是主要瓶颈。
3. 不理解残差连接和层归一化的作用：这两个是 Transformer 能堆叠到很深的关键技术。

### 背诵版总结

Transformer 基于 Self-Attention 机制，核心组件是 Multi-Head Attention 和前馈网络，配合残差连接和层归一化。原始结构是 Encoder-Decoder，当前 LLM 主流是 Decoder-only。计算瓶颈在 Self-Attention 的 O(n²) 复杂度。Multi-Head Attention 让模型在不同子空间捕获不同类型的依赖关系。

---

## Q2：Attention 机制解决什么问题？

### 标准回答

Attention 机制解决了长序列中远距离依赖的建模问题。在 Attention 之前，RNN 和 LSTM 通过逐步传递隐状态来处理序列，信息在传递过程中会逐渐衰减，导致模型难以捕获长距离依赖。比如一个 500 词的文档，第 1 个词的信息经过 500 步传递后几乎消失。

Attention 的核心思想是：处理每个 token 时，不是只看前一个隐状态，而是直接关注序列中所有 token，根据相关性加权聚合信息。这样无论两个 token 在序列中相距多远，都能直接建立联系。

技术实现上，Attention 使用三个矩阵：Q（Query）、K（Key）、V（Value）。Q 代表当前 token 的查询向量，K 代表每个 token 的键向量，V 代表每个 token 的值向量。计算过程是：Q 和所有 K 做点积得到注意力分数，经过 Softmax 归一化后作为权重，对 V 做加权求和，得到当前 token 的输出。公式是 Attention(Q,K,V) = softmax(QK^T / √d_k) × V，其中 √d_k 是缩放因子，防止点积值过大导致 Softmax 梯度消失。

Multi-Head Attention 把 QKV 分成多个头，每个头独立计算 Attention，最后拼接。这让模型能在不同的子空间捕获不同类型的依赖关系，比如一个头关注语法结构，另一个头关注语义关系。

### 面试官追问

1. Softmax 之前的缩放因子 √d_k 的作用是什么？不加会怎样？
2. Multi-Head Attention 中头的数量怎么选择？头越多越好吗？
3. Self-Attention 和 Cross-Attention 有什么区别？

### 工程化理解

Attention 的计算量和序列长度的平方成正比，这是长上下文推理的主要瓶颈。Flash Attention 通过优化 GPU 内存访问模式，在不改变计算结果的前提下大幅提升了 Attention 的计算速度。分组查询注意力（GQA）和多查询注意力（MQA）通过减少 KV 头的数量来降低 KV Cache 的内存占用，是当前大模型推理优化的主流方向。

### 常见误区

1. 只能说出"Attention 让模型关注重要信息"但讲不清计算过程：需要能写出 QKV 的计算公式。
2. 认为 Attention 分数就是"重要性"：Attention 分数是模型学到的权重，不完全等同于人类理解的重要性。
3. 不理解缩放因子的作用：不缩放会导致点积值过大，Softmax 输出趋向 one-hot，梯度接近零。

### 背诵版总结

Attention 解决了长序列远距离依赖的建模问题。核心是 QKV 机制：Q 和 K 点积计算注意力分数，Softmax 归一化后加权 V 得到输出。Multi-Head Attention 在不同子空间捕获不同类型的依赖。计算复杂度 O(n²) 是长上下文推理的主要瓶颈，Flash Attention 优化了 GPU 内存访问来加速。

---

## Q3：KV Cache 是什么？为什么能提升推理效率？

### 标准回答

KV Cache 是大模型推理加速的关键技术，核心思想是用空间换时间。

大模型的推理是自回归的：每生成一个新 token，都需要对整个已生成序列做一次前向计算。在 Attention 层中，每个 token 都需要计算自己的 Key 和 Value 向量。如果不做缓存，生成第 N 个 token 时，前 N-1 个 token 的 Key 和 Value 都需要重新计算，这是巨大的浪费，因为这些值在之前的生成步骤中已经计算过了。

KV Cache 的做法是：在生成每个 token 后，把它对应的 Key 和 Value 向量缓存起来。生成下一个 token 时，只需要计算新 token 的 Q、K、V，然后用新 token 的 Q 和缓存中所有 token 的 K 做 Attention 计算，用缓存中所有 token 的 V 做加权求和。这样每个生成步骤只需要计算一个 token 的前向传播，而不是整个序列。

KV Cache 的内存占用是 O(n × d × L)，n 是序列长度，d 是 Key/Value 的维度，L 是 Transformer 的层数。对于一个 70B 参数的模型，128K 上下文的 KV Cache 可能占用几十 GB 显存，这也是为什么长上下文推理对显存要求极高的原因。

### 面试官追问

1. KV Cache 的内存占用怎么计算？和模型参数量有什么关系？
2. 如果显存不够放下完整的 KV Cache，有什么解决方案？
3. GQA（Grouped Query Attention）怎么减少 KV Cache 的内存占用？

### 工程化理解

KV Cache 的管理是推理引擎的核心工程问题。vLLM 的 PagedAttention 技术借鉴了操作系统的虚拟内存机制，把 KV Cache 分成固定大小的页，按需分配和释放，避免了内存碎片和预分配浪费。连续批处理（Continuous Batching）允许多个请求共享 GPU 计算资源，不同请求的 KV Cache 独立管理。量化 KV Cache（如 FP8 KV Cache）可以进一步减少内存占用，但会略微影响精度。

### 常见误区

1. 认为 KV Cache 只缓存一层的 Key 和 Value：实际上每层 Transformer 都有独立的 KV Cache。
2. 不理解 KV Cache 和上下文长度的关系：上下文越长，KV Cache 越大，这是长上下文推理的主要瓶颈。
3. 忽略 KV Cache 的内存管理：不合理的 KV Cache 管理会浪费大量显存，限制并发请求数。

### 背诵版总结

KV Cache 缓存已生成 token 的 Key 和 Value 向量，避免重复计算，是自回归推理的核心加速技术。每个生成步骤只需计算新 token 的前向传播。内存占用 O(n × d × L)，是长上下文推理的主要瓶颈。PagedAttention 通过分页管理解决内存碎片问题。GQA 通过减少 KV 头数降低内存占用。

---

## Q4：LoRA 微调的核心思想是什么？适合什么场景？

### 标准回答

LoRA（Low-Rank Adaptation）的核心思想是：大模型微调时，权重更新矩阵通常是低秩的，可以用两个小矩阵的乘积来近似。基于这个假设，LoRA 冻结原始模型的所有权重，在每个需要微调的权重矩阵旁边添加一个旁路，旁路由两个低秩矩阵 A 和 B 组成。前向传播时，输出 = 原始权重 × 输入 + B × A × 输入。训练时只更新 A 和 B，原始权重不变。

LoRA 的优势是参数效率极高。假设原始权重矩阵是 4096×4096（约 1600 万参数），LoRA 的秩设为 8，那么 A 是 4096×8，B 是 8×4096，总参数约 6.5 万，只有原始参数量的 0.4%。这意味着 LoRA 的训练成本（显存、计算量、存储）远低于全量微调。

LoRA 适合以下场景：领域适配（让模型适应特定领域的术语和表达方式）、任务适配（让模型学会特定的输出格式或行为模式）、资源受限场景（没有足够显存做全量微调）。LoRA 不太适合需要模型"忘记"某些知识的场景，因为原始权重被冻结，模型的原有知识会保留。

### 面试官追问

1. LoRA 的秩怎么选择？秩越大效果越好吗？
2. LoRA 应用在哪些权重矩阵上效果最好？Q、K、V、O 还是 FFN？
3. LoRA 和全量微调的效果差距有多大？什么场景下差距明显？

### 工程化理解

工程中 LoRA 的关键决策包括秩的选择（通常 8-64，越大表达能力越强但参数越多）、应用目标（通常应用在 Attention 的 Q/V 矩阵上效果最好）、学习率（LoRA 的学习率通常比全量微调大，因为参数少、更新幅度需要更大）。LoRA 的推理开销很小：训练完成后，可以把 LoRA 权重合并到原始权重中，推理时没有额外延迟。这也意味着一个基础模型可以搭配多个不同的 LoRA 适配器，按需切换。

### 常见误区

1. 认为 LoRA 和全量微调效果一样：LoA 在某些任务上可能不如全量微调，特别是需要大幅改变模型行为的场景。
2. 秩设得越大越好：过大的秩会增加参数量和过拟合风险，需要在目标数据集上实测最优值。
3. 忽略 LoRA 的应用目标选择：不同层的 LoRA 效果差异很大，需要实验验证。

### 背诵版总结

LoRA 的核心思想是用低秩矩阵近似权重更新，冻结原始权重，只训练旁路的 A 和 B 矩阵。参数量通常只有原始模型的 0.1%-1%，训练成本大幅降低。适合领域适配、任务适配和资源受限场景。推理时可以合并权重，没有额外延迟。秩的选择需要在目标数据集上实测。
