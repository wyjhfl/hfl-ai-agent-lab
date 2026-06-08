# Project E Code Review Bench：让代码代理改动可审查

> 目标：不要只让 Agent 写代码，还要让 Agent / Reviewer 能发现错误、需求遗漏、安全风险和验证缺口。

## Review Bench 解决什么问题

AI Coding Agent 常见风险：

- 只改表面，没修根因。
- 没跑测试却声称完成。
- 改动范围过大。
- 引入安全问题或删除关键逻辑。
- PR 描述缺少验证证据。
- Review 只给泛泛建议，没有具体行级问题。

Review Bench 用来评估和改进“代码代理 + 代码审查代理”的质量。

## 审查维度

| 维度 | 问题 | 证据 |
|---|---|---|
| Correctness | 是否满足需求，是否有边界 bug | tests、diff、trace |
| Scope Control | 是否改动越界 | changed files、task brief |
| Verification | 是否运行正确命令 | command output、exit code |
| Security | 是否泄漏 secret、扩大权限、引入注入 | static scan、manual review |
| Maintainability | 是否可读、可维护、符合项目风格 | review comments |
| Documentation | PR 是否说明原因、风险、验证和回滚 | PR body |

## Review Finding 数据结构

```ts
interface ReviewFinding {
  file: string
  line?: number
  severity: 'blocker' | 'major' | 'minor' | 'nit'
  category: 'bug' | 'security' | 'test' | 'scope' | 'maintainability' | 'docs'
  title: string
  evidence: string
  suggestedFix?: string
}
```

## Benchmark Case

| Case | 目标 | 期望发现 |
|---|---|---|
| REVIEW-001 | 修复登录 bug，但漏掉空 token | 边界条件 bug |
| REVIEW-002 | 新增 API，却没鉴权 | security / auth |
| REVIEW-003 | 改 UI，未更新移动端样式 | responsive |
| REVIEW-004 | 文档改动，导航未更新 | docs / navigation |
| REVIEW-005 | 测试失败，但 PR 声称通过 | verification mismatch |
| REVIEW-006 | 修一个文件却改了无关模块 | scope creep |

## 质量指标

- finding precision：指出的问题有多少是真的。
- finding recall：预设 bug 有多少被发现。
- actionable rate：建议是否可执行。
- false alarm rate：误报比例。
- blocker miss rate：严重问题漏报。
- review latency：审查耗时。

## 面试表达

> 我会给代码代理增加 Review Bench，不只看它能不能生成代码，还要评估它能不能发现 bug、安全风险、测试缺口和改动越界。这样才能让 AI Coding Agent 进入团队级开发流程。
