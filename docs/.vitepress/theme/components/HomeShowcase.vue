<script setup lang="ts">
const quickStarts = [
  {
    eyebrow: 'For Portfolio',
    title: '给招聘方看的作品集入口',
    desc: '把项目、架构、评测、Demo 脚本和面试讲法放在第一屏，快速证明不是只会写关键词。',
    href: '/projects',
    cta: '查看项目作品',
  },
  {
    eyebrow: 'For Learners',
    title: '给学习者的 Agent 路线',
    desc: '从 Prompt、RAG、Tool Calling 到 Multi-Agent、Evaluation、Production，按工程能力逐层推进。',
    href: '/note/AI-Agent/',
    cta: '进入学习路线',
  },
  {
    eyebrow: 'For Builders',
    title: '给开发者的工程化手册',
    desc: '聚焦 Trace、MCP、Context Pack、工具权限、上线门禁和失败回放，沉淀能落地的系统设计。',
    href: '/note/Engineering/',
    cta: '阅读工程笔记',
  },
]

const capabilityCards = [
  {
    tag: 'RAG SYSTEM',
    title: '企业级知识库链路',
    desc: 'Metadata、ACL、Citation、Freshness、Query Router 与检索故障排查。',
    href: '/topics/rag-engineering-system',
  },
  {
    tag: 'AGENT RUNTIME',
    title: '从状态机到运行轨迹',
    desc: 'Agent Runtime、Workflow、Decision Record、Run Replay 与 SLO。',
    href: '/topics/agent-runtime-explained',
  },
  {
    tag: 'TOOLS / MCP',
    title: '工具治理与 MCP 边界',
    desc: 'Tool Registry、Risk Level、Idempotency、Sandbox、Token Exchange。',
    href: '/note/Engineering/tool-registry-engineering',
  },
  {
    tag: 'EVALUATION',
    title: '评测驱动迭代闭环',
    desc: 'Scorecard、Drift、Failure Clustering、Regression Set 和 Release Gate。',
    href: '/note/Engineering/eval-failure-clustering',
  },
]

const timeline = [
  ['01', '学习路线', '先补 Agent / RAG / Tool Calling 的基础概念和常见架构。'],
  ['02', '工程笔记', '再看后端、数据、权限、Trace、Eval、MCP 和部署细节。'],
  ['03', '专题长文', '把零散能力串成可讲述的系统设计和项目方案。'],
  ['04', '项目表达', '最后沉淀简历 bullet、Demo 脚本、STAR 故事和面试追问。'],
]

const featuredEvidence = [
  {
    tag: 'INTERVIEW READY',
    title: 'AI Agent 安全面试指南',
    desc: '把 OWASP LLM Top 10、权限边界、工具调用风控和上线门禁整理成可讲的面试答案。',
    href: '/topics/ai-agent-security-interview-guide',
  },
  {
    tag: 'UI / UX',
    title: '个人站 UI 优化路线',
    desc: '基于 VitePress 默认主题扩展，规划首页、专题页、项目页和证据卡片的信息架构。',
    href: '/topics/ai-agent-site-ui-optimization-playbook',
  },
  {
    tag: 'PRODUCT UI',
    title: 'Agent UI Pattern Library',
    desc: '沉淀 Chat、Trace、审批、引用、工具调用和人工接管的可复用界面模式。',
    href: '/topics/agent-ui-pattern-library',
  },
  {
    tag: 'PORTFOLIO',
    title: 'AI Agent 求职证据地图',
    desc: '把简历关键词映射到项目代码、架构图、评测记录、Demo 脚本和复盘材料。',
    href: '/topics/ai-agent-job-search-evidence-map',
  },
  {
    tag: 'OBSERVABILITY',
    title: 'Agent 可观测性 Dashboard',
    desc: '从 Trace、Span、Token、工具耗时、失败聚类到 Release Gate 的展示设计。',
    href: '/note/Engineering/agent-observability-dashboard-design',
  },
  {
    tag: 'GENAI OPS',
    title: 'OpenTelemetry GenAI 可观测性',
    desc: '把模型调用、RAG、工具执行和 Agent 决策纳入统一追踪与指标体系。',
    href: '/note/Engineering/opentelemetry-genai-observability',
  },
  {
    tag: 'GUARDRAILS',
    title: 'Agent Guardrails Pipeline',
    desc: '用输入校验、权限审批、输出检查、审计回放构成生产级防护链路。',
    href: '/note/Engineering/agent-guardrails-pipeline',
  },
  {
    tag: 'PROJECTS',
    title: '项目实战作品集',
    desc: '集中展示 RAG、Multi-Agent Copilot、路线图、Demo 验收和项目答辩材料。',
    href: '/projects',
  },
]

const evidenceLinks = [
  ['能力证据地图', '/topics/ai-agent-job-search-evidence-map'],
  ['作品集路线', '/topics/ai-agent-portfolio-roadmap'],
  ['Demo 验收脚本', '/topics/ai-agent-demo-acceptance-script'],
  ['Offer Review', '/topics/ai-agent-offer-portfolio-review'],
  ['UI 优化路线', '/topics/ai-agent-site-ui-optimization-playbook'],
]
</script>

