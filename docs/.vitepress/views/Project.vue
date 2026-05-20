<template>
  <section class="projects-page">
    <header class="projects-hero">
      <p class="eyebrow">Projects</p>
      <h1>项目实战</h1>
      <p>这里集中展示我的 AI Agent / LLM 应用工程项目。</p>
    </header>

    <div class="projects-grid">
      <article class="project-card">
        <div class="project-card__meta">
          <span class="tag">主力项目</span>
          <span class="tag">RAG</span>
        </div>
        <h2>项目 A：设备售后诊断与工单 RAG 系统</h2>
        <p class="project-card__description">面向设备售后场景，构建设备故障知识库、智能问答、故障诊断和工单生成流程。</p>
      </article>

      <article class="project-card">
        <div class="project-card__meta">
          <span class="tag">求职主力</span>
          <span class="tag">Multi-Agent</span>
        </div>
        <h2>项目 B：运营中台多 Agent Copilot</h2>
        <p class="project-card__description">面向运营中台场景，将运营人员的自然语言需求转化为可控、可审计、可确认的业务执行流程。</p>
      </article>
    </div>
  </section>
</template>

<script lang="ts" setup>
</script>

<style scoped>
.projects-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

.projects-hero {
  text-align: center;
  margin-bottom: 3rem;
}

.eyebrow {
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--vp-c-brand-1);
  font-weight: 600;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.project-card {
  padding: 2rem;
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  transition: all 0.3s ease;
}

.project-card:hover {
  transform: translateY(-4px);
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

.project-card__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.tag {
  padding: 0.25rem 0.75rem;
  background: var(--vp-c-brand-soft);
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--vp-c-brand-1);
}

.project-card h2 {
  font-size: 1.25rem;
  margin-bottom: 0.75rem;
  color: var(--vp-c-text-1);
}

.project-card__description {
  color: var(--vp-c-text-2);
  line-height: 1.7;
}
</style>
