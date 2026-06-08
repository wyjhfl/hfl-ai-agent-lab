# Project F Document Review Console UI

> 这页展示 Project F 的产品化界面：不是上传文档后等一个黑盒结果，而是让用户看到解析策略、页级质量、字段引用、PII 风险、人工复核和入库门禁。

## UI 目标

Document Review Console 需要同时服务三类人：

1. **业务复核员**：快速确认字段是否正确，低置信项是否需要修改。
2. **知识库运营者**：判断文档能否进入 RAG 知识库，是否需要重解析。
3. **工程/安全负责人**：查看 PII、权限、审计、解析器版本和失败原因。

## 产品界面草图

<div class="doc-intel-shell">
  <div class="doc-intel-header">
    <div>
      <p class="mock-eyebrow">Project F / Document Intelligence</p>
      <h2>Contract Review Queue</h2>
      <span>contract-2026-001.pdf · 18 pages · mixed parser strategy</span>
    </div>
    <strong class="doc-gate-warn">Gate: Review Required</strong>
  </div>
  <div class="doc-intel-grid">
    <section class="doc-page-panel">
      <div class="doc-page-toolbar">
        <strong>Page 02</strong>
        <span>VLM + OCR · confidence 0.88</span>
      </div>
      <div class="doc-page-canvas">
        <div class="doc-bbox title">合同生效条款</div>
        <div class="doc-bbox paragraph">本合同自 2026 年 6 月 1 日起生效，有效期三年。</div>
        <div class="doc-bbox pii">乙方联系人：138****8899</div>
        <div class="doc-bbox table">付款节点 / 金额 / 验收条件</div>
      </div>
    </section>
    <section class="doc-field-panel">
      <h3>Structured Fields</h3>
      <div class="doc-field ok">
        <b>effective_date</b>
        <span>2026-06-01 · citation page 2 / bbox matched</span>
      </div>
      <div class="doc-field warn">
        <b>total_amount</b>
        <span>¥ 1,280,000 · low confidence, requires reviewer</span>
      </div>
      <div class="doc-field danger">
        <b>contact_phone</b>
        <span>PII detected · masked before ingestion</span>
      </div>
      <div class="doc-field ok">
        <b>risk_flags</b>
        <span>auto_renewal, uncapped_liability</span>
      </div>
    </section>
    <section class="doc-quality-panel">
      <h3>Ingestion Gate</h3>
      <div class="doc-metric"><strong>92%</strong><span>citation coverage</span></div>
      <div class="doc-metric"><strong>7</strong><span>low confidence fields</span></div>
      <div class="doc-metric"><strong>3</strong><span>PII findings</span></div>
      <div class="doc-gate-list">
        <span class="ok">Schema validation passed</span>
        <span class="warn">Review amount field</span>
        <span class="danger">PII policy approval required</span>
      </div>
    </section>
  </div>
</div>

## 信息架构

| 区域 | 展示内容 | 设计原因 |
|---|---|---|
| Upload Queue | 文件状态、页数、解析策略、失败原因 | 让批量处理可运营 |
| Page Viewer | 原文页、bbox、高亮、元素类型 | 保证抽取结果可回到证据 |
| Field Panel | 字段、值、置信度、schema、引用 | 支持快速人工复核 |
| PII Panel | 敏感类型、脱敏策略、权限级别 | 安全负责人能审计 |
| Ingestion Gate | blocking issue、引用覆盖、chunk 质量 | 防止脏数据入库 |
| Trace Drawer | parser 版本、模型、prompt、重试、耗时 | 方便故障回放 |

## 关键交互

### 1. 字段点击反向定位

用户点击 `effective_date` 字段时，Page Viewer 高亮对应 bbox，并显示原文片段。这样能避免“模型说对了但不知道从哪里来”的问题。

### 2. 低置信字段进入复核队列

低置信字段用黄色状态，不阻塞用户浏览，但阻塞入库。复核员需要选择：

- 接受原值。
- 修改字段值。
- 标记为无法识别。
- 要求重新解析该页。

### 3. PII 先脱敏再入库

PII 字段用红色状态，默认只显示 mask 后结果。只有有权限的人能看原文，并且每次查看都写入 audit log。

### 4. Gate 解释“为什么不能入库”

Ingestion Gate 不只显示 failed，而是列出阻断原因：

- `pii_policy_unapproved`
- `citation_coverage_below_threshold`
- `schema_validation_failed`
- `table_structure_missing`
- `acl_tag_missing`

## UI 参考与落地策略

本项目继续沿用当前站点策略：不整体替换 VitePress 主题，而是在默认主题之上增加项目级 mockup 组件和 CSS。

可借鉴的开源/官方 UI 思路：

- [VitePress 默认主题扩展](https://vitepress.dev/guide/extending-default-theme)：适合保留文档体验，同时插入自定义作品集组件。
- [assistant-ui](https://www.assistant-ui.com/docs)：可借鉴消息、引用、工具调用和人工操作区的组织方式。
- [Vercel AI Elements](https://ai-sdk.dev/elements)：可借鉴 source/citation、prompt input、tool display 等 AI 原生组件。
- [CopilotKit](https://docs.copilotkit.ai/)：可借鉴 agent UI、generative UI、human-in-the-loop 交互。
- [LangGraph Studio](https://docs.langchain.com/langgraph-platform/langgraph-studio)：可借鉴 agent 运行轨迹、状态、trace 和调试体验。

## 面试讲法

> 这个 UI 的重点不是好看，而是把文档智能里最难验证的东西显性化：原文页、高亮 bbox、结构化字段、置信度、PII 风险、人工修改和入库门禁。这样业务人员能复核，工程人员能回放，安全人员能审计。
