# Project E Repo Automation Console UI

> 目标：把代码代理工作台做成可展示界面，让任务、上下文、测试、评审和 PR 证据一眼可见。

## Console Mockup

<div class="repo-agent-shell">
  <div class="repo-agent-header">
    <div><p class="mock-eyebrow">AI Coding Agent Workbench</p><h2>Fix VitePress navigation regression</h2></div>
    <span class="repo-status">Ready for PR</span>
  </div>
  <div class="repo-agent-grid">
    <section>
      <p class="mock-eyebrow">Task Brief</p>
      <h3>目标：新增 Project E 后同步导航和构建验证</h3>
      <ul><li>限制：不提交生成目录</li><li>验收：docs:build exit 0</li><li>风险：中，涉及导航和页面链接</li></ul>
    </section>
    <section>
      <p class="mock-eyebrow">Context Pack</p>
      <div class="repo-chip">docs/.vitepress/config.mts</div>
      <div class="repo-chip">docs/blogs/projects.md</div>
      <div class="repo-chip">docs/.vitepress/theme/custom.css</div>
      <div class="repo-chip">npm run docs:build</div>
    </section>
    <section>
      <p class="mock-eyebrow">Verification Gate</p>
      <div class="repo-check ok">git diff --check · pass</div>
      <div class="repo-check ok">npm run docs:build · pass</div>
      <div class="repo-check ok">generated dirs ignored · pass</div>
    </section>
    <section>
      <p class="mock-eyebrow">Review Findings</p>
      <div class="repo-check warn">[minor] 首页统计需要同步</div>
      <div class="repo-check ok">[pass] 侧边栏链接已接入</div>
      <div class="repo-check ok">[pass] PR body includes verification</div>
    </section>
  </div>
</div>

## UI 模块

| 模块 | 用途 | 工程价值 |
|---|---|---|
| Task Brief | 展示目标、约束、验收、风险 | 防止任务误解 |
| Context Pack | 展示 Agent 读取了哪些文件和命令 | 上下文透明 |
| Execution Trace | 展示修改、命令、失败、重试 | 可回放 |
| Verification Gate | 展示构建、测试、lint、e2e | 证据优先 |
| Review Findings | 展示审查发现和严重级别 | 质量控制 |
| PR Composer | 展示变更摘要、验证、风险和回滚 | 团队协作 |

## 面试表达

> Repo Automation Console 的价值是把 AI Coding Agent 的黑盒执行变成可审计流程：任务是什么、读了哪些上下文、改了哪些文件、跑了哪些验证、Review 发现了什么、PR 能不能合并，都在一个界面里展示。
