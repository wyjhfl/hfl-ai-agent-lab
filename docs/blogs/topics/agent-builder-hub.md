---
layout: page
sidebar: false
---

<div class="project-hero agent-builder-hero">
  <p class="project-eyebrow">Agent Builder Hub</p>
  <h1>从想法到可上线 Agent 的建设路线</h1>
  <p>这里不是再新增一堆散文，而是把站内已有的 PRD、RAG、MCP Server、Skill、Eval、Release Gate、安全治理和面试表达串成一条可执行路线。适合做项目、准备作品集、写简历和回答系统设计面试。</p>
</div>

<div class="project-read-flow builder-read-flow">
  <div><strong>01</strong><span>先定义任务边界：Agent 做什么、不做什么、失败如何兜底。</span></div>
  <div><strong>02</strong><span>再补上下文与工具：RAG、MCP、Skill、审批和权限。</span></div>
  <div><strong>03</strong><span>最后做上线门禁：Eval、Trace、Release Gate、Runbook 和作品集表达。</span></div>
</div>

<div class="portfolio-section-heading">
  <p class="project-eyebrow">Builder Workflow</p>
  <h2>把 Agent 系统拆成 6 个阶段</h2>
  <p>每个阶段都对应站内已有内容，不删除旧内容，只把入口按工程流程重新组织。</p>
</div>

<div class="builder-stage-grid">
  <section class="builder-stage-card"><span>Stage 1</span><h3>任务边界 / PRD</h3><p>明确用户、输入输出、拒答边界、人工接管和验收标准，避免把 Agent 做成泛聊天。</p><a href="/topics/ai-agent-prd-template">AI Agent PRD 模板 →</a></section>
  <section class="builder-stage-card"><span>Stage 2</span><h3>上下文 / RAG 准备</h3><p>处理 metadata、权限、引用、freshness、入库门禁和检索评测，让 Agent 有可信上下文。</p><a href="/topics/rag-engineering-system">RAG 工程体系 →</a></section>
  <section class="builder-stage-card"><span>Stage 3</span><h3>工具 / MCP 设计</h3><p>把工具边界、schema、sandbox、OAuth、审计和版本治理放在 Agent 可控范围内。</p><a href="/topics/mcp-server-from-zero-to-portfolio">MCP Server 从零到作品集 →</a></section>
  <section class="builder-stage-card"><span>Stage 4</span><h3>Skill 工作流封装</h3><p>把可复用流程写进 Skill：前置条件、脚本、资产、参考资料、测试和版本策略。</p><a href="/topics/agent-skill-playbook">Agent Skill Playbook →</a></section>
  <section class="builder-stage-card"><span>Stage 5</span><h3>评测 / 回归 / 可观测</h3><p>用 scorecard、regression set、trace replay、失败聚类和 dashboard 驱动迭代。</p><a href="/note/Engineering/agent-release-gate">Agent Release Gate →</a></section>
  <section class="builder-stage-card"><span>Stage 6</span><h3>发布 / 安全 / 面试证据</h3><p>沉淀 demo、指标、风险清单、runbook 和项目讲法，把工程过程变成作品集证据。</p><a href="/topics/ai-agent-job-search-evidence-map">能力证据地图 →</a></section>
</div>

<div class="portfolio-section-heading">
  <p class="project-eyebrow">Core Routes</p>
  <h2>按目标选择阅读路线</h2>
</div>

<div class="content-route-grid">
  <section class="content-route-card featured-route">
    <span>Build Demo</span>
    <h3>我要从零做一个 Agent Demo</h3>
    <ol>
      <li><a href="/topics/agent-builder-demo-roadmap">30 天 Agent Builder Demo 路线</a></li>
      <li><a href="/topics/mcp-server-from-zero-to-portfolio">MCP Server 从零到作品集</a></li>
      <li><a href="/topics/agent-skill-playbook">Agent Skill Playbook</a></li>
      <li><a href="/topics/ai-agent-demo-acceptance-script">Demo 验收脚本</a></li>
    </ol>
  </section>
  <section class="content-route-card">
    <span>MCP / Tools</span>
    <h3>我要把工具能力做成可治理平台</h3>
    <ol>
      <li><a href="/topics/mcp-server-from-zero-to-portfolio">MCP Server 从零到作品集</a></li>
      <li><a href="/topics/mcp-skills-agent-extension-strategy">MCP / Skills 选型</a></li>
      <li><a href="/note/Engineering/tool-registry-engineering">Tool Registry 工程化</a></li>
      <li><a href="/projects/project-c-mcp-gateway-skill-hub">Project C 作品入口</a></li>
    </ol>
  </section>
  <section class="content-route-card">
    <span>Eval / Ops</span>
    <h3>我要把 Agent 推向生产可控</h3>
    <ol>
      <li><a href="/topics/agent-eval-observability-playbook">Agent Eval & Observability Playbook</a></li>
      <li><a href="/note/Engineering/agent-observability-dashboard-design">Observability Dashboard</a></li>
      <li><a href="/topics/agent-production-readiness-review">Production Readiness Review</a></li>
      <li><a href="/projects/project-d-agent-evaluation-redteam-lab">Project D 评测红队 Lab</a></li>
    </ol>
  </section>
  <section class="content-route-card">
    <span>Career</span>
    <h3>我要把工程内容转成面试表达</h3>
    <ol>
      <li><a href="/topics/ai-agent-resume-project-matrix">Resume Project Matrix</a></li>
      <li><a href="/topics/ai-agent-interview-followup-map">面试追问地图</a></li>
      <li><a href="/note/Interview/">项目面试表达</a></li>
      <li><a href="/topics/ai-agent-offer-portfolio-review">Offer Portfolio Review</a></li>
    </ol>
  </section>
  <section class="content-route-card">
    <span>UI / Evidence</span>
    <h3>我要把项目页面做得像产品</h3>
    <ol>
      <li><a href="/topics/agent-ui-review-checklist">Agent UI Review Checklist</a></li>
      <li><a href="/topics/agent-demo-evidence-dashboard">Demo Evidence Dashboard</a></li>
      <li><a href="/topics/agent-ui-pattern-library">Agent UI Pattern Library</a></li>
      <li><a href="/topics/ai-agent-portfolio-ui-blueprint">Portfolio UI Blueprint</a></li>
    </ol>
  </section>
</div>

<div class="project-status-card builder-next-card">
  <div>
    <p class="project-eyebrow">Portfolio Evidence</p>
    <h2>推荐下一步：把 Project C / D / E / F 串成一条 Agent 平台故事</h2>
    <p>Project C 负责工具与 Skill 扩展，Project D 负责评测红队，Project E 负责代码代理协作，Project F 负责多模态知识运营。四个项目可以共同证明“我能把 Agent 从 Demo 做到可上线系统”。</p>
  </div>
  <ul>
    <li><a href="/projects/project-c-mcp-gateway-skill-hub">Project C：MCP Gateway 与 Skill Hub</a></li>
    <li><a href="/projects/project-d-agent-evaluation-redteam-lab">Project D：Agent Evaluation Lab</a></li>
    <li><a href="/projects/project-e-ai-coding-agent-workbench">Project E：AI Coding Agent Workbench</a></li>
    <li><a href="/projects/project-f-multimodal-document-agent">Project F：Document Intelligence Agent</a></li>
  </ul>
</div>
