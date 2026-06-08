# Project E Demo 验收脚本：展示 AI Coding Agent 工程闭环

> 目标：用 8 分钟演示一个代码代理如何从任务到 PR，而不是只展示“模型写了几行代码”。

## Demo 节奏

| 时间 | 演示 | 证明点 |
|---|---|---|
| 0:00 - 1:00 | 输入 issue / 需求 | Task Intake |
| 1:00 - 2:00 | 生成 Context Pack | Context Engineering |
| 2:00 - 3:30 | Agent 执行改动 | Patch / diff |
| 3:30 - 5:00 | 运行验证命令 | Build / test evidence |
| 5:00 - 6:30 | Code Review Bench | Review finding quality |
| 6:30 - 7:30 | 生成 PR 描述 | 协作材料 |
| 7:30 - 8:00 | 失败回放和 Skill 沉淀 | 持续改进 |

## 演示任务

> 修复博客导航里新增项目后没有同步首页统计的问题，并保证 VitePress 构建通过。

期望：

- Agent 定位首页组件和项目索引。
- 修改统计数字和相关入口。
- 运行 `git diff --check`。
- 运行 `npm run docs:build`。
- 确认生成目录 ignored。
- 生成 PR body，包括验证证据。

## 验收清单

- [ ] task brief 包含目标、约束、验收命令。
- [ ] context pack 不加载无关大文件。
- [ ] diff 不越界。
- [ ] 构建和格式检查有真实输出。
- [ ] review bench 至少检查 scope、test、security、docs。
- [ ] PR 描述包含风险和回滚方案。

## 面试收尾

> 这个 Demo 展示的是 AI Coding Agent 的工程闭环：任务理解、上下文选择、代码修改、验证、审查、PR 和经验沉淀。核心不是让模型写代码，而是让它在团队工程流程里可控地交付。
