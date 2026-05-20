# Harness Engineering 源码拆解

## 1. 项目定位

Harness Engineering 的核心是把大模型从"回答问题的模型"工程化为"可执行、可约束、可观察、可验证、可协作的业务 Agent Runtime"。

一句话定义：

> Harness 是包在 LLM 外面的 Agent Runtime。模型负责思考和决策，Harness 负责上下文、工具、权限、记忆、验证、多 Agent 调度和外部系统接入。

Harness 不是某一个 prompt，也不是单纯 function calling，而是：

```
Agent = LLM + Harness

Harness =
  Runtime
+ Context Assembly
+ Agent Loop
+ Tool Registry
+ Permission Checker
+ Skills
+ Hooks / Plugins / MCP
+ Memory / Compaction
+ Multi-Agent Coordinator
+ Verification Feedback Loop
```

OpenAI 的 Harness Engineering 文章强调：团队的工作不再只是手写代码，而是设计环境、指定意图、构建反馈循环，让 Codex agents 能可靠完成工作。

## 2. 整体架构

Harness Engineering 的架构可以拆成九层：

### M1：Runtime Bootstrap 启动层

负责加载配置、选择模型 Provider、初始化工具注册表、加载插件和 Skills、初始化权限系统、创建 Agent Executor / QueryEngine。它根据用户、租户、业务场景和执行模式构建一次 Agent 会话所需的完整运行环境。

### M2：Context Assembly 上下文层

负责组装 system prompt、注入项目规则、注入当前任务上下文、注入相关 memory、暴露 available skills、控制模型每轮能看到什么。不把所有规则、记忆、技能、文档都塞进 system prompt，而是分层组装：

- Base System Prompt
- Environment Info
- Project Rules
- Available Skills Index
- Relevant Memories
- Current Task Context
- Tool Results
- Compaction Summary

### M3：Agent Loop 执行循环层

采用 Think-Act-Observe 的循环结构。模型负责提出工具调用意图，Harness 负责执行工具并将结果回灌给模型，使 Agent 能够基于外部观察不断修正推理和行动。

### M4：Tool Gateway 工具网关层

统一封装业务工具、定义输入 schema、注册工具、校验参数、返回标准 ToolResult。所有工具通过 schema 暴露给模型，并在执行前进行参数校验和权限检查。

### M5：Permission & Governance 权限治理层

区分只读工具和变更工具、检查用户权限、检查租户权限、检查敏感动作、决定自动执行/人工确认或拒绝、记录审计日志。根据工具类型、用户角色、业务风险等级和操作对象，决定该工具调用的执行策略。

### M6：Skills Workflow 技能流程层

沉淀可复用任务流程、按需加载任务说明、指导 Agent 标准化执行。把复杂工作流从 prompt 中抽离出来，变成可版本化、可复用、按需加载的任务手册。

### M7：Hooks / Plugins / MCP 扩展层

工具调用前拦截、工具调用后审计、插件化扩展能力、接入外部系统。通过 Hooks 在生命周期节点插入风控、审计、记忆更新和自动化逻辑；通过 Plugins 打包复用 Skills、Hooks、Tools 和 Agents；通过 MCP 或适配器机制接入外部业务系统。

### M8：Memory & Compaction 记忆压缩层

区分长期记忆和短期任务状态。长期记忆保存稳定偏好、项目事实和可复用经验；上下文压缩则在长任务中保留目标、关键证据、已完成步骤和下一步计划，防止上下文溢出导致任务中断。

### M9：Multi-Agent Coordinator 多 Agent 编排层

负责复杂任务的拆解和调度。Coordinator Agent 根据任务目标分派专职 Agent 执行子任务，并统一收集、审查和汇总结果。

## 3. 核心执行链路

### 完整架构流程

```
用户 / API / 前端
        ↓
M1 Runtime Bootstrap
        ↓
M2 Context Assembly
        ↓
M3 Agent Loop
        ↓
M4 Tool Gateway
        ↓
M5 Permission & Governance
        ↓
M6 Skills Workflow
        ↓
M7 Hooks / Plugins / MCP
        ↓
M8 Memory & Compaction
        ↓
M9 Multi-Agent Coordinator
        ↓
业务系统 / 数据库 / 知识库 / 审批系统
```

### 多 Agent 核心流程

1. 理解目标
2. 拆解任务
3. 分派 Worker
4. 收集结果
5. 独立验证
6. 汇总输出

完整链路：

```
用户目标
  ↓
Coordinator 分析任务
  ↓
拆成多个子任务
  ↓
派发 Worker Agent
  ↓
Worker 使用自己的工具执行
  ↓
Coordinator 读取 Worker 输出
  ↓
必要时派 Reviewer 复查
  ↓
Coordinator 汇总最终答案
```

