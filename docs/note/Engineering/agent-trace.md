# Agent Trace 执行轨迹

## 这一节解决什么问题

Agent 的执行过程不像传统 API 那样"一问一答"。一次 Agent 执行可能包含多轮推理、多次工具调用、条件分支、循环、失败重试。当 Agent 输出错误结果时，如果没有完整的执行轨迹记录，就无法定位是哪一步出了问题——是推理错误、工具返回异常、还是参数生成有误。Trace 解决的就是"Agent 做了什么、每一步的结果是什么、问题出在哪里"的问题。

## 核心概念

**Trace**：一次 Agent 执行的完整轨迹记录，包含所有步骤的输入、输出、工具调用、状态变化、时间消耗。

**Run ID**：一次 Agent 执行的唯一标识符，用于关联这次执行的所有 Trace 记录。

**Step ID**：Trace 中每个步骤的唯一标识符，用于定位具体是哪一步出了问题。

**Span**：Trace 中的一个操作单元，可以是一次 LLM 调用、一次工具调用、或一次状态更新。Span 有开始时间、结束时间、输入、输出、状态。

**关键决策摘要**：Agent 在每个决策点的选择记录——选择了哪个工具、用了什么参数、为什么选择这个工具。不需要记录模型的完整推理过程，只需要记录决策结果和关键依据。

## 工程化设计

一次 Agent 执行的 Trace 应该记录以下信息：

**执行层**：run_id、开始时间、结束时间、总耗时、最终状态（成功/失败/超时）、最终输出。

**步骤层**：每个步骤的 step_id、步骤类型（推理/工具调用/人工审核）、输入、输出、耗时、状态。

**工具调用层**：工具名称、参数、返回结果、执行耗时、是否成功、错误信息。

**状态变化层**：每次状态更新的快照，记录 State 从什么值变成了什么值。

Trace 的存储需要考虑查询效率和存储成本。通常 Trace 数据用结构化存储（如 ClickHouse、Elasticsearch），支持按 run_id、时间范围、状态等维度查询。过期 Trace 需要定期归档或清理。

关键决策摘要只记录决策结果和选择依据，不记录模型不可见的完整中间分析过程。这样既保留了调试所需的信息，又避免了信息泄露风险。

## 最小实现思路

```python
import uuid
import time
from dataclasses import dataclass, field
from typing import Any

@dataclass
class Span:
    span_id: str
    span_type: str  # "llm", "tool", "state_update"
    input_data: Any
    output_data: Any
    start_time: float
    end_time: float
    status: str  # "success", "failed"
    metadata: dict = field(default_factory=dict)

@dataclass
class Trace:
    run_id: str
    spans: list = field(default_factory=list)
    start_time: float = 0
    end_time: float = 0

class Tracer:
    def __init__(self):
        self.trace = Trace(run_id=str(uuid.uuid4()), start_time=time.time())

    def start_span(self, span_type: str, input_data: Any, metadata: dict = None) -> str:
        span_id = str(uuid.uuid4())
        span = Span(
            span_id=span_id,
            span_type=span_type,
            input_data=input_data,
            output_data=None,
            start_time=time.time(),
            end_time=0,
            status="running",
            metadata=metadata or {},
        )
        self.trace.spans.append(span)
        return span_id

    def end_span(self, span_id: str, output_data: Any, status: str = "success"):
        for span in self.trace.spans:
            if span.span_id == span_id:
                span.output_data = output_data
                span.end_time = time.time()
                span.status = status
                break

    def finish(self, final_output: Any, status: str = "success"):
        self.trace.end_time = time.time()
        save_trace(self.trace, final_output, status)
```

## 生产环境注意点

**存储成本**：Trace 数据量大，需要设置保留策略（如 7 天热数据、30 天冷数据、90 天归档）。

**敏感信息**：Trace 中可能包含用户输入、工具返回的敏感数据，需要在存储前做脱敏处理。

**性能影响**：Trace 记录不能阻塞 Agent 执行，应该异步写入。高频 Trace 可以做采样（如只记录 10% 的成功请求，但记录所有失败请求）。

**查询效率**：需要支持按 run_id 查询完整 Trace、按时间范围查询、按状态筛选失败 Trace。索引设计很关键。

**失败定位**：当 Agent 输出错误结果时，通过 Trace 可以快速定位是哪一步出了问题——查看每个步骤的输入输出和状态。

## 常见误区

1. **不记录 Trace**：出了问题无法定位，只能靠猜。
2. **记录过多**：把模型的完整推理过程都记录下来，既浪费存储又可能泄露信息。
3. **Trace 记录阻塞主流程**：同步写入 Trace 会增加 Agent 执行延迟。
4. **不做脱敏**：Trace 中包含敏感信息，存储不当可能导致数据泄露。
5. **没有失败样本沉淀**：失败的 Trace 应该单独收集，用于改进 Agent 和评测集建设。

## 面试表达

Agent 的执行过程包含多轮推理和工具调用，当输出错误结果时需要能定位是哪一步出了问题。Trace 记录了每次 Agent 执行的完整轨迹：每个步骤的输入输出、工具调用的参数和结果、状态变化、时间消耗。

工程上 Trace 需要考虑几个点：存储成本（设置保留策略）、脱敏（不存储敏感信息）、异步写入（不阻塞主流程）、查询效率（按 run_id 和时间范围索引）。失败的 Trace 应该单独收集，用于改进 Agent 和评测集建设。关键决策摘要只记录决策结果，不记录完整的中间推理过程。

## 相关链接

- [Trace 与 Evaluation](/note/AI-Agent/evaluation) — 评测机制
- [Evaluation Pipeline](/note/Engineering/eval-pipeline) — 评测流水线
- [日志与可观测性](/note/Engineering/observability) — 日志基础设施
