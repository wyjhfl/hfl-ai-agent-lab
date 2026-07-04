<script setup lang="ts">
const projectCards = [
  {
    code: 'A',
    title: '设备售后诊断与工单 RAG 系统',
    subtitle: 'Agentic RAG Diagnosis Platform',
    desc: '面向设备售后场景，把故障手册、历史工单、引用证据、诊断 Trace 和工单升级串成一条可验收链路。',
    href: '/projects/project-a-rag-workorder',
    repo: 'https://github.com/wyjhfl/project-a-rag-platform',
    accent: 'cyan',
    stats: ['Citation Trace', 'GraphRAG', 'Quality Gate', 'E2E Demo'],
    flows: ['Query Router', 'Retrieval', 'Diagnosis', 'Ticket'],
  },
  {
    code: 'B',
    title: '运营中台多 Agent Copilot',
    subtitle: 'Multi-Agent Runtime Console',
    desc: '面向运营中台场景，用角色编排、工具治理、人审、审计和轨迹回放证明多 Agent 工程控制力。',
    href: '/projects/project-b-agent-copilot',
    repo: 'https://github.com/wyjhfl/project-b-multi-agent',
    accent: 'violet',
    stats: ['Coordinator', 'ToolGateway', 'HITL', 'Trajectory'],
    flows: ['Plan', 'Act', 'Approve', 'Replay'],
  },
]

const designSignals = [
  {
    tag: 'shadcn/ui',
    title: 'Open Code 组件感',
    desc: '用清晰边框、紧凑信息卡、可点击入口和状态标签，让作品集像可复用产品组件。',
  },
  {
    tag: 'Magic UI',
    title: '首屏光效与动势',
    desc: '使用网格背景、glow、扫描线和浮动状态卡，第一眼就能看到视觉变化。',
  },
  {
    tag: 'Aceternity',
    title: '深色 Hero + Bento',
    desc: '用深色视觉中心和不规则 Bento 网格承载项目、评测、Demo 和面试证据。',
  },
  {
    tag: 'Dashboard UI',
    title: '工程控制台表达',
    desc: '把 RAG、Agent、Trace、Eval 做成控制台，不再只是普通博客卡片。',
  },
]

const evidenceCards = [
  ['Trace', '每条回答能追踪检索、工具调用、人审和最终输出。'],
  ['Eval', '项目页补齐质量门禁、验收脚本和失败路径表达。'],
  ['Demo', 'A/B 两个项目都有可演示路径和面试讲法。'],
  ['Repo', '所有主项目入口都指向真实 GitHub 仓库。'],
]

const timeline = [
  ['01', '读取业务问题', '设备故障 / 运营任务进入 Agent 工作台'],
  ['02', '拆解执行链路', 'RAG 检索或多 Agent 编排生成可追踪步骤'],
  ['03', '质量门禁', '引用、Trace、审批、Eval 和 Demo 验收'],
  ['04', '沉淀表达', '项目页、简历 bullet、深挖问答和 STAR 故事'],
]
</script>

<template>
  <div class="hfl24-shell">
    <section class="hfl24-hero" aria-label="AI Agent portfolio command center">
      <div class="hfl24-hero-copy">
        <p class="hfl24-kicker">
          <span></span>
          GitHub Trending UI Applied · shadcn / Magic UI / Bento Dashboard
        </p>
        <h2>
          两个真实 AI Agent 项目，
          <em>做成一个工程控制台。</em>
        </h2>
        <p class="hfl24-hero-desc">
          这版首页不再沿用普通博客卡片，而是按 GitHub 爆火 UI 的共同模式重做：深色 Command Center、Bento Grid、状态标签、Trace 面板、强对比 CTA 和项目证据卡。
        </p>
        <div class="hfl24-action-row">
          <a class="hfl24-primary" href="/projects">进入 A/B 项目证据链</a>
          <a class="hfl24-secondary" href="/content-map">查看内容地图</a>
          <a class="hfl24-ghost" href="/note/Interview/">面试表达</a>
        </div>
        <div class="hfl24-proof-strip">
          <span>2 Real Repos</span>
          <span>RAG + Multi-Agent</span>
          <span>Trace / Eval / Demo</span>
        </div>
      </div>

      <div class="hfl24-command-center">
        <div class="hfl24-window-bar">
          <i></i><i></i><i></i>
          <strong>agent-portfolio.command</strong>
          <span>LIVE</span>
        </div>

        <div class="hfl24-command-grid">
          <div class="hfl24-command-main">
            <div class="hfl24-command-title">
              <span>RUN STATUS</span>
              <strong>Portfolio Evidence Graph</strong>
            </div>
            <div class="hfl24-signal-bars" aria-hidden="true">
              <b style="height: 48%"></b>
              <b style="height: 72%"></b>
              <b style="height: 56%"></b>
              <b style="height: 88%"></b>
              <b style="height: 64%"></b>
              <b style="height: 92%"></b>
              <b style="height: 74%"></b>
              <b style="height: 58%"></b>
            </div>
          </div>

          <div class="hfl24-kpi-card cyan">
            <span>Project A</span>
            <strong>RAG</strong>
            <em>Diagnosis · Citation · Ticket</em>
          </div>
          <div class="hfl24-kpi-card violet">
            <span>Project B</span>
            <strong>Agent</strong>
            <em>Runtime · Tool · HITL</em>
          </div>

          <div class="hfl24-trace-panel">
            <div v-for="item in timeline" :key="item[0]" class="hfl24-trace-row">
              <b>{{ item[0] }}</b>
              <span>
                <strong>{{ item[1] }}</strong>
                <em>{{ item[2] }}</em>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="hfl24-design-grid" aria-label="GitHub 热门 UI 调研落地">
      <article v-for="signal in designSignals" :key="signal.tag" class="hfl24-design-card">
        <span>{{ signal.tag }}</span>
        <h3>{{ signal.title }}</h3>
        <p>{{ signal.desc }}</p>
      </article>
    </section>

    <section class="hfl24-project-grid" aria-label="Project A and Project B">
      <article v-for="project in projectCards" :key="project.code" class="hfl24-project-card" :class="project.accent">
        <div class="hfl24-project-head">
          <b>{{ project.code }}</b>
          <span>
            <em>{{ project.subtitle }}</em>
            <strong>{{ project.title }}</strong>
          </span>
        </div>
        <p>{{ project.desc }}</p>

        <div class="hfl24-chip-row">
          <i v-for="stat in project.stats" :key="stat">{{ stat }}</i>
        </div>

        <div class="hfl24-flow">
          <span v-for="flow in project.flows" :key="flow">{{ flow }}</span>
        </div>

        <div class="hfl24-project-actions">
          <a :href="project.href">查看项目页</a>
          <a :href="project.repo">GitHub Repo</a>
        </div>
      </article>
    </section>

    <section class="hfl24-evidence-board" aria-label="作品集证据看板">
      <div class="hfl24-board-copy">
        <p class="hfl24-kicker"><span></span>Evidence First</p>
        <h2>不是“博客换皮”，而是把作品集做成可验证系统。</h2>
        <p>
          页面结构按招聘方阅读路径设计：第一眼看定位，第二屏看项目，第三屏看证据。每个入口都能继续跳到架构、评测、Demo 或面试表达。
        </p>
      </div>
      <div class="hfl24-evidence-grid">
        <div v-for="card in evidenceCards" :key="card[0]">
          <strong>{{ card[0] }}</strong>
          <span>{{ card[1] }}</span>
        </div>
      </div>
    </section>
  </div>
</template>
