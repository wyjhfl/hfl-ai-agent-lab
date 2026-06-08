<script setup lang="ts">
const entryCards = [
  {
    eyebrow: '给招聘方',
    title: '15 分钟看作品集',
    desc: '先看 A-F 项目总览，再进入每个项目的架构、UI、Eval、Demo 和面试表达证据。',
    href: '/projects',
    cta: '看项目证据',
  },
  {
    eyebrow: '给学习者',
    title: '按路线补能力',
    desc: '从 Prompt、RAG、Tool Calling 到 Multi-Agent、Evaluation、Production，按阶段学习。',
    href: '/learning-paths',
    cta: '进入学习路线',
  },
  {
    eyebrow: '给开发者',
    title: '搭一个可上线 Agent',
    desc: '从 PRD、RAG、MCP、Skill、Eval 到 Release Gate，按工程流程构建系统。',
    href: '/topics/agent-builder-hub',
    cta: '进入 Builder Hub',
  },
  {
    eyebrow: '给求职前',
    title: '整理面试表达',
    desc: '把项目讲法、简历 bullet、STAR 故事、技术追问和 Demo 脚本串成证据链。',
    href: '/note/Interview/',
    cta: '准备面试材料',
  },
]

const hubCards = [
  {
    tag: 'BUILDER',
    title: 'Agent Builder Hub',
    desc: '把 PRD、RAG、MCP、Skill、Eval、Release Gate 和作品集表达串成一条建设路线。',
    href: '/topics/agent-builder-hub',
    links: [
      ['PRD 模板', '/topics/ai-agent-prd-template'],
      ['MCP Server', '/note/Engineering/mcp-server-build-guide'],
      ['Skill 测试', '/note/AI-Tools/skill-testing-versioning'],
    ],
  },
  {
    tag: 'RAG / KNOWLEDGE',
    title: '知识与检索工程',
    desc: '入库质量、metadata、权限过滤、引用评测、freshness 和企业知识生命周期。',
    href: '/topics/rag-engineering-system',
    links: [
      ['RAG Ingestion Gate', '/note/Engineering/rag-ingestion-quality-gate'],
      ['Citation Evaluation', '/note/Engineering/rag-citation-evaluation'],
      ['Permission Filtering', '/note/Engineering/rag-permission-filtering'],
    ],
  },
  {
    tag: 'TOOLS / MCP',
    title: '工具治理与扩展能力',
    desc: 'Tool Registry、MCP Gateway、schema pinning、sandbox、approval、audit 与 Skill Hub。',
    href: '/note/Engineering/mcp-gateway-architecture',
    links: [
      ['Tool Registry', '/note/Engineering/tool-registry-engineering'],
      ['MCP Gateway', '/note/Engineering/mcp-gateway-architecture'],
      ['Skill × MCP', '/note/AI-Tools/skill-mcp-integration'],
    ],
  },
  {
    tag: 'EVAL / OBS',
    title: '评测与可观测性',
    desc: 'Scorecard、regression set、trace replay、失败聚类、drift、canary 和 Release Gate。',
    href: '/note/Engineering/agent-release-gate',
    links: [
      ['LLM Scorecard', '/note/Engineering/llm-evaluation-scorecard'],
      ['Run Replay', '/note/Engineering/agent-run-replay'],
      ['Dashboard', '/note/Engineering/agent-observability-dashboard-design'],
    ],
  },
  {
    tag: 'SECURITY',
    title: '安全治理与上线门禁',
    desc: 'Prompt Injection、PII、RBAC、审计、Secret、Guardrails、红队和生产检查清单。',
    href: '/topics/ai-agent-security-interview-guide',
    links: [
      ['Guardrails Pipeline', '/note/Engineering/agent-guardrails-pipeline'],
      ['OWASP Mapping', '/note/Engineering/owasp-llm-top10-agent-mapping'],
      ['PII 脱敏', '/note/Engineering/pii-redaction-for-llm'],
    ],
  },
  {
    tag: 'CAREER',
    title: '求职作品集证据',
    desc: '把项目、代码、文章、Demo、评测和面试故事映射到岗位关键词。',
    href: '/topics/ai-agent-job-search-evidence-map',
    links: [
      ['作品集路线', '/topics/ai-agent-portfolio-roadmap'],
      ['简历矩阵', '/topics/ai-agent-resume-project-matrix'],
      ['Offer Review', '/topics/ai-agent-offer-portfolio-review'],
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

const readingPaths = [
  {
    label: 'Path 01',
    title: '做一个可演示 Agent',
    desc: '从需求边界开始，补工具、Skill、评测和 Demo 验收，最后沉淀项目文章。',
    href: '/topics/agent-builder-hub',
    steps: ['Builder Hub', 'MCP Template', 'Skill Testing', 'Demo Script'],
  },
  {
    label: 'Path 02',
    title: '优化现有项目作品集',
    desc: '先看 A-F 项目矩阵，再补架构、UI、评测、安全和面试表达缺口。',
    href: '/projects',
    steps: ['Projects', 'Evidence Matrix', 'Interview Notes', 'Portfolio Review'],
  },
  {
    label: 'Path 03',
    title: '准备 AI Agent 面试',
    desc: '用系统设计题、追问地图、项目一分钟介绍和 STAR 故事组织回答。',
    href: '/note/Interview/',
    steps: ['Question Bank', 'Follow-up Map', 'One-minute Pitch', 'STAR Bank'],
  },
]
</script>

<template>
  <div class="home-lab-shell">
    <section class="lab-hero-panel lab-hero-organized">
      <div class="lab-hero-copy">
        <p class="lab-eyebrow">AI Agent Engineering Lab</p>
        <h2 class="lab-hero-title">
          <span>AI Agent 工程作品集</span>
          <span>RAG · MCP · 多 Agent · Eval</span>
        </h2>
        <p class="lab-hero-desc">
          聚焦可落地的大模型应用：RAG 知识库、多 Agent 协作、MCP 工具平台、评测红队、Coding Agent 与多模态文档智能。每个项目都配套架构、控制台 UI、评测指标和 Demo 脚本。
        </p>
        <div class="lab-action-row">
          <a class="lab-primary-link" href="/content-map">查看内容地图</a>
          <a class="lab-secondary-link" href="/topics/agent-builder-hub">Agent Builder Hub</a>
          <a class="lab-ghost-link" href="/projects">项目作品集</a>
        </div>
      </div>

      <div class="content-architecture-panel" aria-label="AI Agent 项目能力展示">
        <div class="router-topbar">
          <span></span><span></span><span></span>
          <strong>agent-lab.console</strong>
        </div>
        <div class="architecture-stack">
          <div><b>Project F 文档智能 Agent</b><span>多模态解析 / RAG 入库 / PII 治理</span></div>
          <div><b>Project C MCP Gateway</b><span>工具注册 / Skill Hub / 审批审计</span></div>
          <div><b>Project D Evaluation Lab</b><span>评测集 / 红队样本 / Release Gate</span></div>
          <div><b>Project E Coding Agent</b><span>Repo Context / 测试门禁 / PR 协作</span></div>
        </div>
      </div>
    </section>

    <section class="lab-metrics" aria-label="站点内容概览">
      <div>
        <strong>280+</strong>
        <span>Markdown 内容页</span>
      </div>
      <div>
        <strong>6</strong>
        <span>项目作品主线</span>
      </div>
      <div>
        <strong>6</strong>
        <span>主题内容枢纽</span>
      </div>
      <div>
        <strong>3</strong>
        <span>推荐阅读路径</span>
      </div>
    </section>

    <section class="lab-section lab-audience-section">
      <div class="lab-section-heading">
        <p class="lab-eyebrow">Start Here</p>
        <h2>核心入口</h2>
        <p class="lab-section-desc">项目作品、学习路线、工程建设和面试材料四个入口，覆盖从学习到求职展示的主要场景。</p>
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
        <p class="lab-eyebrow">Topic Hubs</p>
        <h2>AI Agent 工程能力版图</h2>
        <p class="lab-section-desc">围绕 Builder、RAG、MCP、评测、安全和求职表达六个方向，覆盖大模型应用从开发到上线的关键能力。</p>
      </div>
      <div class="home-hub-grid">
        <a v-for="hub in hubCards" :key="hub.href" class="home-hub-card" :href="hub.href">
          <span>{{ hub.tag }}</span>
          <h3>{{ hub.title }}</h3>
          <p>{{ hub.desc }}</p>
          <div class="hub-mini-links">
            <em v-for="link in hub.links" :key="link[1]">{{ link[0] }}</em>
          </div>
        </a>
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
        <p class="lab-eyebrow">Recommended Paths</p>
        <h2>不知道从哪看，就按这 3 条路线走</h2>
        <p class="lab-section-desc">每条路线都控制在一个明确目标内：做 Demo、优化作品集、准备面试。</p>
      </div>
      <div class="reading-path-grid">
        <a v-for="path in readingPaths" :key="path.href" class="reading-path-card" :href="path.href">
          <span>{{ path.label }}</span>
          <h3>{{ path.title }}</h3>
          <p>{{ path.desc }}</p>
          <div class="reading-step-row">
            <em v-for="step in path.steps" :key="step">{{ step }}</em>
          </div>
        </a>
      </div>
    </section>
  </div>
</template>
