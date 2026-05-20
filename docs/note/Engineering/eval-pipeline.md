# Evaluation Pipeline 评测流水线

## 这一节解决什么问题

AI Agent 和 RAG 系统的效果不像传统软件那样可以用确定性测试验证。同一个输入，模型可能给出不同的输出；同一个 Prompt 的微小修改，可能导致效果大幅提升或严重退化。如果没有系统化的评测机制，就无法知道 Agent 的真实质量，也无法在修改后验证效果是否改善。评测流水线解决的就是"怎么系统化地评估 Agent 效果、怎么发现退化、怎么驱动改进"的问题。

## 核心概念

**测试集**：一组标注好的输入-输出对，用于评估 Agent 的回答质量。测试集应该覆盖常见场景、边界情况和已知失败案例。

**自动评测**：用程序自动对比 Agent 输出和预期输出，计算准确率、召回率等指标。适合大规模、高频的评测。

**人工评审**：由人工对 Agent 输出打分或标记，评估回答质量、幻觉率、可用性等维度。适合小规模、深度评测。

**失败样本**：Agent 输出错误的案例，收集后用于分析失败模式、改进 Prompt、扩充测试集。

**回归测试**：每次修改后重新运行测试集，确保没有引入新的退化。回归测试是持续改进的安全网。

**版本对比**：对比不同版本（Prompt 版本、模型版本、RAG 配置版本）的评测结果，量化改进幅度。

**评测报告**：汇总评测结果的结构化文档，包含指标趋势、失败分析、改进建议。

## 工程化设计

评测流水线通常包含五个阶段：

**1. 测试集管理**。测试集存储在版本控制系统中，支持增删改查。每条测试用例包含输入、预期输出、标签（场景分类、难度等级）。

**2. 执行评测**。批量运行测试集，收集 Agent 的实际输出。支持并发执行以加速大规模评测。

**3. 计算指标**。根据 Agent 输出和预期输出计算各项指标。RAG 评测常用 Recall@K、Precision@K、MRR；Agent 评测常用任务完成率、工具调用准确率、幻觉率。

**4. 人工抽检**。对自动评测结果进行人工抽检，验证自动评测的准确性，发现自动评测遗漏的问题。

**5. 生成报告**。汇总评测结果，对比历史版本，标注退化项，生成评测报告。

## 最小实现思路

```python
# 1. 测试集定义
test_cases = [
    {
        "id": "tc_001",
        "input": "查询订单 12345 的状态",
        "expected_output": "订单 12345 状态：已发货",
        "tags": ["order_query", "basic"],
        "expected_tools": ["query_order"],
    },
    # ... 更多测试用例
]

# 2. 执行评测
def run_evaluation(test_cases, agent):
    results = []
    for case in test_cases:
        try:
            output = agent.run(case["input"])
            results.append({
                "case_id": case["id"],
                "input": case["input"],
                "expected": case["expected_output"],
                "actual": output,
                "tools_called": agent.get_tool_calls(),
                "status": "success",
            })
        except Exception as e:
            results.append({
                "case_id": case["id"],
                "status": "error",
                "error": str(e),
            })
    return results

# 3. 计算指标
def compute_metrics(results):
    total = len(results)
    success = sum(1 for r in results if r["status"] == "success")
    match = sum(1 for r in results if r.get("actual") == r.get("expected"))
    return {
        "success_rate": success / total,
        "accuracy": match / total if total > 0 else 0,
        "total": total,
    }

# 4. 版本对比
def compare_versions(current_metrics, baseline_metrics):
    diff = {}
    for key in current_metrics:
        if key in baseline_metrics:
            diff[key] = current_metrics[key] - baseline_metrics[key]
    return diff
```

## 生产环境注意点

**测试集质量**：测试集的质量决定评测的可信度。需要定期审查和更新测试用例，淘汰过时的用例，补充新发现的失败案例。

**评测频率**：每次 Prompt 修改、模型升级、RAG 配置变更后都应该运行回归测试。日常可以每天运行一次全量评测。

**失败样本收集**：线上运行中发现的失败案例应该自动收集到失败样本库，定期审查后加入测试集。

**指标设计**：不同场景需要不同指标。客服场景关注回答准确率和幻觉率，工具调用场景关注工具选择准确率和参数正确率。

**评测环境一致性**：评测需要在稳定的环境中运行，避免网络波动、模型版本变化等外部因素影响结果。

## 常见误区

1. **只做人工评测不做自动评测**：人工评测成本高、频率低，无法做持续回归测试。
2. **测试集不更新**：测试集陈旧后无法覆盖新的场景和失败模式。
3. **不收集失败样本**：失败样本是最宝贵的改进资源，不收集就是浪费。
4. **评测结果不版本化**：无法对比不同版本的效果，无法量化改进幅度。
5. **只看平均指标不看失败案例**：平均指标可能掩盖严重的单点失败。

## 面试表达

AI Agent 的效果不像传统软件可以用确定性测试验证，需要系统化的评测流水线。评测流水线包含测试集管理、执行评测、计算指标、人工抽检、生成报告五个阶段。核心是测试集（覆盖常见场景和已知失败案例）和回归测试（每次修改后验证没有退化）。

工程上需要关注几个点：测试集质量（定期审查更新）、失败样本收集（线上失败自动收集到样本库）、版本对比（量化每次改进的幅度）、指标设计（不同场景用不同指标）。评测流水线是 Agent 持续改进的安全网。

## 相关链接

- [Trace 与 Evaluation](/note/AI-Agent/evaluation) — 评测机制
- [Agent Trace](/note/Engineering/agent-trace) — 执行轨迹记录
- [RAG 面试题](/note/AI-Interview/rag-interview) — RAG 评测指标
