<template>
  <div class="home-lab-shell">
    <section class="lab-hero-panel">
      <div class="lab-hero-copy">
        <p class="lab-eyebrow">AI Agent Engineering Lab</p>
        <h2 class="lab-hero-title">
          <span>构建 AI Agent</span>
          <span>工程知识体系</span>
        </h2>
        <p class="lab-hero-desc">
          从学习路线、源码拆解到项目实战，沉淀 RAG、工具调用、编排、评测与部署经验，让知识真正变成可复盘、可展示、可迁移的工程能力。
        </p>
        <div class="lab-action-row">
          <a class="lab-primary-link" href="/projects">查看项目作品</a>
          <a class="lab-secondary-link" href="/note/AI-Agent/">进入学习路线</a>
        </div>
      </div>

      <div class="agent-console" aria-label="Agent 工程能力面板">
        <div class="console-topbar">
          <span></span>
          <span></span>
          <span></span>
          <strong>agent-runtime.trace</strong>
        </div>
        <div class="console-grid">
          <div class="console-card active">
            <small>Input</small>
            <strong>User Task</strong>
            <span>需求理解 / 约束识别</span>
          </div>
          <div class="console-card">
            <small>Retrieve</small>
            <strong>RAG</strong>
            <span>知识检索 / 引用生成</span>
          </div>
          <div class="console-card">
            <small>Act</small>
            <strong>Tools</strong>
            <span>函数调用 / 权限边界</span>
          </div>
          <div class="console-card">
            <small>Memory</small>
            <strong>Context</strong>
            <span>状态管理 / 历史沉淀</span>
          </div>
          <div class="console-card">
            <small>Verify</small>
            <strong>Eval</strong>
            <span>质量评测 / Trace 复盘</span>
          </div>
          <div class="console-card success">
            <small>Ship</small>
            <strong>Deploy</strong>
            <span>上线检查 / 可观测性</span>
          </div>
        </div>
      </div>
    </section>

    <section class="lab-metrics" aria-label="站点内容概览">
      <div>
        <strong>12</strong>
        <span>学习阶段</span>
      </div>
      <div>
        <strong>50+</strong>
        <span>公开文章</span>
      </div>
      <div>
        <strong>5</strong>
        <span>面试方向</span>
      </div>
      <div>
        <strong>2</strong>
        <span>项目主线</span>
      </div>
    </section>

    <section class="lab-section lab-audience-section">
      <div class="lab-section-heading">
        <p class="lab-eyebrow">Start Here</p>
        <h2>按你的目标选择入口</h2>
        <p class="lab-section-desc">不是把所有内容堆给读者，而是让不同角色直接进入最有价值的路径。</p>
      </div>
      <div class="lab-audience-grid">
        <a class="lab-audience-card" href="/projects">
          <span>For Interviewers</span>
          <h3>我是面试官 / 招聘方</h3>
          <p>优先看项目实战、源码拆解和项目面试表达，快速判断工程能力与表达深度。</p>
          <strong>查看项目作品 →</strong>
        </a>
        <a class="lab-audience-card" href="/note/AI-Agent/">
          <span>For Learners</span>
          <h3>我是学习者</h3>
          <p>从 AI Agent 学习路线开始，按 RAG、Tool Calling、Runtime、Harness、Evaluation 逐步推进。</p>
          <strong>进入学习路线 →</strong>
        </a>
        <a class="lab-audience-card" href="/note/Engineering/">
          <span>For Builders</span>
          <h3>我是同行开发者</h3>
          <p>直接看工程化笔记、MCP、Trace、Eval、Hook 机制和源码拆解，关注可落地方案。</p>
          <strong>阅读工程笔记 →</strong>
        </a>
      </div>
    </section>

    <section class="lab-section">
      <div class="lab-section-heading">
        <p class="lab-eyebrow">Capability Map</p>
        <h2>围绕 Agent 工程能力组织内容</h2>
      </div>
      <div class="lab-card-grid">
        <a class="lab-card lab-card-wide" href="/note/AI-Agent/">
          <span>01 / Learning Path</span>
          <h3>系统学习 AI Agent</h3>
          <p>从 Agent 基础、Prompt、RAG、Tool Calling 到 Multi-Agent、Evaluation、Production，形成工程学习地图。</p>
        </a>
        <a class="lab-card" href="/note/Engineering/">
          <span>02 / Engineering</span>
          <h3>工程化笔记</h3>
          <p>FastAPI、Docker、Trace、MCP、异步任务、API 安全和上线检查清单。</p>
        </a>
        <a class="lab-card" href="/note/Source-Reading/">
          <span>03 / Source Reading</span>
          <h3>源码拆解</h3>
          <p>拆解 Hermes、OpenClaw 和 Agent Harness，提炼复杂系统分层。</p>
        </a>
        <a class="lab-card" href="/note/AI-Interview/">
          <span>04 / Interview</span>
          <h3>面试题库</h3>
          <p>把 Agent、RAG、工具调用和 LangGraph 整理成可表达的题解框架。</p>
        </a>
        <a class="lab-card lab-card-accent" href="/topics/rag-to-agent-harness">
          <span>Featured Topic</span>
          <h3>从 RAG 到生产级 Agent Harness</h3>
          <p>串起检索、工具、记忆、编排、评测、可观测性和部署。</p>
        </a>
      </div>
    </section>
  </div>
</template>
