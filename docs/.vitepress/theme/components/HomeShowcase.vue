<script setup lang="ts">
const entryCards = [
  {
    eyebrow: '看作品',
    title: '项目实战作品集',
    desc: '直接看 A-F 六个项目：RAG、多 Agent、MCP、评测、Coding Agent、多模态文档智能。',
    href: '/projects',
    cta: '进入项目总览',
  },
  {
    eyebrow: '补体系',
    title: 'AI Agent 学习路线',
    desc: '按 Prompt、RAG、Tool Calling、Multi-Agent、Evaluation、Production 分阶段学习。',
    href: '/learning-paths',
    cta: '进入学习看板',
  },
  {
    eyebrow: '查工程',
    title: '工程化手册',
    desc: '集中查 Trace、MCP、权限、评测、成本、发布、安全和运维等落地问题。',
    href: '/note/Engineering/',
    cta: '阅读工程笔记',
  },
  {
    eyebrow: '准备面试',
    title: '面试与求职证据',
    desc: '把项目讲法、简历 bullet、STAR 故事、技术追问和作品集证据串起来。',
    href: '/note/Interview/',
    cta: '准备项目表达',
  },
]

const contentAtlas = [
  {
    title: '项目作品线',
    desc: '用于给招聘方快速证明：能把 AI Agent 做成完整产品与工程系统。',
    links: [
      ['Project F 多模态文档智能', '/projects/project-f-multimodal-document-agent'],
      ['Project E AI Coding Agent', '/projects/project-e-ai-coding-agent-workbench'],
      ['Project D Agent Evaluation Lab', '/projects/project-d-agent-evaluation-redteam-lab'],
      ['Project C MCP Gateway', '/projects/project-c-mcp-gateway-skill-hub'],
      ['Project B Multi-Agent Copilot', '/projects/project-b-agent-copilot'],
    ],
  },
  {
    title: '工程能力线',
    desc: '用于系统补齐后端、数据、RAG、工具治理、可观测性和上线门禁。',
    links: [
      ['RAG 工程体系', '/topics/rag-engineering-system'],
      ['Agent Runtime', '/topics/agent-runtime-explained'],
      ['Tool Registry', '/note/Engineering/tool-registry-engineering'],
      ['Agent Observability', '/note/Engineering/agent-observability-dashboard-design'],
      ['Agent Release Gate', '/note/Engineering/agent-release-gate'],
    ],
  },
  {
    title: '安全治理线',
    desc: '用于回答企业落地最关心的权限、隐私、审计、红队和风险控制。',
    links: [
      ['AI Agent 安全面试指南', '/topics/ai-agent-security-interview-guide'],
      ['OWASP LLM Top 10 Mapping', '/note/Engineering/owasp-llm-top10-agent-mapping'],
      ['Agent Guardrails Pipeline', '/note/Engineering/agent-guardrails-pipeline'],
      ['PII 脱敏策略', '/note/Engineering/pii-redaction-for-llm'],
      ['MCP Sandbox Profile', '/note/Engineering/mcp-sandbox-profile'],
    ],
  },
  {
    title: '求职表达线',
    desc: '用于把技术内容变成简历、作品集、Demo、项目答辩和面试故事。',
    links: [
      ['能力证据地图', '/topics/ai-agent-job-search-evidence-map'],
      ['作品集路线', '/topics/ai-agent-portfolio-roadmap'],
      ['Demo 验收脚本', '/topics/ai-agent-demo-acceptance-script'],
      ['Interview Story Bank', '/topics/ai-agent-interview-story-bank'],
      ['Offer Portfolio Review', '/topics/ai-agent-offer-portfolio-review'],
    ],
  },
]

const projectLadder = [
  ['F', 'Document Intelligence', '多模态解析 / RAG 入库 / PII 治理', '/projects/project-f-multimodal-document-agent'],
  ['E', 'AI Coding Agent', '代码代理 / 测试门禁 / PR 协作', '/projects/project-e-ai-coding-agent-workbench'],
  ['D', 'Evaluation Lab', '评测集 / 红队 / Release Gate', '/projects/project-d-agent-evaluation-redteam-lab'],
  ['C', 'MCP Gateway', '工具注册 / Skill Hub / 安全审批', '/projects/project-c-mcp-gateway-skill-hub'],
  ['B', 'Multi-Agent Copilot', '多 Agent 编排 / Trace / Human Approval', '/projects/project-b-agent-copilot'],
  ['A', 'RAG Workorder', '知识库 / 工单诊断 / 引用回答', '/projects/project-a-rag-workorder'],
]

