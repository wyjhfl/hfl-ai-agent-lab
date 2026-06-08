---
layout: page
sidebar: false
---

<div class="project-hero content-map-hero">
  <p class="project-eyebrow">Content Map</p>
  <h1>全站内容地图</h1>
  <p>当文章越来越多时，不要从目录树里盲找。这里按使用场景重新组织：学习路线、工程体系、项目作品、安全治理、面试求职。所有旧内容仍然保留，只是提供更清晰的入口。</p>
</div>

<div class="project-read-flow">
  <div><strong>入口</strong><span>先按目标选择：看作品、补体系、搭 Agent、准备面试。</span></div>
  <div><strong>枢纽</strong><span>再进入 Builder、RAG、MCP、Eval、安全和求职主题。</span></div>
  <div><strong>证据</strong><span>最后沉淀到 A-F 项目、Demo、评测报告和面试讲法。</span></div>
</div>

<div class="portfolio-section-heading">
  <p class="project-eyebrow">Main Paths</p>
  <h2>五个最常用入口</h2>
</div>

<div class="project-map-grid content-map-grid">
  <section class="project-map-card featured-project">
    <span>01 / Portfolio</span>
    <h3>项目作品集</h3>
    <p>A-F 六个项目按能力递进：RAG 工单、多 Agent Copilot、MCP Gateway、Agent Eval、Coding Agent、多模态文档智能。</p>
    <div class="project-link-list"><a href="/projects">项目总览</a><a href="/topics/ai-agent-job-search-evidence-map">能力证据地图</a><a href="/topics/ai-agent-portfolio-roadmap">作品集路线</a></div>
  </section>
  <section class="project-map-card">
    <span>02 / Learning</span>
    <h3>学习路线</h3>
    <p>适合系统补基础：从 Prompt、RAG、Tool Calling 到 Multi-Agent、Evaluation、Production。</p>
    <div class="project-link-list"><a href="/learning-paths">学习看板</a><a href="/note/AI-Agent/">AI Agent 路线</a><a href="/note/AI-Interview/">技术题库</a></div>
  </section>
  <section class="project-map-card">
    <span>03 / Engineering</span>
    <h3>工程化手册</h3>
    <p>适合查落地细节：Trace、MCP、RAG 入库、权限、评测、成本、发布、运维。</p>
    <div class="project-link-list"><a href="/note/Engineering/">工程笔记</a><a href="/topics/">专题文章</a><a href="/note/Source-Reading/">源码拆解</a></div>
  </section>
  <section class="project-map-card">
    <span>04 / Builder</span>
    <h3>Agent Builder Hub</h3>
    <p>适合开始做系统：从 PRD、RAG、MCP、Skill、Eval、Release Gate 到作品集表达。</p>
    <div class="project-link-list"><a href="/topics/agent-builder-hub">建设路线</a><a href="/topics/agent-builder-demo-roadmap">30 天 Demo</a><a href="/topics/mcp-server-from-zero-to-portfolio">MCP 作品集</a><a href="/topics/agent-skill-playbook">Skill Playbook</a></div>
  </section>
  <section class="project-map-card">
    <span>05 / Interview</span>
    <h3>面试与求职表达</h3>
    <p>适合投递前整理：一分钟介绍、深挖问答、STAR 故事、简历 bullet、Demo 脚本。</p>
    <div class="project-link-list"><a href="/note/Interview/">项目面试表达</a><a href="/note/Interview/resume-bullets">简历模板</a><a href="/topics/ai-agent-offer-portfolio-review">Offer Review</a></div>
  </section>
</div>

<div class="portfolio-section-heading">
  <p class="project-eyebrow">Capability Index</p>
  <h2>按能力域查内容</h2>
  <p>如果你知道自己要补哪个能力，可以直接从这里进入。</p>
</div>

<div class="content-atlas-grid content-map-atlas">
  <section class="content-atlas-card"><h3>RAG / Knowledge</h3><p>知识库、引用、权限、入库质量、freshness 与 RAG 评测。</p><div class="atlas-link-list"><a href="/topics/rag-engineering-system">RAG 工程体系</a><a href="/note/Engineering/rag-ingestion-quality-gate">RAG Ingestion Gate</a><a href="/note/Engineering/rag-citation-evaluation">Citation Evaluation</a><a href="/note/Engineering/rag-permission-filtering">Permission Filtering</a></div></section>
  <section class="content-atlas-card"><h3>Agent Runtime</h3><p>状态机、运行轨迹、错误分类、回放、配置和反馈分诊。</p><div class="atlas-link-list"><a href="/topics/agent-runtime-explained">Agent Runtime</a><a href="/note/Engineering/agent-workflow-state-machine">Workflow 状态机</a><a href="/note/Engineering/agent-run-replay">Run Replay</a><a href="/note/Engineering/agent-error-taxonomy">错误分类</a></div></section>
  <section class="content-atlas-card"><h3>MCP / Tools / Skills</h3><p>工具注册、MCP Gateway、沙箱、OAuth、Skill 测试和供应链风险。</p><div class="atlas-link-list"><a href="/topics/agent-builder-hub">Agent Builder Hub</a><a href="/topics/mcp-server-from-zero-to-portfolio">MCP Server 作品集</a><a href="/topics/agent-skill-playbook">Skill Playbook</a><a href="/note/Engineering/tool-registry-engineering">Tool Registry</a></div></section>
  <section class="content-atlas-card"><h3>Eval / Observability</h3><p>评分卡、失败聚类、漂移、Release Gate、OpenTelemetry 和 Dashboard。</p><div class="atlas-link-list"><a href="/note/Engineering/llm-evaluation-scorecard">LLM Scorecard</a><a href="/note/Engineering/eval-failure-clustering">Failure Clustering</a><a href="/note/Engineering/agent-observability-dashboard-design">Observability Dashboard</a><a href="/note/Engineering/agent-release-gate">Release Gate</a></div></section>
  <section class="content-atlas-card"><h3>Security / Governance</h3><p>Prompt Injection、PII、RBAC、审计、Secret、Guardrails 与红队。</p><div class="atlas-link-list"><a href="/topics/ai-agent-security-interview-guide">安全面试指南</a><a href="/note/Engineering/prompt-injection-defense-in-depth">Prompt Injection 防御</a><a href="/note/Engineering/pii-redaction-for-llm">PII 脱敏</a><a href="/note/Engineering/agent-audit-log-design">审计日志</a></div></section>
  <section class="content-atlas-card"><h3>UI / Product</h3><p>Agent 产品 UI、状态机、前端 telemetry、Pattern Library 和作品集 UI。</p><div class="atlas-link-list"><a href="/topics/agent-ui-pattern-library">Agent UI Pattern Library</a><a href="/note/Engineering/agent-ui-state-machine">Agent UI State Machine</a><a href="/note/Engineering/agent-frontend-telemetry">Frontend Telemetry</a><a href="/topics/ai-agent-site-ui-optimization-playbook">站点 UI 优化</a></div></section>
</div>
