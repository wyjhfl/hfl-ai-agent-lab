<template>
  <div class="home-showcase">
    <section class="showcase-hero-card">
      <div>
        <p class="showcase-eyebrow">AI Agent Engineering Portfolio</p>
        <h2>把零散学习整理成可复用的工程能力</h2>
        <p>
          这个站点不是单纯的笔记堆叠，而是围绕「学习路线 → 工程实践 → 源码拆解 → 面试表达 → 项目作品」组织内容，方便持续复盘和对外展示。
        </p>
      </div>
      <div class="showcase-stats" aria-label="站点内容统计">
        <span><strong>11</strong>学习阶段</span>
        <span><strong>5</strong>面试方向</span>
        <span><strong>2</strong>项目主线</span>
      </div>
    </section>

    <section class="bento-grid" aria-label="推荐阅读路径">
      <a class="bento-card bento-card-large" href="/note/AI-Agent/">
        <span class="bento-kicker">Learning Path</span>
        <h3>系统学习 AI Agent</h3>
        <p>从 Agent 基础出发，逐步进入 RAG、工具调用、状态机、多 Agent、评测和生产工程。</p>
        <em>AI Agent 路线 → 工程笔记 → 专题长文</em>
      </a>

      <a class="bento-card" href="/note/AI-Interview/">
        <span class="bento-kicker">Interview</span>
        <h3>准备大模型应用面试</h3>
        <p>把 Agent、RAG、工具调用、LangGraph 的知识整理成可回答、可追问的题解。</p>
      </a>

      <a class="bento-card" href="/note/Source-Reading/">
        <span class="bento-kicker">Source Reading</span>
        <h3>拆解真实 Agent 项目</h3>
        <p>从 Hermes、OpenClaw 等项目中提炼架构分层、运行时、工具和安全边界。</p>
      </a>

      <a class="bento-card" href="/projects">
        <span class="bento-kicker">Projects</span>
        <h3>沉淀可展示作品</h3>
        <p>围绕 RAG 工单系统和多 Agent Copilot，逐步补齐工程设计、实现路径和复盘材料。</p>
      </a>

      <a class="bento-card bento-card-accent" href="/topics/rag-to-agent-harness">
        <span class="bento-kicker">Featured</span>
        <h3>从 RAG 到生产级 Agent Harness</h3>
        <p>用一篇长文串起检索、工具、记忆、编排、评测、可观测性和部署。</p>
      </a>
    </section>
  </div>
</template>