const capabilityCards = [
  {
    tag: 'RAG / KNOWLEDGE',
    title: '知识进入系统前先治理',
    desc: 'Metadata、ACL、Citation、Freshness、Ingestion Gate、PII 与检索评测。',
    href: '/note/Engineering/rag-ingestion-quality-gate',
  },
  {
    tag: 'AGENT RUNTIME',
    title: '把 Agent 执行过程显式化',
    desc: '状态机、Run Replay、Decision Record、Trace Span、错误分类和恢复策略。',
    href: '/topics/agent-runtime-explained',
  },
  {
    tag: 'TOOLS / MCP',
    title: '工具不是函数调用，而是治理边界',
    desc: 'Tool Registry、MCP Gateway、schema pinning、sandbox、approval 和 audit。',
    href: '/note/Engineering/mcp-gateway-architecture',
  },
  {
    tag: 'EVALUATION',
    title: '用评测驱动 Agent 迭代',
    desc: 'Scorecard、Regression Set、Failure Clustering、Drift、Canary 和 Release Gate。',
    href: '/note/Engineering/llm-evaluation-scorecard',
  },
]
</script>

<template>
  <div class="home-lab-shell">
    <section class="lab-hero-panel lab-hero-organized">
      <div class="lab-hero-copy">
        <p class="lab-eyebrow">AI Agent Engineering Lab</p>
        <h2 class="lab-hero-title">
          <span>不再堆文章，</span>
          <span>按目标进入内容</span>
        </h2>
        <p class="lab-hero-desc">
          这个站点现在按“学习 → 工程 → 项目 → 面试”组织。内容不会删除，但入口会分层：先给你 4 条主路径，再进入项目、工程、安全和求职证据地图。
        </p>
        <div class="lab-action-row">
          <a class="lab-primary-link" href="/content-map">查看内容地图</a>
          <a class="lab-secondary-link" href="/projects">项目作品集</a>
          <a class="lab-ghost-link" href="/note/Interview/">面试表达</a>
        </div>
      </div>

      <div class="content-router-panel" aria-label="内容路由器">
        <div class="router-topbar">
          <span></span><span></span><span></span>
          <strong>content-router.map</strong>
        </div>
        <div class="router-stack">
          <a v-for="item in entryCards" :key="item.href" class="router-row" :href="item.href">
            <small>{{ item.eyebrow }}</small>
            <strong>{{ item.title }}</strong>
            <span>{{ item.cta }} →</span>
          </a>
        </div>
      </div>
    </section>

    <section class="lab-metrics" aria-label="站点内容概览">
      <div>
        <strong>283</strong>
        <span>Markdown 内容页</span>
      </div>
      <div>
        <strong>6</strong>
        <span>项目作品主线</span>
      </div>
      <div>
        <strong>4</strong>
        <span>内容阅读路径</span>
      </div>
      <div>
        <strong>9</strong>
        <span>能力证据域</span>
      </div>
    </section>

    <section class="lab-section lab-audience-section">
      <div class="lab-section-heading">
        <p class="lab-eyebrow">Start Here</p>
        <h2>先选你的当前目标</h2>
        <p class="lab-section-desc">内容多了以后，不再让读者从导航里猜。先按目标分流，再进入具体专题或项目。</p>
      </div>
      <div class="home-entry-grid">
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
        <p class="lab-eyebrow">Content Atlas</p>
        <h2>把全站内容分成 4 条线</h2>
        <p class="lab-section-desc">所有旧内容保留，但首页只暴露可决策的分类入口：作品、工程、安全、求职。每条线给 5 个高价值入口，避免信息噪音。</p>
      </div>
      <div class="content-atlas-grid">
        <section v-for="group in contentAtlas" :key="group.title" class="content-atlas-card">
          <h3>{{ group.title }}</h3>
          <p>{{ group.desc }}</p>
          <div class="atlas-link-list">
            <a v-for="link in group.links" :key="link[1]" :href="link[1]">{{ link[0] }}</a>
          </div>
        </section>
      </div>
    </section>

    <section class="lab-section">
      <div class="lab-section-heading">
        <p class="lab-eyebrow">Project Ladder</p>
        <h2>项目按能力递进，而不是散列表</h2>
        <p class="lab-section-desc">A-F 六个项目构成一个作品集梯度：从 RAG 到多 Agent，再到 MCP、评测、代码代理和多模态文档智能。</p>
      </div>
      <div class="project-ladder-grid">
        <a v-for="project in projectLadder" :key="project[0]" class="project-ladder-card" :href="project[3]">
          <b>{{ project[0] }}</b>
          <div>
            <h3>{{ project[1] }}</h3>
            <p>{{ project[2] }}</p>
          </div>
        </a>
      </div>
    </section>

    <section class="lab-section">
      <div class="lab-section-heading">
        <p class="lab-eyebrow">Capability Map</p>
        <h2>核心能力域只保留 4 个总入口</h2>
      </div>
      <div class="lab-card-grid capability-condensed-grid">
        <a v-for="card in capabilityCards" :key="card.href" class="lab-card" :href="card.href">
          <span>{{ card.tag }}</span>
          <h3>{{ card.title }}</h3>
          <p>{{ card.desc }}</p>
        </a>
      </div>
    </section>
  </div>
</template>