核心原则：Coordinator 负责"管理认知流程"，Worker 负责"执行局部任务"。

## 4. 关键模块拆解

### Runtime Bootstrap（M1）

**职责：** 构建一次 Agent 会话所需的完整运行环境。

**输入：** 用户、租户、业务场景、执行模式配置。

**输出：** 初始化好的 Agent Runtime 实例。

**关键设计：** 把模型客户端、工具注册表、权限检查器、上下文构造器、记忆模块和多 Agent 调度器统一初始化，让后续模块不需要关心基础设施细节。

**可迁移点：** 项目启动时统一初始化所有 Agent 基础设施，而不是在运行时懒加载。

### Context Assembly（M2）

**职责：** 动态组装模型上下文，避免将所有知识一次性塞入 prompt。

**输入：** 基础行为规则、当前任务信息、业务约束、相关记忆、可用技能和工具说明。

**输出：** 组装好的 system prompt 和 API messages。

**关键设计：** 分层组装，减少上下文浪费、降低规则冲突、让不同来源的信息可治理、可替换、可压缩。

**可迁移点：** 稳定层（role prompt、tool guidance、business rules）和临时层（本轮查询结果、RAG 片段）必须分开管理。

### Agent Loop（M3）

**职责：** Think-Act-Observe 循环，驱动 Agent 持续执行直到任务完成。

**输入：** 用户任务、组装好的上下文。

**输出：** 任务执行结果。

**关键设计：** 模型负责提出工具调用意图，Harness 负责执行工具并将结果回灌给模型。循环条件由 iteration budget 硬控。

**可迁移点：** Agent 循环必须有硬限制（max iterations、budget），不能只靠提示词防止无限循环。

### Tool Gateway（M4）

**职责：** 统一封装外部能力为结构化工具。

**输入：** 工具注册声明（name、schema、handler）。

**输出：** 标准化的 ToolResult。

**关键设计：** 所有工具通过 schema 暴露给模型，执行前进行参数校验和权限检查。工具结果标准化，包含成功/失败标记、结果数据、错误信息。

**可迁移点：** Agent 不直接调用外部系统，而是通过 Tool Gateway 统一封装，方便权限控制和审计。

### Permission & Governance（M5）

**职责：** 工具执行前的风险控制。

**输入：** 工具调用请求、用户角色、操作对象。

**输出：** 执行决策（自动允许、人工确认、进入审批、拒绝）。

**关键设计：**

- 查询类动作：自动允许
- 变更类动作：需要确认
- 高风险动作：强制审批
- 敏感动作：直接禁止

**可迁移点：** 权限系统让 Agent 从"能做事"变成"能安全做事"。不要指望模型自己克制，应该从配置上让它没有危险能力，或者危险能力必须审批。

### Skills Workflow（M6）

**职责：** 把可复用流程沉淀成"任务说明书"。

**输入：** 任务类型匹配。

**输出：** 加载的 Skill 流程说明。

**关键设计：** Tool 是动作，Skill 是方法。Skill 把复杂工作流从 prompt 中抽离出来，变成可版本化、可复用、按需加载的任务手册。模型在系统提示中只看到技能目录，当任务匹配某个 Skill 时，再按需加载完整流程说明。

**可迁移点：** 运营日报生成 Skill、用户分群分析 Skill、活动复盘 Skill、异常指标诊断 Skill 等，每个 Skill 包含任务边界、分析步骤、需要调用哪些工具、输出格式、质量检查清单。

### Multi-Agent Coordinator（M9）

**职责：** 复杂任务的拆解和调度。

**输入：** 复杂任务目标。

**输出：** 汇总后的最终结果。

**关键设计：**

多 Agent 的基本角色：

- Coordinator Agent：总控，负责理解目标、拆任务、派发 Worker、汇总结果
- Worker Agent：执行具体子任务
- Reviewer Agent：独立审查结果，检查错误、遗漏、风险
- Specialist Agent：专门处理某个领域

任务类型分类：

- Research Task（研究型）：只读、适合并行、冲突风险低
- Execution Task（执行型）：会改变状态、需要权限控制、最好串行或明确边界
- Review Task（审查型）：应该独立于执行者、最好只读

核心原则：Research 可以并行，Execution 要控边界，Review 要独立。

**可迁移点：** 多 Agent 不是绕过权限，每个 Agent 都应该有自己的最小权限集。

## 5. 工程化亮点

### 工程师角色变化

传统开发是"人写代码 → 人测试 → 人修 bug"。Harness Engineering 是"人定义目标、环境、规则、反馈闭环 → Agent 读上下文、调工具、写代码、跑测试、修复问题 → 人审查关键决策和高风险动作"。