<template>
  <div class="home-lab-shell">
    <section class="lab-hero-panel">
      <div class="lab-hero-copy">
        <p class="lab-eyebrow">AI Agent Engineering Lab</p>
        <h2 class="lab-hero-title">
          <span>把 AI Agent 学成</span>
          <span>可展示的工程作品集</span>
        </h2>
        <p class="lab-hero-desc">
          面向 AI Agent / RAG / Multi-Agent / MCP / Evaluation 的个人知识库与求职作品集：既有学习路线，也有架构拆解、工程清单、评测闭环和面试表达。
        </p>
        <div class="lab-action-row">
          <a class="lab-primary-link" href="/projects">查看项目作品</a>
          <a class="lab-secondary-link" href="/topics/">浏览专题地图</a>
          <a class="lab-ghost-link" href="/topics/ai-agent-job-search-evidence-map">能力证据地图</a>
        </div>
      </div>

      <div class="agent-console" aria-label="Agent 工程能力面板">
        <div class="console-topbar">
          <span></span>
          <span></span>
          <span></span>
          <strong>agent-runtime.trace</strong>
        </div>
        <div class="console-pipeline">
          <div class="pipeline-row active">
            <small>01 / Understand</small>
            <strong>Task Brief + Constraints</strong>
            <span>任务目标、权限边界、输出契约</span>
          </div>
          <div class="pipeline-row">
            <small>02 / Retrieve</small>
            <strong>RAG Evidence Pack</strong>
            <span>Metadata、ACL、Citation、Freshness</span>
          </div>
          <div class="pipeline-row">
            <small>03 / Act</small>
            <strong>Tool + MCP Governance</strong>
            <span>风险分级、审批、幂等、沙箱</span>
          </div>
          <div class="pipeline-row success">
            <small>04 / Verify</small>
            <strong>Eval + Release Gate</strong>
            <span>评分卡、失败聚类、回归样本</span>
          </div>
        </div>
      </div>
    </section>

    <section class="lab-metrics" aria-label="站点内容概览">
      <div>
        <strong>237</strong>
        <span>Markdown 内容页</span>
      </div>
      <div>
        <strong>114</strong>
        <span>工程化笔记</span>
      </div>
      <div>
        <strong>67</strong>
        <span>专题长文</span>
      </div>
      <div>
        <strong>8</strong>
        <span>能力证据域</span>
      </div>
    </section>

    <section class="lab-section lab-audience-section">
      <div class="lab-section-heading">
        <p class="lab-eyebrow">Start Here</p>
        <h2>按你的目标选择入口</h2>
        <p class="lab-section-desc">首页不再只展示栏目，而是把“学习、落地、求职证明”三类路径拆开，让读者一眼知道下一步看什么。</p>
      </div>
      <div class="lab-audience-grid">
        <a v-for="item in quickStarts" :key="item.href" class="lab-audience-card" :href="item.href">
          <span>{{ item.eyebrow }}</span>
          <h3>{{ item.title }}</h3>
          <p>{{ item.desc }}</p>
          <strong>{{ item.cta }} →</strong>
        </a>
      </div>
    </section>


    <section class="lab-section lab-featured-section">
      <div class="lab-section-heading">
        <p class="lab-eyebrow">Featured Evidence</p>
        <h2>先给招聘方和读者看的 8 个强证据入口</h2>
        <p class="lab-section-desc">首页优先呈现能证明工程能力的内容：安全、可观测性、Guardrails、UI 设计、项目路线和面试表达，减少读者在导航里寻找重点的成本。</p>
      </div>
      <div class="featured-evidence-grid">
        <a v-for="item in featuredEvidence" :key="item.href" class="featured-evidence-card" :href="item.href">
          <span>{{ item.tag }}</span>
          <h3>{{ item.title }}</h3>
          <p>{{ item.desc }}</p>
          <strong>查看证据 →</strong>
        </a>
      </div>
    </section>

    <section class="lab-section lab-roadmap-section">
      <div class="lab-section-heading">
        <p class="lab-eyebrow">Reading Flow</p>
        <h2>从学习路线到面试表达的 4 步路径</h2>
      </div>
      <div class="lab-timeline">
        <div v-for="item in timeline" :key="item[0]" class="timeline-item">
          <div class="timeline-index">{{ item[0] }}</div>
          <div>
            <h3>{{ item[1] }}</h3>
            <p>{{ item[2] }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="lab-section">
      <div class="lab-section-heading">
        <p class="lab-eyebrow">Capability Map</p>
        <h2>围绕 Agent 工程能力组织内容</h2>
      </div>
      <div class="lab-card-grid">
        <a v-for="card in capabilityCards" :key="card.href" class="lab-card" :href="card.href">
          <span>{{ card.tag }}</span>
          <h3>{{ card.title }}</h3>
          <p>{{ card.desc }}</p>
        </a>
        <div class="lab-card lab-card-accent lab-card-wide">
          <span>JOB SEARCH EVIDENCE</span>
          <h3>把每个技术关键词变成可验证证据</h3>
          <p>作品集页面要能对应项目、代码、架构图、评测结果、失败复盘和面试故事，而不是只列“熟悉 RAG / Agent / MCP”。</p>
          <div class="evidence-link-list">
            <a v-for="link in evidenceLinks" :key="link[1]" :href="link[1]">{{ link[0] }}</a>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
