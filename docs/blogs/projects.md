---
layout: page
sidebar: false
---

<div class="project-hero">
  <p class="project-eyebrow">Project Portfolio</p>
  <h1>项目实战</h1>
  <p>项目页按“业务问题 → 架构能力 → 可展示证据 → 面试表达”组织，不只列技术栈，而是让读者快速看到 RAG、Agent Runtime、工具治理、评测、上线和安全治理能力。</p>
</div>

<div class="project-card-grid">
  <a class="project-card project-card-featured" href="/projects/project-a-rag-workorder">
    <span>Project A / RAG Workorder</span>
    <h3>设备售后诊断与工单 RAG 系统</h3>
    <p>面向设备售后场景，构建设备故障知识检索、智能诊断、工单生成和后端工程化链路。</p>
  </a>
  <a class="project-card" href="/projects/project-b-agent-copilot">
    <span>Project B / Multi-Agent Copilot</span>
    <h3>运营中台多 Agent Copilot</h3>
    <p>围绕 LangGraph、工具调用、人工审批、Trace、Evaluation 与 Guardrails 展示多 Agent 工程能力。</p>
  </a>
  <a class="project-card" href="/projects/project-b-roadmap">
    <span>Roadmap</span>
    <h3>项目 B 版本路线图</h3>
    <p>按 v0.1 到 v1.0 拆解 Agent 产品从 Demo 到可展示系统的迭代阶段。</p>
  </a>
  <a class="project-card" href="/topics/ai-agent-job-search-evidence-map">
    <span>Evidence Map</span>
    <h3>求职能力证据地图</h3>
    <p>把简历关键词绑定到项目、代码、文章、Demo、评测和面试故事。</p>
  </a>
  <a class="project-card" href="/topics/ai-agent-demo-acceptance-script">
    <span>Demo Script</span>
    <h3>Demo 验收脚本</h3>
    <p>按主路径、权限、工具风险、失败恢复、Trace 和评测准备 5 分钟演示。</p>
  </a>
</div>

<div class="portfolio-section-heading">
  <p class="project-eyebrow">Evidence Matrix</p>
  <h2>项目证据矩阵</h2>
  <p>每个项目都要能回答三个问题：解决什么业务问题、用了哪些 Agent / RAG 工程能力、有什么可验证证据。</p>
</div>

<div class="evidence-matrix">
  <div class="matrix-row matrix-head"><span>项目</span><span>核心能力</span><span>可展示证据</span><span>面试表达</span></div>
  <div class="matrix-row"><span><strong>Project A</strong><br />设备售后 RAG 工单</span><span>RAG 检索、引用、工单生成、后端工程化</span><span>项目详情、RAG 系统设计、Demo 验收脚本</span><span><a href="/topics/rag-project-interview">RAG 项目面试讲法</a></span></div>
  <div class="matrix-row"><span><strong>Project B</strong><br />运营中台 Multi-Agent Copilot</span><span>多 Agent 编排、工具治理、人工审批、Trace / Eval</span><span>路线图、Copilot 入口、Guardrails、可观测性 Dashboard</span><span><a href="/topics/ai-agent-project-defense-script">Agent 项目答辩脚本</a></span></div>
  <div class="matrix-row"><span><strong>Portfolio Site</strong><br />AI Agent Engineering Lab</span><span>内容架构、UI 信息层级、求职证据打包</span><span>UI 优化路线、专题地图、首页精选证据区</span><span><a href="/topics/ai-agent-offer-portfolio-review">Offer Review 清单</a></span></div>
</div>

<div class="portfolio-section-heading">
  <p class="project-eyebrow">Architecture Snapshot</p>
  <h2>架构快照</h2>
  <p>把项目讲成“输入、编排、工具、数据、治理、观测”的系统，而不是单点功能堆叠。</p>
</div>

<div class="architecture-snapshot-grid">
  <div class="architecture-card"><span>01 / Input</span><h3>任务入口与上下文收集</h3><p>用户问题、业务约束、租户权限、历史会话和附件资料统一进入上下文包。</p></div>
  <div class="architecture-card"><span>02 / Plan</span><h3>Agent 编排与状态机</h3><p>用 Router、Planner、Executor、Reviewer 拆分职责，关键节点记录 Decision Log。</p></div>
  <div class="architecture-card"><span>03 / Tools</span><h3>工具注册与风险治理</h3><p>工具按风险等级、幂等性、审批策略、沙箱边界和审计字段进行注册。</p></div>
  <div class="architecture-card"><span>04 / Evidence</span><h3>RAG / 数据 / 引用证据</h3><p>检索结果保留来源、时间、权限和置信度，输出必须能回溯到证据。</p></div>
  <div class="architecture-card"><span>05 / Guardrails</span><h3>上线门禁与人工接管</h3><p>高风险动作进入审批，失败自动降级，异常会话进入人工接管队列。</p></div>
  <div class="architecture-card"><span>06 / Observe</span><h3>Trace、评测与复盘</h3><p>记录 Token、耗时、工具失败、召回质量和用户反馈，形成回归样本。</p></div>
</div>

<div class="project-status-card">
  <div><p class="project-eyebrow">Project B Status</p><h2>下一阶段重点：把 Multi-Agent Copilot 做成可演示系统</h2><p>优先补齐“可运行 Demo、工具调用链路、Trace 页面、人工审批、失败回放和评测报告”。项目页不只展示最终成果，也展示迭代路线和工程判断。</p></div>
  <ul><li><a href="/projects/project-b-agent-copilot">项目 B 入口</a></li><li><a href="/projects/project-b-roadmap">项目 B 路线图</a></li><li><a href="/note/Engineering/agent-observability-dashboard-design">可观测性 Dashboard 设计</a></li><li><a href="/note/Engineering/agent-guardrails-pipeline">Guardrails Pipeline</a></li></ul>
</div>

## 项目 A：设备售后诊断与工单 RAG 系统

面向设备售后场景，构建智能诊断与工单管理系统。
核心能力：
- RAG 知识库：基于向量数据库的设备故障知识检索
- 故障诊断：结合 RAG 的智能问答与故障分析
- 工单生成：将诊断结果自动转化为可追踪工单
- 后端工程化：FastAPI + 数据库 + Docker 部署

[查看项目 A 详情](/projects/project-a-rag-workorder)

## 项目 B：运营中台多 Agent Copilot

项目 B 用来展示多 Agent 产品从 Demo 到生产化的关键能力：

- Agent 分工设计
- LangGraph 状态机编排
- 工具调用链路
- Human-in-the-loop 审批机制
- Trace / Evaluation 机制
- Guardrails 与安全上线门禁

[查看项目 B 入口](/projects/project-b-agent-copilot)

## 项目 B 路线图

项目 B 将按照版本迭代方式推进，当前规划了 v0.1 到 v1.0 共 6 个阶段。

[查看项目 B 路线图](/projects/project-b-roadmap)
