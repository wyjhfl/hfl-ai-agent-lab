<script setup lang="ts">
const projectTracks = [
  {
    code: 'A',
    name: '设备售后诊断与工单 RAG 系统',
    label: 'Agentic RAG Diagnosis',
    desc: '把设备手册、故障案例、工单规则和引用证据串成诊断闭环，重点展示检索质量、可追溯回答和工单升级。',
    href: '/projects/project-a-rag-workorder',
    repo: 'https://github.com/wyjhfl/project-a-rag-platform',
    tone: 'cyan',
    tags: ['RAG Pipeline', 'Citations', 'Trace', 'E2E'],
    proofs: ['架构设计', 'Quality / Eval', 'Demo 脚本'],
  },
  {
    code: 'B',
    name: '运营中台多 Agent Copilot',
    label: 'Multi-Agent Runtime',
    desc: '用 Coordinator、ToolGateway、PolicyEngine、HITL 和 Trajectory 展示多 Agent 编排、工具治理与审计能力。',
    href: '/projects/project-b-agent-copilot',
    repo: 'https://github.com/wyjhfl/project-b-multi-agent',
    tone: 'violet',
    tags: ['Coordinator', 'Tool Gateway', 'HITL', 'Trajectory'],
    proofs: ['Operator Console', 'Trace / Eval', 'Roadmap'],
  },
]

const entryCards = [
  {
    eyebrow: '01 / Recruiter Route',
    title: '15 分钟看懂作品集',
    desc: '先看 A/B 两个真实仓库，再看架构、评测、Demo 和面试表达。',
    href: '/projects',
    cta: '进入项目证据链',
  },
  {
    eyebrow: '02 / Learning Route',
    title: '按工程路线补能力',
    desc: '从 RAG、Tool Calling、Multi-Agent 到 Evaluation、Production Gate。',
    href: '/learning-paths',
    cta: '进入学习路线',
  },
  {
    eyebrow: '03 / Builder Route',
    title: '搭一个可上线 Agent',
    desc: '按 PRD、数据、工具治理、评测、发布门禁组织工程实践。',
    href: '/topics/agent-builder-hub',
    cta: '进入 Builder Hub',
  },
]

const designSignals = [
  'Open Code：页面直接给可验证入口',
  'Enterprise：项目卡片先讲业务闭环',
  'Accessible：短路径、清晰层级、弱动效',
]
</script>

<template>
  <div class="home-lab-shell">
    <section class="lab-hero-panel lab-hero-organized">
      <div class="lab-hero-copy">
        <p class="lab-eyebrow">AI Agent Engineering Lab</p>
        <h2 class="lab-hero-title">
          <span>用两个真实仓库</span>
          <span>证明 AI Agent 工程能力</span>
        </h2>
        <p class="lab-hero-desc">
          站点现在聚焦 Project A「设备售后诊断与工单 RAG 系统」和 Project B「运营中台多 Agent Copilot」。首页不再堆概念，而是把业务问题、技术闭环、评测证据和面试表达放在同一条阅读路径里。
        </p>
        <div class="lab-hero-badges" aria-label="作品集定位">
          <span>Agentic RAG</span>
          <span>Multi-Agent Runtime</span>
          <span>Trace / Eval</span>
        </div>
        <div class="lab-action-row">
          <a class="lab-primary-link" href="/projects">查看项目作品</a>
          <a class="lab-secondary-link" href="/content-map">内容地图</a>
          <a class="lab-ghost-link" href="/note/Interview/">面试表达</a>
        </div>
      </div>

      <div class="lab-command-panel" aria-label="AI Agent 项目控制台示意">
        <div class="router-topbar">
          <span></span><span></span><span></span>
          <strong>portfolio.console</strong>
        </div>
        <div class="lab-status-strip">
          <b>Scope</b>
          <strong>2 Projects</strong>
          <em>ready for review</em>
        </div>
        <div class="command-tabs">
          <span class="active">Evidence</span>
          <span>Architecture</span>
          <span>Demo</span>
        </div>
        <div class="command-project-list">
          <a v-for="project in projectTracks" :key="project.code" class="command-project" :class="project.tone" :href="project.href">
            <b>{{ project.code }}</b>
            <span>
              <strong>{{ project.name }}</strong>
              <em>{{ project.tags.join(' / ') }}</em>
            </span>
          </a>
        </div>
        <div class="command-proof-grid">
          <div><strong>RAG</strong><span>引用、追踪、评测</span></div>
          <div><strong>Agent</strong><span>编排、治理、人审</span></div>
          <div><strong>Story</strong><span>Demo、简历、深挖</span></div>
        </div>
      </div>
    </section>

    <section class="lab-metrics" aria-label="站点内容概览">
      <div>
        <strong>2</strong>
        <span>真实仓库主线</span>
      </div>
      <div>
        <strong>A</strong>
        <span>设备诊断 RAG</span>
      </div>
      <div>
        <strong>B</strong>
        <span>运营中台 Copilot</span>
      </div>
      <div>
        <strong>1</strong>
        <span>统一证据链</span>
      </div>
    </section>

    <section class="lab-research-strip" aria-label="UI 调研落地原则">
      <p class="lab-eyebrow">UI Research Applied</p>
      <div>
        <span v-for="signal in designSignals" :key="signal">{{ signal }}</span>
      </div>
    </section>

    <section class="lab-section lab-audience-section">
      <div class="lab-section-heading">
        <p class="lab-eyebrow">Start Here</p>
        <h2>三条入口，减少选择成本</h2>
        <p class="lab-section-desc">热门 UI 项目的共同点是组件化、证据清晰、路径短。这里把首页入口压缩成项目、学习、构建三条主路线。</p>
      </div>
      <div class="home-entry-grid home-entry-grid-compact">
        <a v-for="item in entryCards" :key="item.href" class="home-entry-card" :href="item.href">
          <span>{{ item.eyebrow }}</span>
          <h3>{{ item.title }}</h3>
          <p>{{ item.desc }}</p>
          <strong>{{ item.cta }} →</strong>
        </a>
      </div>
    </section>

    <section class="lab-section">
      <div class="lab-section-heading">
        <p class="lab-eyebrow">Project Tracks</p>
        <h2>两个项目就是首页主视觉</h2>
        <p class="lab-section-desc">每张卡片都按“业务问题 → 工程能力 → 可验证证据”组织，避免只展示技术名词。</p>
      </div>
      <div class="project-showcase-grid">
        <article v-for="project in projectTracks" :key="project.code" class="project-showcase-card" :class="project.tone">
          <div class="project-showcase-head">
            <b>{{ project.code }}</b>
            <span>{{ project.label }}</span>
          </div>
          <h3>{{ project.name }}</h3>
          <p>{{ project.desc }}</p>
          <div class="project-tag-row">
            <em v-for="tag in project.tags" :key="tag">{{ tag }}</em>
          </div>
          <div class="project-proof-list">
            <span v-for="proof in project.proofs" :key="proof">{{ proof }}</span>
          </div>
          <div class="project-card-actions">
            <a :href="project.href">阅读主入口</a>
            <a :href="project.repo">GitHub Repo</a>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>
