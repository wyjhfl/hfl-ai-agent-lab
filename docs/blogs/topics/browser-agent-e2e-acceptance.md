# Browser Agent E2E Acceptance：浏览器 Agent 端到端验收清单

## 这篇文章解决什么问题

浏览器 Agent 或带前端的 Agent 项目，不能只测接口和模型输出。用户真正体验的是页面：上传文件是否成功、任务状态是否更新、工具审批是否出现、证据面板是否可打开、失败是否能重试。

Browser Agent E2E Acceptance 的目标是把这些真实流程变成端到端验收脚本。

## 为什么要做浏览器验收

| 只测后端的问题 | 浏览器验收能发现 |
|---|---|
| API 返回成功 | 前端没有刷新状态 |
| RAG 有引用 | 引用链接打不开 |
| 工具需要审批 | 审批卡没有展示参数 |
| 任务失败 | 用户看不到重试按钮 |
| Trace 已记录 | 页面没有入口 |
| 上传接口正常 | 文件选择、进度条、错误提示有问题 |

## 核心验收路径

| 路径 | 验收点 |
|---|---|
| 新建任务 | 输入、上传、提交、run_id 生成 |
| RAG 问答 | 答案、引用、证据面板、无答案策略 |
| 工具调用 | 工具卡片、参数摘要、状态变化 |
| 高风险审批 | 审批卡、args_hash、批准/拒绝结果 |
| 长任务 | queued、running、completed 状态轮转 |
| 失败恢复 | 错误码、retry、human takeover |
| 反馈闭环 | 点赞、点踩、纠错、关联 run_id |
| Trace 查看 | step、tool、latency、error 展示 |

## Playwright 测试结构

```txt
e2e/
  fixtures/
    sample-policy.pdf
    mock-rag-results.json
  tests/
    task-submit.spec.ts
    rag-evidence.spec.ts
    tool-approval.spec.ts
    failure-retry.spec.ts
    trace-view.spec.ts
  helpers/
    login.ts
    mock-llm.ts
    wait-run-state.ts
```

## Mock 策略

端到端测试不一定每次都调用真实模型。推荐分三层：

| 层级 | 用途 |
|---|---|
| Mock LLM | 固定 tool_call 和回答，验证 UI 流程 |
| Mock Tools | 模拟成功、超时、权限拒绝 |
| Live Smoke | 少量真实模型和真实工具，验证集成 |

这样既能稳定回归，也能保留真实链路信心。

## 断言示例

| 页面元素 | 断言 |
|---|---|
| Task Timeline | 出现 queued → running → completed |
| Approval Card | 显示 tool_name、risk_level、args_hash |
| Evidence Panel | 至少 1 个 citation 可点击 |
| Error Card | 显示 error_code 和 retry 按钮 |
| Trace Page | run_id 一致，包含 tool call |
| Feedback | 点踩后生成 feedback_id |

## 截图证据

作品集项目建议保存关键截图：

- 首屏任务输入。
- 工具审批卡。
- 证据面板。
- 失败重试卡。
- Trace timeline。

这些截图可以放到项目 README 或博客项目页，作为“我真的做过”的证据。

## CI 门禁

| 门禁 | 说明 |
|---|---|
| e2e:smoke | 每次 PR 跑核心路径 |
| e2e:approval | 高风险工具审批不允许跳过 |
| e2e:trace | 每个 run 都能打开 Trace |
| e2e:a11y | 关键按钮和卡片有可访问名称 |
| e2e:mobile | 移动端证据面板和审批卡可用 |

## 面试表达

可以这样讲：

> 我不会只说接口测试通过，而是用浏览器端到端验收 Agent 的真实用户流程。测试会覆盖任务提交、RAG 引用、工具审批、长任务状态、失败重试、反馈和 Trace 查看。模型和工具可以用 mock 保证回归稳定，同时保留少量 live smoke 验证真实链路。

## 落地检查清单

- [ ] 是否覆盖任务提交主路径？
- [ ] 是否验证证据面板和 citation？
- [ ] 是否验证工具审批和拒绝？
- [ ] 是否验证失败重试和人工接管？
- [ ] 是否保存关键截图作为作品集证据？
- [ ] 是否在 CI 跑 smoke e2e？