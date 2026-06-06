# Browser Automation Testing：给网页 Agent 和前端流程做验收

## 这篇文章解决什么问题

很多 AI Agent 项目有前端页面，但只测后端接口，不测真实用户流程。尤其是：

- RAG 问答页面。
- Agent 任务面板。
- 工具审批弹窗。
- 文件上传入库。
- 数据分析图表。
- Human Takeover 运营台。

Browser Automation Testing 的目标是用自动化浏览器验证“用户真的能完成关键流程”。

## 适合测什么

| 流程 | 验证点 |
|---|---|
| 登录 | 权限和 session |
| 文件上传 | 上传、状态、错误提示 |
| RAG 问答 | 输入问题、显示答案、引用可见 |
| Agent 任务 | 状态推进、Trace 展示 |
| 工具审批 | 参数展示、确认/拒绝 |
| 数据分析 | SQL 结果、图表渲染 |
| 反馈 | 点赞/点踩/文本反馈 |
| 运营台 | 接管队列、详情、处理动作 |

## 测试分层

| 层级 | 工具 | 目的 |
|---|---|---|
| unit | vitest/jest | 组件逻辑 |
| api smoke | pytest/httpx | 接口行为 |
| e2e browser | Playwright | 用户流程 |
| visual check | screenshot | 布局和关键元素 |
| synthetic monitor | 定时线上 smoke | 生产可用性 |

Browser 测试不替代单元测试，但能覆盖真实体验。

## Playwright 测试结构

```text
tests/e2e/
  auth.spec.ts
  rag-chat.spec.ts
  upload-ingestion.spec.ts
  tool-approval.spec.ts
  operations-console.spec.ts
```

每个测试要有：

- 准备数据。
- 打开页面。
- 执行用户动作。
- 等待状态变化。
- 断言关键元素。
- 必要时截图。

## AI Agent 页面怎么断言

AI 输出不稳定，不能断言完整文本。可以断言：

- 是否出现 answer container。
- 是否有 citation。
- 是否有 run_id。
- 是否有 task status。
- 是否有 tool call card。
- 是否有 approval button。
- 是否有 feedback button。
- 是否无 console error。

对于内容质量，用后端 eval，不要在浏览器测试里硬断言长文本。

## 测试数据

建议准备固定测试数据：

- 小型 PDF。
- 固定知识库文档。
- mock LLM provider。
- mock tool server。
- 测试用户和角色。
- 可重复清理的数据库。

不要让浏览器测试依赖真实模型随机输出。

## 常见坑

### 1. 用 sleep 等待

应该等待元素或 API 状态，而不是固定 sleep。

### 2. 断言完整 AI 文本

AI 文本可能变。断言结构、引用和状态更稳定。

### 3. 不保存失败截图

失败时应保存 screenshot、trace、console log。

### 4. 只测 happy path

还要测上传失败、无权限、审批拒绝、工具失败。

## 面试表达模板

> 我会为 AI Agent 前端做 Browser Automation Testing，验证用户真实流程，而不是只测 API。比如 RAG 页面要测上传文档、入库状态、提问、答案卡片、引用和反馈；工具调用要测审批弹窗、参数展示、确认和拒绝；运营台要测接管队列和详情。由于模型输出不稳定，浏览器测试不会断言完整回答文本，而是断言结构化 UI 元素、run_id、citation、task status、tool call card 和无 console error。内容质量放在后端 eval 测试里验证。

## 项目落地清单

- [ ] 关键用户流程有 e2e 测试。
- [ ] 使用 mock LLM / mock tool 保证稳定。
- [ ] 不用固定 sleep。
- [ ] AI 文本断言结构而非全文。
- [ ] 失败保存 screenshot 和 trace。
- [ ] 覆盖权限和失败场景。
- [ ] e2e 结果纳入发布检查。

## 相关链接

- [Agent UI 产品化设计](/topics/agent-ui-product-design)
- [Agent 生产运维 Runbook](/note/Engineering/agent-production-ops-runbook)
- [AI 编程审查清单](/topics/ai-coding-review-checklist)
- [Code Agent 工程化](/topics/code-agent-engineering)
- [Evaluation Pipeline](/note/Engineering/eval-pipeline)
