[ChatGPT](https://chatgpt.com/)





- 
- 
  - 
- 
  - 
- 
- 
  - 
- 



- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 
- 

已思考 5s

好，进入 **M9：多 Agent / Coordinator 重点版**。

这一讲一句话：

> **多 Agent 不是“多开几个模型”，而是用 Coordinator 把复杂任务拆解、分派、并行、回收结果、交叉验证，最后形成一个统一答案。**

OpenHarness README 把 multi-agent coordination 列为核心能力之一：Harness 不只提供工具、知识、记忆、权限，也提供 agent coordination，让模型可以把部分工作委派给子 Agent。

------

# 1. 为什么需要多 Agent？

单 Agent 的问题是：

```
上下文容易混乱
任务太大时难以并行
同一个模型既当执行者又当审查者，容易自证正确
复杂任务里不同子任务需要不同工具和规则
```

多 Agent 的价值是：

```
把大任务拆成小任务
让不同 Agent 专注不同职责
并行处理互不冲突的部分
让 Reviewer 独立检查 Worker 结果
Coordinator 负责统一汇总
```

核心不是“人多力量大”，而是：

```
职责隔离 + 并行执行 + 独立验证
```

------

# 2. 多 Agent 的基本角色

一个成熟多 Agent 系统一般有这些角色：

```
Coordinator Agent：
总控，负责理解目标、拆任务、派发 Worker、汇总结果。

Worker Agent：
执行具体子任务，比如查资料、读代码、写模块、跑测试。

Reviewer Agent：
独立审查结果，检查错误、遗漏、风险。

Specialist Agent：
专门处理某个领域，比如 Data Agent、Risk Agent、Frontend Agent。
```

最重要的是 Coordinator。

Coordinator 不一定亲自做所有事，它主要负责：

```
任务拆解
选择合适 Worker
控制任务边界
避免冲突
读取 Worker 输出
整合结论
决定是否需要复查
```

------

# 3. 多 Agent 的核心流程

你可以把多 Agent 流程记成 6 步：

```
1. 理解目标
2. 拆解任务
3. 分派 Worker
4. 收集结果
5. 独立验证
6. 汇总输出
```

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

一句话：

> **Coordinator 负责“管理认知流程”，Worker 负责“执行局部任务”。**

------

# 4. 什么时候该用多 Agent？

不是所有任务都需要多 Agent。

适合多 Agent 的任务：

```
任务复杂，明显可以拆分
需要并行调研多个方向
需要不同专业角色
需要独立审查
上下文太长，单 Agent 容易混乱
需要读多个模块或多个数据源
```

不适合多 Agent 的任务：

```
简单问答
小范围代码修改
只需要一次工具调用
任务边界不清
多个 Agent 会同时改同一个文件，容易冲突
```

所以使用原则是：

```
能单 Agent 做清楚，就不要强行多 Agent。
任务可拆、可并行、可验证时，再用多 Agent。
```

这点很关键，因为多 Agent 也会带来成本：

```
更多 token
更多延迟
更多状态同步
更多冲突管理
更多结果整合工作
```

------

# 5. Coordinator 最容易犯的错误

## 错误 1：只拆任务，不定义边界

错误示例：

```
Agent A：分析项目
Agent B：也分析项目
Agent C：再分析一下
```

这叫“重复劳动”。

正确做法：

```
Agent A：只分析数据层
Agent B：只分析 API 层
Agent C：只分析权限和风控
Coordinator：整合三者结果
```

------

## 错误 2：多个 Worker 同时写同一块内容

比如：

```
Worker A 修改用户模块
Worker B 也修改用户模块
Worker C 同时重构权限模块
```

容易产生冲突。

正确做法：

```
研究类任务可以并行；
写入型任务要串行，或者明确文件边界。
```

------

## 错误 3：没有 Reviewer

如果只有 Worker 输出，Coordinator 直接相信，容易出错。

更好的模式：

```
Worker 负责产出
Reviewer 负责找问题
Coordinator 负责裁决
```

尤其是代码、数据分析、运营策略、售后诊断这类任务，都应该有独立审查。

------

# 6. 多 Agent 的任务类型

可以把子任务分成三类：

## 1）Research Task：研究型任务

```
查资料
读代码
分析日志
检索知识库
分析历史案例
```

特点：

```
只读
适合并行
冲突风险低
```

## 2）Execution Task：执行型任务

```
写代码
修改配置
生成工单草稿
创建活动草案
```

特点：

```
会改变状态
需要权限控制
最好串行或明确边界
```

## 3）Review Task：审查型任务

```
代码审查
风险审查
数据结论复核
运营方案审核
诊断建议复查
```

特点：

```
应该独立于执行者
最好只读
目标是发现遗漏和风险
```

这三类任务在项目 B 里非常有用。

------

# 7. OpenHarness 里的多 Agent 形态

OpenHarness 支持 agent / task 相关工具，让主 Agent 可以创建子 Agent、发送消息、读取任务输出。官方 README 也把它定义为一个提供工具、记忆、权限和 coordination 的完整 agent harness。

它的核心设计可以概括为：

```
主 Agent / Coordinator
  ↓
agent tool 创建 Worker
  ↓
Worker 独立执行子任务
  ↓
send_message 给 Worker 补充指令
  ↓
task_output 读取 Worker 结果
  ↓
Coordinator 汇总
```

另外，OpenHarness 最近的 issue 里还暴露了一个非常真实的工程问题：在 coordinator mode 下，如果交互式 UI 没有正确 drain async agent 任务，主 Agent 可能会反复 `sleep` 和 `task_get` 轮询，导致 UI 被锁住。这个 issue 说明多 Agent 不只是 prompt 设计，还涉及任务调度、异步状态回收和 UI 可交互性。

所以你要记住：

```
多 Agent 的难点不只是“怎么派任务”，
还包括“怎么管理异步任务、状态、结果和用户交互”。
```

------

# 8. 多 Agent 和 Tools / Permissions 的关系

Worker Agent 不是天然安全的。

每个 Worker 仍然必须受 Harness 控制：

```
Worker 有哪些工具？
Worker 能不能写文件？
Worker 能不能运行 bash？
Worker 能不能访问客户数据？
Worker 能不能提交审批？
Worker 输出是否需要 Reviewer？
```

所以多 Agent 系统里，权限要分角色配置。

比如：

```
Research Agent：
只允许 read / search / query。

Execution Agent：
允许 create_draft / write_file，但需要确认。

Risk Agent：
只读，但能访问风控规则。

Coordinator：
能派发任务、整合结果，但不直接执行高风险动作。
```

核心原则：

```
多 Agent 不是绕过权限；
每个 Agent 都应该有自己的最小权限集。
```

------

# 9. 迁移到项目 A：设备售后诊断

项目 A 可以设计成这样：

```
Coordinator：售后诊断总控 Agent
  ↓
Fault Research Agent：
检索故障知识库、说明书、历史案例。

Device History Agent：
查询设备历史工单、维修记录、传感器摘要。

Ticket Agent：
生成工单草稿、补全字段、判断 SLA。

Risk Review Agent：
检查是否涉及安全事故、赔付风险、投诉升级。
```

流程：

```
用户描述故障
  ↓
Coordinator 提取设备型号、症状、时间
  ↓
Fault Research Agent 查知识库
  ↓
Device History Agent 查历史记录
  ↓
Coordinator 汇总可能原因
  ↓
Risk Review Agent 审查是否需要升级
  ↓
Ticket Agent 生成工单草稿
  ↓
用户确认后才创建或提交工单
```

重点边界：

```
诊断可以自动
工单草稿可以自动
正式派单、关闭工单、退款赔付必须人工确认
```

------

# 10. 迁移到项目 B：多 Agent 运营中台

项目 B 更适合多 Agent。

可以设计：

```
Coordinator Agent：
理解运营目标，拆解任务，汇总方案。

Data Agent：
查询指标、分析分群、找异常原因。

Strategy Agent：
生成运营策略、活动机制、触达节奏。

Content Agent：
生成短信、Push、邮件、站内信文案。

Risk Agent：
检查频控、敏感词、用户同意、预算、合规风险。

Experiment Agent：
设计 A/B 实验、指标口径、样本划分。

Review Agent：
复核整体策略是否证据充分、风险可控。
```

完整流程：

```
用户：帮我设计老用户召回活动
  ↓
Coordinator 拆任务
  ↓
Data Agent 查询流失人群和历史表现
  ↓
Strategy Agent 生成召回策略
  ↓
Content Agent 生成文案
  ↓
Risk Agent 检查触达风险
  ↓
Experiment Agent 设计 A/B 实验
  ↓
Review Agent 复核方案
  ↓
Coordinator 汇总最终活动草案
  ↓
提交审批，不直接发送
```

项目 B 的关键原则：

```
多 Agent 可以共同生成运营方案，
但不能绕过审批系统直接触达用户。
```

------

# 11. 多 Agent 的输出格式建议

Coordinator 最终输出不要只写“这是方案”，而应该标准化：

```
1. 任务目标
2. 子 Agent 分工
3. 关键发现
4. 证据来源
5. 最终建议
6. 风险检查
7. 待人工确认项
8. 下一步动作
```

这能让多 Agent 结果可读、可审计、可复盘。

------

# 12. M9 面试表达

你可以这样讲：

> 我理解多 Agent 不是简单并发调用多个模型，而是通过 Coordinator 做任务编排。Coordinator 负责理解目标、拆解任务、分派 Worker、收集输出、安排 Reviewer 复查，并最终汇总结论。Worker 负责局部执行，Reviewer 负责独立验证。多 Agent 适合复杂、可拆解、可并行、需要审查的任务；简单任务反而不应该强行多 Agent。工程上还要处理异步任务调度、结果回收、上下文隔离、权限隔离和冲突管理。比如在运营中台里，我会让 Data Agent 查指标，Strategy Agent 生成方案，Risk Agent 做风控，Experiment Agent 设计实验，Coordinator 统一汇总并提交审批，而不是让任何 Agent 直接触达用户。

------

# 13. 本讲只记三句话

```
1. 多 Agent 的核心是 Coordinator 编排，不是多开几个模型。

2. Research 可以并行，Execution 要控边界，Review 要独立。

3. 每个 Agent 都要有最小权限，不能用多 Agent 绕过审批和风控。
```

下一讲进入 **M10：把 Harness Engineering 迁移到你的项目 A / 项目 B**。

这一讲会把前面 M1-M9 整合成一套你可以写进项目文档、简历和面试表达的架构方案。



好的，先将harness 的核心以及创新点，然后再M1-M9 整合成一套你可以写进项目文档、简历和面试表达的架构方案。



已停止思考快速回答



好的，先将harness 的核心以及创新点，然后再M1-M9 整合成一套你可以写进项目文档、简历和面试表达的架构方案。



这次我会把前面内容收束成“可直接写入项目文档/简历/面试”的版本：先提炼 Harness 的核心与创新点，再给出一套可落地的项目架构表达。

已思考 20s

可以。我们现在把前面 **M1-M9** 收束成一套“可写进项目文档、简历和面试”的版本。

# 一、Harness 的核心到底是什么？

一句话：

> **Harness 是包在 LLM 外面的 Agent Runtime。模型负责思考和决策，Harness 负责上下文、工具、权限、记忆、验证、多 Agent 调度和外部系统接入。**

OpenHarness 官方 README 对 Agent Harness 的定义很直接：LLM 提供智能，Harness 提供“手、眼睛、记忆和安全边界”。它也把 OpenHarness 定位成一个可以研究 tools、skills、agent coordination、plugins、providers、domain knowledge 的开源 Python 实现。

所以 Harness 不是某一个 prompt，也不是单纯 function calling，而是：

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

OpenAI 的 Harness Engineering 文章里也强调：团队的工作不再只是手写代码，而是设计环境、指定意图、构建反馈循环，让 Codex agents 能可靠完成工作。

------

# 二、Harness Engineering 的核心创新点

## 1. 工程师角色变化：从“写代码的人”变成“设计 Agent 工作环境的人”

传统开发是：

```
人写代码 → 人测试 → 人修 bug
```

Harness Engineering 是：

```
人定义目标、环境、规则、反馈闭环
  ↓
Agent 读上下文、调工具、写代码、跑测试、修复问题
  ↓
人审查关键决策和高风险动作
```

OpenAI 在文章中提到，他们用 Codex 生成应用逻辑、测试、CI、文档、观测和内部工具，人的核心工作转向环境设计、意图表达和反馈循环建设。

这就是第一个创新点：

> **人不再把时间主要花在“执行代码细节”，而是花在“让 Agent 能可靠执行”的系统设计上。**

------

## 2. 从 Prompt Engineering 升级为 Runtime Engineering

Prompt Engineering 主要解决：

```
怎么问模型？
```

Harness Engineering 解决：

```
模型在哪个环境里工作？
能看到哪些上下文？
能调用哪些工具？
哪些动作需要权限？
工具结果如何回灌？
上下文满了怎么办？
多个 Agent 怎么协作？
结果怎么验证？
```

所以它的创新不是“写一个更长的提示词”，而是：

> **把 Agent 执行过程工程化、运行时化、可控化。**

------

## 3. 模型决策权和执行权分离

Harness 的关键安全原则是：

```
模型可以提出 tool_use，
但真正执行工具的是 Harness。
```

模型说：

```
我要读取文件
我要执行命令
我要创建工单
我要提交活动
```

Harness 决定：

```
工具是否存在？
参数是否合法？
是否只读？
是否命中敏感路径？
当前用户是否有权限？
是否需要人工确认？
是否要拒绝执行？
```

这就是 Agent 能落地到真实业务系统的基础。

------

## 4. 上下文不再是“一大坨 prompt”，而是动态组装流水线

成熟 Harness 不会把所有规则、记忆、技能、文档都塞进 system prompt，而是分层组装：

```
Base System Prompt
+ Environment Info
+ Project Rules
+ Available Skills Index
+ Relevant Memories
+ Current Task Context
+ Tool Results
+ Compaction Summary
```

这带来三个优势：

```
减少上下文浪费
降低规则冲突
让不同来源的信息可治理、可替换、可压缩
```

------

## 5. Skills 把可复用流程沉淀成“任务说明书”

Tool 是动作，Skill 是方法。

```
Tool：query_metrics
作用：查询指标。

Skill：metric-diagnosis
作用：告诉 Agent 如何诊断指标异常。
```

Skills 的创新点是：

> **把复杂工作流从 prompt 中抽离出来，变成可版本化、可复用、按需加载的任务手册。**

------

## 6. 权限系统让 Agent 从“能做事”变成“能安全做事”

没有权限系统，Agent 只是一个能调用工具的模型。

有权限系统，Agent 才能进入真实业务环境：

```
查询类动作：自动允许
变更类动作：需要确认
高风险动作：强制审批
敏感动作：直接禁止
```

OpenHarness README 也显示它支持 dry-run 预览，在不执行模型、工具或子 Agent 的情况下解析 runtime settings、auth、prompt assembly、skills、commands、tools 和 MCP 配置，这体现了 Harness 对运行前可见性和安全预检的重视。

------

## 7. 多 Agent 不是多开模型，而是 Coordinator 编排系统

真正的多 Agent 是：

```
Coordinator 拆任务
Worker 执行子任务
Reviewer 独立验证
Coordinator 汇总结果
权限系统控制每个 Agent 的边界
```

不是：

```
随便启动 5 个模型一起聊
```

OpenHarness README 中也把它定位为可以实验 agent coordination patterns、multi-agent prototype harness 和 background execution primitives 的系统。

------

# 三、M1-M9 整合后的项目架构方案

你可以把它命名为：

```
Agent Harness Runtime Architecture
```

或者更适合项目文档的名字：

```
面向业务场景的可控多 Agent Runtime 架构
```

整体架构如下：

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

------

# 四、可写进项目文档的架构说明

下面这段可以直接写入你的项目文档。

## 1. 架构定位

```
本项目设计了一套 Agent Harness Runtime，用于将大模型从单轮问答能力扩展为可执行、可治理、可验证的业务 Agent 系统。该 Runtime 将模型推理、工具调用、权限控制、上下文管理、技能工作流、记忆压缩和多 Agent 协作进行解耦，使 Agent 能够在真实业务环境中安全完成复杂任务。
```

------

## 2. 核心模块设计

### M1：Runtime Bootstrap 启动层

负责：

```
加载配置
选择模型 Provider
初始化工具注册表
加载插件和 Skills
初始化权限系统
创建 Agent Executor / QueryEngine
```

项目文档表达：

```
Runtime Bootstrap 层负责根据用户、租户、业务场景和执行模式构建一次 Agent 会话所需的完整运行环境，包括模型客户端、工具注册表、权限检查器、上下文构造器、记忆模块和多 Agent 调度器。
```

------

### M2：Context Assembly 上下文层

负责：

```
组装 system prompt
注入项目规则
注入当前任务上下文
注入相关 memory
暴露 available skills
控制模型每轮能看到什么
```

项目文档表达：

```
Context Assembly 层将基础行为规则、当前任务信息、业务约束、相关记忆、可用技能和工具说明动态拼接为模型上下文，避免将所有知识一次性塞入 prompt，从而降低上下文浪费和规则冲突。
```

------

### M3：Agent Loop 执行循环层

负责：

```
模型推理
识别 tool_use
执行工具
回灌 tool_result
继续下一轮推理
直到任务完成
```

项目文档表达：

```
Agent Loop 层采用 Think-Act-Observe 的循环结构。模型负责提出工具调用意图，Harness 负责执行工具并将结果回灌给模型，使 Agent 能够基于外部观察不断修正推理和行动。
```

------

### M4：Tool Gateway 工具网关层

负责：

```
统一封装业务工具
定义输入 schema
注册工具
校验参数
返回标准 ToolResult
```

项目文档表达：

```
Tool Gateway 层将知识库检索、数据库查询、工单操作、活动系统、审批系统等外部能力统一封装为结构化工具。所有工具通过 schema 暴露给模型，并在执行前进行参数校验和权限检查。
```

------

### M5：Permission & Governance 权限治理层

负责：

```
区分只读工具和变更工具
检查用户权限
检查租户权限
检查敏感动作
决定自动执行、人工确认或拒绝
记录审计日志
```

项目文档表达：

```
Permission & Governance 层负责在工具执行前进行风险控制。系统根据工具类型、用户角色、业务风险等级和操作对象，决定该工具调用是否自动允许、需要人工确认、进入审批流或直接拒绝。
```

------

### M6：Skills Workflow 技能流程层

负责：

```
沉淀可复用任务流程
按需加载任务说明
指导 Agent 标准化执行
```

项目文档表达：

```
Skills Workflow 层将故障诊断、指标分析、活动策划、风险审核等复杂流程抽象为可复用 Skill。模型在系统提示中只看到技能目录，当任务匹配某个 Skill 时，再按需加载完整流程说明。
```

------

### M7：Hooks / Plugins / MCP 扩展层

负责：

```
工具调用前拦截
工具调用后审计
插件化扩展能力
接入外部系统
```

项目文档表达：

```
扩展层通过 Hooks 在用户输入、工具调用前后、任务结束等生命周期节点插入风控、审计、记忆更新和自动化逻辑；通过 Plugins 打包复用 Skills、Hooks、Tools 和 Agents；通过 MCP 或适配器机制接入外部业务系统。
```

------

### M8：Memory & Compaction 记忆压缩层

负责：

```
保存长期偏好
保存项目经验
检索相关 memory
压缩长任务上下文
处理大型工具结果
```

项目文档表达：

```
Memory & Compaction 层区分长期记忆和短期任务状态。长期记忆保存稳定偏好、项目事实和可复用经验；上下文压缩则在长任务中保留目标、关键证据、已完成步骤和下一步计划，防止上下文溢出导致任务中断。
```

------

### M9：Multi-Agent Coordinator 多 Agent 编排层

负责：

```
拆解复杂任务
分派 Worker Agent
控制权限边界
收集子任务结果
调用 Reviewer 审查
汇总最终输出
```

项目文档表达：

```
Multi-Agent Coordinator 层负责复杂任务的拆解和调度。Coordinator Agent 根据任务目标分派 Data Agent、Strategy Agent、Risk Agent、Review Agent 等专职 Agent 执行子任务，并统一收集、审查和汇总结果。
```

------

# 五、迁移到项目 A：设备售后诊断与工单闭环 RAG

如果写项目 A，可以这样组织：

```
用户报修问题
  ↓
Coordinator Agent 提取设备型号、故障现象、客户等级
  ↓
Fault Diagnosis Skill 加载诊断流程
  ↓
Fault Research Agent 查询知识库
  ↓
Device History Agent 查询历史工单和维修记录
  ↓
Risk Review Agent 判断是否涉及安全、赔付、投诉升级
  ↓
Ticket Agent 生成工单草稿
  ↓
Permission Checker 判断是否需要人工确认
  ↓
人工确认后创建或更新工单
```

项目 A 的核心亮点：

```
1. RAG 不只是问答，而是嵌入 Agent Loop。
2. 工单系统不是直接暴露给模型，而是通过 Tool Gateway + Permission Checker 控制。
3. 故障诊断流程沉淀为 Skill，支持按设备类型扩展。
4. 高风险动作如关闭工单、退款、赔付承诺必须人工确认。
5. 历史维修经验进入 Memory，用于后续诊断复用。
```

项目 A 文档表述：

```
本项目构建了面向设备售后场景的 Agent Harness Runtime。系统通过 RAG 工具检索故障知识库，通过工单工具查询历史维修记录，通过 Skills 固化诊断流程，通过 Permission Checker 控制创建工单、派单、关闭工单等状态变更操作。Agent 可以自动完成故障信息提取、知识检索、诊断建议生成和工单草稿创建，但所有高风险售后决策均进入人工确认或审批流程。
```

------

# 六、迁移到项目 B：多 Agent 运营中台

如果写项目 B，可以这样组织：

```
用户提出运营目标
  ↓
Coordinator Agent 拆解任务
  ↓
Data Agent 查询指标和用户分群
  ↓
Strategy Agent 生成活动策略
  ↓
Content Agent 生成触达文案
  ↓
Risk Agent 检查频控、预算、合规、用户同意
  ↓
Experiment Agent 设计 A/B 实验
  ↓
Review Agent 独立审查方案
  ↓
Coordinator 汇总活动草案
  ↓
提交审批，不直接触达用户
```

项目 B 的核心亮点：

```
1. 用 Coordinator 负责运营任务拆解和多 Agent 调度。
2. 用 Data Agent、Strategy Agent、Risk Agent、Review Agent 实现职责隔离。
3. 用 Tool Gateway 接入指标系统、CRM、活动系统、审批系统。
4. 用 Permission Checker 控制触达、预算、活动上线等高风险动作。
5. 用 Skills 沉淀指标诊断、用户分群、活动策划、风险审核流程。
6. 用 Memory 保存历史活动复盘、指标口径和策略经验。
7. 用 Compaction 支持长链路运营策略生成，不因上下文过长中断。
```

项目 B 文档表述：

```
本项目设计了一套面向运营场景的多 Agent Harness Runtime。系统以 Coordinator Agent 为核心，将运营任务拆解为数据分析、策略生成、内容生成、风险审核和实验设计等子任务，并分派给不同专职 Agent 执行。所有业务能力通过 Tool Gateway 统一封装，所有变更型动作均经过 Permission Checker 和审批流控制。系统通过 Skills 沉淀运营方法论，通过 Memory 保存历史活动复盘与指标口径，通过 Context Compaction 支持长任务连续执行，最终实现可控、可审计、可复盘的智能运营中台。
```

------

# 七、可以写进简历的项目表达

## 项目 A 简历版

```
设计并实现面向设备售后场景的 Agent Harness Runtime，将 RAG 检索、工单系统、权限控制和诊断流程编排整合为可执行 Agent。系统通过 Tool Gateway 封装知识库检索、历史工单查询、工单草稿创建等能力，通过 Permission Checker 控制派单、关闭工单、退款等高风险动作，通过 Skills 沉淀故障诊断和风险升级流程，并结合 Memory 复用历史维修经验，提高售后诊断效率和工单处理一致性。
```

## 项目 B 简历版

```
设计并实现多 Agent 运营中台的 Harness Runtime 架构，基于 Coordinator-Worker 模式拆解运营任务，构建 Data Agent、Strategy Agent、Content Agent、Risk Agent、Review Agent 等专职 Agent。系统通过 Tool Gateway 接入指标、CRM、活动和审批系统，通过 Permission Checker 实现触达、预算、上线等高风险动作治理，通过 Skills 沉淀指标诊断、用户分群、活动策划和风控审核流程，并引入 Memory 与 Context Compaction 支持长链路策略生成和历史经验复用。
```

## 更技术化的简历版

```
参考 Agent Harness 架构设计多 Agent Runtime，完成 Runtime Bootstrap、Context Assembly、Agent Loop、Tool Registry、Permission Checker、Skills Workflow、Memory/Compaction 和 Coordinator 调度模块设计。通过结构化工具 schema、最小权限控制、HITL 审批、生命周期 Hooks 和多 Agent 职责隔离，实现业务 Agent 的可执行、可治理、可审计和可扩展。
```

------

# 八、面试时怎么讲：一段完整表达

你可以这样说：

```
我对 Agent 的理解不是单纯调大模型，而是要构建一套 Harness Runtime。模型本身只负责推理和决策，真正让它能够在业务系统中可靠工作的，是外层 Harness。

我把 Harness 拆成九层：第一层 Runtime Bootstrap 负责加载配置、模型 Provider、工具、权限和插件；第二层 Context Assembly 负责动态组装 system prompt、项目规则、相关记忆和 Skills；第三层 Agent Loop 负责 Think-Act-Observe 循环，让模型通过 tool_use 和 tool_result 持续推进任务；第四层 Tool Gateway 负责把数据库、知识库、工单系统、活动系统等外部能力封装成结构化工具；第五层 Permission Checker 负责判断工具调用是自动执行、人工确认、进入审批还是拒绝；第六层 Skills 把可复用业务流程沉淀成按需加载的任务说明书；第七层 Hooks、Plugins 和 MCP 负责生命周期治理和外部系统扩展；第八层 Memory 和 Context Compaction 负责长期经验复用和长任务状态压缩；第九层 Multi-Agent Coordinator 负责任务拆解、Worker 分派、Reviewer 审查和最终汇总。

在业务项目里，比如多 Agent 运营中台，我会让 Coordinator 负责拆解运营目标，Data Agent 查指标，Strategy Agent 生成方案，Risk Agent 做风控，Review Agent 做独立审查。所有工具调用都经过 Tool Gateway 和 Permission Checker，查询类动作可以自动执行，但正式触达用户、调整预算、上线活动等高风险动作必须经过人工审批。这样系统既能发挥大模型的推理和生成能力，又能满足真实业务中的权限、安全、审计和可复盘要求。
```

------

# 九、最适合写进项目文档的总架构图

```
┌──────────────────────────────────────────────┐
│                 User / API / UI               │
└──────────────────────┬───────────────────────┘
                       ↓
┌──────────────────────────────────────────────┐
│ M1 Runtime Bootstrap                          │
│ 配置加载 / Provider 选择 / Session 初始化       │
└──────────────────────┬───────────────────────┘
                       ↓
┌──────────────────────────────────────────────┐
│ M2 Context Assembly                           │
│ System Prompt / 项目规则 / Skills / Memory     │
└──────────────────────┬───────────────────────┘
                       ↓
┌──────────────────────────────────────────────┐
│ M3 Agent Loop                                 │
│ Think → Tool Use → Observe → Continue          │
└──────────────────────┬───────────────────────┘
                       ↓
┌──────────────────────────────────────────────┐
│ M4 Tool Gateway                               │
│ 业务工具封装 / Schema 校验 / ToolResult 标准化  │
└──────────────────────┬───────────────────────┘
                       ↓
┌──────────────────────────────────────────────┐
│ M5 Permission & Governance                    │
│ 权限判断 / 风险分级 / HITL / 审计               │
└──────────────────────┬───────────────────────┘
                       ↓
┌──────────────────────────────────────────────┐
│ M6 Skills Workflow                            │
│ 故障诊断 / 指标分析 / 活动策划 / 风控审核        │
└──────────────────────┬───────────────────────┘
                       ↓
┌──────────────────────────────────────────────┐
│ M7 Hooks / Plugins / MCP                      │
│ 生命周期扩展 / 插件化 / 外部系统接入            │
└──────────────────────┬───────────────────────┘
                       ↓
┌──────────────────────────────────────────────┐
│ M8 Memory & Context Compaction                │
│ 长期记忆 / 任务状态压缩 / 工具结果摘要          │
└──────────────────────┬───────────────────────┘
                       ↓
┌──────────────────────────────────────────────┐
│ M9 Multi-Agent Coordinator                    │
│ 任务拆解 / Worker 调度 / Reviewer 审查 / 汇总   │
└──────────────────────┬───────────────────────┘
                       ↓
┌──────────────────────────────────────────────┐
│        Business Systems / DB / KB / Approval  │
└──────────────────────────────────────────────┘
```

------

# 十、最终一句话总结

你可以把 Harness Engineering 总结成这句话：

> **Harness Engineering 的核心创新，是把大模型从“回答问题的模型”工程化为“可执行、可约束、可观察、可验证、可协作的业务 Agent Runtime”。**

对你的项目来说，最重要的包装方式是：

```
我不是简单做了一个多 Agent demo，
而是设计了一套面向真实业务的 Agent Harness Runtime：
有上下文工程、有工具网关、有权限治理、有 Skills 工作流、
有 Memory/Compaction、有多 Agent 编排、有人工审批闭环。
```

这就是你在项目文档、简历和面试里最应该突出的核心竞争力。