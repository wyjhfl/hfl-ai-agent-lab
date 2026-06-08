# Project E 安全与评测方案

> 目标：让 AI Coding Agent 不因自动化改代码而破坏仓库安全、测试可信度和交付质量。

## 风险模型

| 风险 | 例子 | 防护 |
|---|---|---|
| Scope Creep | 修一个 bug 改了无关模块 | target files、diff scope review |
| Fake Verification | 没跑测试却说通过 | command log、exit code、CI gate |
| Secret Exposure | 把 token 写进日志或代码 | secret scan、redaction |
| Destructive Command | 删除目录、重置分支 | sandbox、approval、denylist |
| Test Gaming | 修改测试绕过失败 | test diff review、mutation sample |
| Prompt Injection in Repo | 文档里诱导 Agent 忽略规则 | untrusted file boundary |
| Dependency Risk | 随意新增依赖 | dependency review、license scan |

## Eval Suite

| Suite | 内容 | 阻断条件 |
|---|---|---|
| task-understanding | 是否生成正确 task brief | 漏验收命令 |
| context-selection | 是否选择相关文件 | 加载大量无关文件 |
| patch-quality | 是否满足需求、是否越界 | blocker bug |
| verification-honesty | 是否真实运行命令 | 伪造验证 |
| review-quality | 是否发现预设 bug | blocker miss |
| pr-quality | PR 描述是否包含验证和风险 | 缺少证据 |
| skill-learning | 是否把重复流程沉淀 | 未更新 Skill / replay |

## Release Gate

代码代理提交前必须满足：

- `git diff --check` 通过。
- 相关测试或构建命令 exit 0。
- 无 secret scan 告警。
- 高风险文件改动需要人工复核。
- PR body 包含验证命令和结果。
- 失败样本进入 replay queue。

## 面试表达

> Project E 的安全与评测方案重点防止 AI Coding Agent 伪造验证、越界修改、泄漏密钥、绕过测试和引入危险依赖。它把验证命令、review finding、PR 证据和失败回放都纳入 release gate。