人不再把时间主要花在"执行代码细节"，而是花在"让 Agent 能可靠执行"的系统设计上。

### 从 Prompt Engineering 升级为 Runtime Engineering

Prompt Engineering 解决"怎么问模型"。Harness Engineering 解决"模型在哪个环境里工作？能看到哪些上下文？能调用哪些工具？哪些动作需要权限？工具结果如何回灌？上下文满了怎么办？多个 Agent 怎么协作？结果怎么验证？"

核心创新是把 Agent 执行过程工程化、运行时化、可控化。

### 模型决策权和执行权分离

模型可以提出 tool_use，但真正执行工具的是 Harness。Harness 决定：工具是否存在？参数是否合法？是否只读？是否命中敏感路径？当前用户是否有权限？是否需要人工确认？是否要拒绝执行？

这是 Agent 能落地到真实业务系统的基础。

### Trace 与 Evaluation 闭环

Agent 项目如果没有执行记录和质量评估，就很难从 Demo 走向可维护系统。Agent 不仅要能完成任务，还要能记录它怎么完成、哪里失败、后续如何改进。

Trace 记录每次执行的完整轨迹（关键决策摘要、工具调用记录、状态变化记录、执行轨迹），Evaluator 量化结果质量，失败样本沉淀为优化依据——这三者构成了 Agent 工程化的闭环。

### 执行结果和评估结果分离

执行结果是 Agent 的输出，评估结果是对输出质量的判断，两者应该分开存储。这样做的好处是：同一个执行结果可以被多次评估（比如用不同的评估标准），评估标准可以随时间变化而不需要重新执行任务。

### 失败样本沉淀为评测集

每次失败都应该被记录、归类、分析，沉淀为评测样本。用失败样本做回归测试，用失败样本衡量改进效果，用失败样本发现系统弱点。

## 6. 可迁移到个人项目的设计

- **为每次执行生成 run id**：唯一标识一次执行，方便关联 Trace、日志和评测结果
- **记录完整的执行轨迹**：记录输入、输出、工具调用记录、状态变化记录和关键决策摘要
- **执行结果和评估结果分离**：执行结果和评估结果分开存储，各自独立演进
- **失败样本沉淀为优化依据**：每次失败都应该被记录、归类、分析，转化为具体的优化行动
- **评测集防止回退**：用评测集持续监控质量，每次修改后用回归测试确保没有引入新问题
- **Skills 沉淀可复用流程**：把复杂业务流程抽象为可版本化、可复用的 Skill
- **权限分级控制**：查询类自动允许、变更类需要确认、高风险强制审批、敏感动作直接禁止
- **Coordinator 编排多 Agent**：任务拆解、Worker 分派、Reviewer 审查、最终汇总

## 7. 面试表达

### 表达一：Harness 的核心

> 我对 Agent 的理解不是单纯调大模型，而是要构建一套 Harness Runtime。模型本身只负责推理和决策，真正让它能够在业务系统中可靠工作的，是外层 Harness。我把 Harness 拆成九层：Runtime Bootstrap 负责初始化运行环境，Context Assembly 负责动态组装上下文，Agent Loop 负责 Think-Act-Observe 循环，Tool Gateway 负责封装外部能力，Permission Checker 负责风险控制，Skills 把可复用流程沉淀成任务说明书，Hooks/Plugins/MCP 负责生命周期治理和外部扩展，Memory/Compaction 负责长期经验复用和上下文压缩，Multi-Agent Coordinator 负责任务拆解和调度。

### 表达二：工程化创新

> Harness Engineering 最核心的创新是把大模型从"回答问题的模型"工程化为"可执行、可约束、可观察、可验证、可协作的业务 Agent Runtime"。具体来说有三个关键设计：第一，模型决策权和执行权分离——模型可以提出 tool_use，但 Harness 负责校验、限流、权限检查和执行；第二，执行结果和评估结果分离——同一个执行结果可以被多次评估，评估标准可以独立演进；第三，失败样本沉淀为评测集——每次失败都被记录、归类、分析，转化为回归测试用例，防止同样的问题再次出现。

## 8. 后续 TODO

- 待补充 OpenHarness 的真实源码文件路径和关键函数
- 待补充 Runtime Bootstrap 的初始化流程细节
- 待补充 Tool Gateway 的 schema 校验和权限检查实现
- 待补充 Evaluator 的具体评分机制
- 待补充 Multi-Agent Coordinator 的调度实现
- 待补充 Compaction 的具体压缩策略

## 安全表述说明

不要记录或暴露模型不可见的完整中间分析过程。统一使用以下工程化表述：关键决策摘要、模型输出摘要、工具调用记录、状态变化记录、执行轨迹。
