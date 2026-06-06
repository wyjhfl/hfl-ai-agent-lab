# Structured Output 工程化：让模型输出能被系统消费

## 这篇文章解决什么问题

很多 LLM Demo 输出一段自然语言就结束了。但真实业务系统需要的是可解析、可校验、可落库、可评测的结构化结果。

常见问题：

- 模型输出 JSON 但格式不稳定。
- 字段缺失。
- 类型错误。
- 多输出了无关解释。
- 工具参数无法直接使用。
- 前端无法稳定渲染。
- 评测时不知道该比对哪个字段。

Structured Output 的目标是让模型输出从“给人看”变成“给系统用”。

## 为什么结构化输出重要

Agent 系统很多环节都依赖结构化输出：

- 工具调用参数。
- RAG 答案引用。
- 工单字段。
- 风险标签。
- 评测结果。
- 多 Agent handoff。
- 前端状态展示。

没有结构化输出，系统只能靠正则或人工阅读，工程稳定性很差。

## 基本模式

### 1. JSON Schema

用 schema 定义字段、类型、required、enum、范围。

```json
{
  "type": "object",
  "properties": {
    "answer": {"type": "string"},
    "citations": {
      "type": "array",
      "items": {"type": "string"}
    },
    "confidence": {
      "type": "number",
      "minimum": 0,
      "maximum": 1
    }
  },
  "required": ["answer", "citations", "confidence"]
}
```

### 2. Pydantic / TypeScript 类型

后端用 Pydantic 校验，前端用 TypeScript 类型消费。

```python
class SupportAnswer(BaseModel):
    answer: str
    citations: list[str]
    confidence: float
```

### 3. 输出修复

如果模型输出不符合 schema，可以做一次修复重试，但不能无限重试。

## Schema 设计原则

### 字段少而明确

不要一开始设计几十个字段。字段越多，失败概率越高。

### enum 优先

分类字段尽量用 enum：

```json
{
  "risk_level": {
    "type": "string",
    "enum": ["low", "medium", "high"]
  }
}
```

### 数值要有范围

置信度、分数、top_k 等字段要限制范围。

### 引用要结构化

不要让模型把引用写在自然语言里。应该单独字段：

```json
{
  "citations": [
    {
      "doc_id": "manual-001",
      "page": 12,
      "quote": "检查风扇和散热口"
    }
  ]
}
```

### 错误也要结构化

模型无法回答时，也应该返回结构化拒答：

```json
{
  "status": "need_more_info",
  "message": "缺少设备型号和故障代码",
  "required_fields": ["equipment_model", "error_code"]
}
```

## 常见结构化输出场景

| 场景 | 输出结构 |
|---|---|
| RAG 问答 | answer、citations、confidence、missing_info |
| 工单生成 | title、priority、steps、required_parts、risk |
| 工具调用 | tool_name、arguments、requires_approval |
| 评测打分 | score、reason、failure_type |
| 简历优化 | bullet、evidence、risk_flags |
| 多 Agent handoff | facts、decisions、open_questions、next_action |

## 校验和重试

推荐流程：

```text
Model Output
  ↓
JSON Parse
  ↓
Schema Validation
  ↓
Business Rule Validation
  ↓
Repair Retry / Human Review
```

Schema 通过不代表业务正确。比如字段类型正确，但引用不存在，也要失败。

## 与工具调用的关系

工具调用本质上也是结构化输出。模型生成 arguments，系统负责：

- schema 校验。
- 权限检查。
- 风险分级。
- 幂等检查。
- 执行。

不要把模型输出的参数直接传给危险工具。

## 与评测的关系

结构化输出让评测更容易：

- 字段完整率。
- enum 正确率。
- 引用准确率。
- schema pass rate。
- repair retry rate。

这些指标比“感觉回答不错”更可用。

## 面试表达

可以这样讲结构化输出：

> 我会把 LLM 输出设计成系统 contract，而不是随便返回自然语言。对于 RAG，我会要求 answer、citations、confidence 和 missing_info；对于工单，我会要求 title、priority、steps 和 risk；对于工具调用，我会要求 tool_name、arguments 和 approval 标记。输出先做 JSON parse，再做 schema validation，最后做业务规则校验。Schema 通过不代表业务正确，比如引用 ID 不存在仍然要失败。这样前端、数据库、评测和工具层都能稳定消费模型结果。

## 相关链接

- [Tool Calling](/note/AI-Agent/tool-calling)
- [RAG 工程化](/note/Engineering/rag-engineering)
- [Eval Dataset 设计](/note/Engineering/eval-dataset-design)
- [Agent Trace 执行轨迹](/note/Engineering/agent-trace)

## 参考资料

- [OpenAI Structured Outputs](https://platform.openai.com/docs/guides/structured-outputs)
- [OpenAI Function Calling](https://platform.openai.com/docs/guides/function-calling)

