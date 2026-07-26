<script setup lang="ts">
const metrics = [
  ['185', 'Backend Tests'],
  ['35', 'E2E Tests'],
  ['265', '站内页面'],
  ['116', '工程化笔记'],
  ['v1.0.5', 'Release'],
  ['2', 'Real Repos'],
]

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

const evidenceCards = [
  {
    tag: 'Trace',
    desc: 'Project A 架构页：检索、引用、trace_id 与工单升级如何串成一条可追踪链路。',
    href: '/projects/project-a-architecture',
  },
  {
    tag: 'Eval',
    desc: 'Project A 评测方案：质量门禁、指标定义与失败路径的验收标准。',
    href: '/projects/project-a-eval-plan',
  },
  {
    tag: 'Demo',
    desc: 'Project B 演示脚本：从计划、执行、审批到轨迹回放的完整演示路径。',
    href: '/projects/project-b-demo-script',
  },
  {
    tag: 'Repo',
    desc: 'GitHub 主页：2 个真实仓库，代码、测试与 Release 记录都可直接查看。',
    href: 'https://github.com/wyjhfl',
  },
]

const readingPaths = [
  {
    tag: '招聘方 · 10 分钟',
    title: '看项目证据链',
    desc: '从两个项目页进入架构、评测、Demo 与验收记录，快速判断工程深度。',
    href: '/projects',
  },
  {
    tag: '学习者 · 按路线',
    title: '从基础到生产',
    desc: '沿学习路线阅读 116 篇工程化笔记，从 RAG 基础走到多 Agent 生产实践。',
    href: '/learning-paths',
  },
  {
    tag: '求职者 · 面试准备',
    title: '题库与项目表达',
    desc: '面试题库、深挖问答与项目表达讲法，按主题整理，可直接套用。',
    href: '/note/Interview/',
  },
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
          HFL · AI Agent 工程师作品集
        </p>
        <h1>
          把 AI Agent 做成可验证的工程系统
          <em>两个真实项目，全链路可查。</em>
        </h1>
        <p class="hfl24-hero-desc">
          设备售后诊断 Agentic RAG 平台 × 运营中台 Multi-Agent Runtime。每条回答有引用和 trace_id，每次工具调用过网关和审批，每个版本过质量门禁——不是聊天套壳，是可演示、可评测、可运维的工程系统。
        </p>
        <div class="hfl24-action-row">
          <a class="hfl24-primary" href="/projects">查看两个项目</a>
          <a class="hfl24-secondary" href="/about">关于我</a>
          <a class="hfl24-ghost" href="/note/Interview/">面试表达</a>
        </div>
        <div class="hfl24-proof-strip">
          <span>185 Backend Tests</span>
          <span>35 E2E Tests</span>
          <span>v1.0.5 Release</span>
          <span>265 篇工程内容</span>
        </div>
      </div>

      <div class="hfl24-command-center">
        <div class="hfl24-window-bar">
          <i></i><i></i><i></i>
          <strong>agent-portfolio.command</strong>
        </div>

        <div class="hfl24-command-grid">
          <div class="hfl24-command-main">
            <div class="hfl24-metric-grid">
              <div v-for="metric in metrics" :key="metric[1]" class="hfl24-metric-cell">
                <strong>{{ metric[0] }}</strong>
                <span>{{ metric[1] }}</span>
              </div>
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
        <h2>证据可以点开验证，而不只是名词。</h2>
        <p>
          页面按招聘方阅读路径组织：第一眼看定位，第二屏看项目，第三屏看证据。下面四张卡都能直接点开，分别对应架构 Trace、评测方案、Demo 脚本和真实仓库。
        </p>
      </div>
      <div class="hfl24-evidence-grid">
        <a v-for="card in evidenceCards" :key="card.tag" :href="card.href">
          <strong>{{ card.tag }}</strong>
          <span>{{ card.desc }}</span>
        </a>
      </div>
    </section>

    <section class="hfl24-path-grid" aria-label="三条阅读路径">
      <a v-for="path in readingPaths" :key="path.tag" class="hfl24-path-card" :href="path.href">
        <span class="hfl24-path-tag">{{ path.tag }}</span>
        <strong class="hfl24-path-title">{{ path.title }}</strong>
        <em class="hfl24-path-desc">{{ path.desc }}</em>
        <b class="hfl24-path-arrow" aria-hidden="true">→</b>
      </a>
    </section>

    <section class="hfl24-latest" aria-label="最近更新">
      <div class="hfl24-latest-head">
        <h2>最近更新</h2>
        <a href="/articles">全部文章 →</a>
      </div>
      <LatestArticles :limit="6" />
    </section>
  </div>
</template>

<style>
/* command center: real metric grid */
.hfl24-metric-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.hfl24-metric-cell {
  padding: 14px 12px;
  border: 1px solid rgba(148, 163, 184, 0.14);
  border-radius: 16px;
  background: rgba(2, 6, 23, 0.42);
}

.hfl24-metric-cell strong {
  display: block;
  color: #f8fafc;
  font-size: 26px;
  letter-spacing: -0.05em;
}

.hfl24-metric-cell span {
  display: block;
  margin-top: 4px;
  color: rgba(226, 232, 240, 0.6);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

/* evidence cards are now clickable links */
.hfl24-evidence-grid a {
  display: block;
  min-height: 138px;
  padding: 18px;
  border: 1px solid rgba(148, 163, 184, 0.16);
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.48);
  text-decoration: none;
  transition: transform 0.18s ease, border-color 0.18s ease;
}

.dark .hfl24-evidence-grid a {
  background: rgba(2, 6, 23, 0.34);
}

.hfl24-evidence-grid a:hover {
  transform: translateY(-2px);
  border-color: rgba(99, 102, 241, 0.4);
  text-decoration: none;
}

@media (max-width: 520px) {
  .hfl24-metric-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
