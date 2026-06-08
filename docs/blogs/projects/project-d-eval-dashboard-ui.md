# Project D Eval Dashboard UI

> 目标：把评测结果做成产品化界面，让招聘方能一眼看到“通过率、风险、失败分类、漂移和上线决策”。

## Dashboard Mockup

<div class="eval-lab-shell">
  <div class="eval-lab-header">
    <div><p class="mock-eyebrow">Agent Evaluation Lab</p><h2>Release Gate: Project B v0.5</h2></div>
    <span class="gate-pass">PASS WITH WARNINGS</span>
  </div>
  <div class="eval-lab-metrics">
    <div><strong>96.8%</strong><span>overall pass rate</span></div>
    <div><strong>100%</strong><span>critical safety</span></div>
    <div><strong>2.1%</strong><span>tool error rate</span></div>
    <div><strong>1.4x</strong><span>cost drift</span></div>
  </div>
  <div class="eval-lab-grid">
    <section>
      <p class="mock-eyebrow">Failure Clusters</p>
      <div class="failure-bar"><span style="width:42%"></span><b>retrieval_miss · 42%</b></div>
      <div class="failure-bar"><span style="width:24%"></span><b>tool_argument_error · 24%</b></div>
      <div class="failure-bar"><span style="width:18%"></span><b>skill_misfire · 18%</b></div>
      <div class="failure-bar"><span style="width:8%"></span><b>unsafe_output · 8%</b></div>
    </section>
    <section>
      <p class="mock-eyebrow">Critical Cases</p>
      <div class="case-row ok"><strong>REDTEAM-MCP-001</strong><span>tool poisoning blocked</span></div>
      <div class="case-row ok"><strong>APPROVAL-003</strong><span>destructive action gated</span></div>
      <div class="case-row warn"><strong>RAG-012</strong><span>citation missing in 1 variant</span></div>
      <div class="case-row ok"><strong>SKILL-007</strong><span>should-not-trigger passed</span></div>
    </section>
  </div>
</div>

## Dashboard 模块

| 模块 | 展示内容 | 用途 |
|---|---|---|
| Release Decision | pass / fail / needs review | 直接告诉是否能上线 |
| Scorecards | overall、safety、tool、rag、skill | 快速定位短板 |
| Failure Clusters | 错误聚类和占比 | 决定下一轮修复重点 |
| Critical Cases | 红队和高风险样本 | 安全门禁 |
| Drift Trend | 模型/Prompt/数据变化趋势 | 发现退化 |
| Replay Queue | 失败样本回放入口 | 复现和修复 |

## 面试表达

> Eval Dashboard 的价值是让评测结果产品化。它不是只输出一堆 JSON，而是直接告诉团队能不能发布、为什么不能发布、失败集中在哪类问题、哪些 critical case 必须修复。
