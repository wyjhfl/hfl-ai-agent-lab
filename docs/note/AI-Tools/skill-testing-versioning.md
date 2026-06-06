# Skill 测试与版本管理：可复用能力也要可回归

## 这篇文章解决什么问题

很多人写 Skill 只关注能不能触发，却忽略了版本、测试和回归。结果是：Skill 越写越长、触发条件越来越模糊、旧流程被新规则破坏、不同项目之间互相污染。

Skill 的本质是 Agent 的可复用操作手册。既然是可复用能力，就应该像代码一样有版本、测试、变更记录和验收标准。

## Skill 为什么需要测试

| 风险 | 表现 |
|---|---|
| 触发不准 | 不该用 Skill 时误触发，该用时没触发 |
| 流程遗漏 | 忘记检查文件、测试、构建或提交状态 |
| 规则冲突 | Skill 与仓库规则、用户指令、项目文档冲突 |
| 输出漂移 | 同一任务每次输出结构不同 |
| 过度泛化 | 一个 Skill 想覆盖太多任务，导致不可靠 |
| 安全风险 | Skill 引导 Agent 执行高风险动作却缺少确认 |

测试 Skill 不是测试模型聪不聪明，而是测试这份操作手册是否能稳定约束 Agent 行为。

## Skill 测试分层

| 层级 | 测什么 | 示例 |
|---|---|---|
| Trigger Test | 是否正确触发 | 用户说“补博客内容并推送”时触发博客 Skill |
| Procedure Test | 步骤是否完整 | 是否先检查状态、再编辑、再构建、再提交 |
| Output Test | 输出是否符合格式 | 是否有摘要、文件列表、验证命令、commit id |
| Safety Test | 是否避免危险动作 | 是否不删除未确认文件、不提交生成目录 |
| Regression Test | 旧场景是否仍通过 | 新版本 Skill 不破坏历史任务 |

## Skill 版本号怎么设计

建议使用简单语义版本：

```text
major.minor.patch
```

| 版本变化 | 含义 |
|---|---|
| patch | 修正文案、补充小检查，不改变流程 |
| minor | 增加新场景、新输出字段、新验证步骤 |
| major | 改变触发条件、核心流程或安全策略 |

版本号不一定要复杂，但要让团队知道：这个 Skill 变更是否会影响已有工作流。

## Skill Changelog

每次改 Skill 至少记录：

- 变更日期。
- 变更原因。
- 影响场景。
- 新增或删除的步骤。
- 需要重跑的测试样例。
- 是否有破坏性变更。

示例：

```text
v0.3.0
- 增加 docs:build 必跑要求。
- 增加禁止提交 dist 和 blog-index 的检查。
- 影响：博客内容批次 Skill。
- 回归：create_topic、update_index、commit_push 三个样例。
```

## 测试样例库

Skill 需要维护一组典型任务样例：

| 样例 | 用户请求 | 期望行为 |
|---|---|---|
| happy path | “新增一批 Agent 文章并推送” | 检查状态、写内容、更新索引、构建、提交、推送 |
| no commit | “先别提交，只改文件” | 不执行 git commit / push |
| dirty repo | 仓库已有未提交改动 | 先报告或只改允许范围 |
| generated files | 构建产生 dist | 确认 ignored，不 stage |
| risky command | 需要删除文件 | 必须解释并请求确认 |

这些样例可以是 Markdown 表格，也可以是 JSON/YAML。关键是能复用。

## Skill 与脚本的边界

Skill 适合写流程和判断，脚本适合做确定性检查。

| 放在 Skill | 放在脚本 |
|---|---|
| 什么时候触发 | 文件格式检查 |
| 操作顺序 | 链接扫描 |
| 验收标准 | 构建命令封装 |
| 风险提醒 | 生成报告 |
| 输出模板 | 批量格式化 |

如果某个检查必须稳定执行，就不要只写在 Skill 文本里，应该沉淀成脚本或 CI。

## 常见反模式

### 反模式一：Skill 写成百科

Skill 不是教材。它应该保留执行任务时容易忘、必须遵守、可验证的规则。

### 反模式二：没有版本记录

没有 changelog，后续很难知道某次行为变化是模型问题还是 Skill 变更导致。

### 反模式三：把安全规则只写在 Skill

Skill 可以提醒风险，但真正的权限、审批和沙箱应该由系统层控制。

### 反模式四：一个 Skill 覆盖所有事

博客写作、代码修改、简历整理、MCP 创建最好拆成不同 Skill，避免触发和流程混乱。

## 面试表达

> 我不会把 Skill 当成一次性 Prompt 模板，而会把它当成可版本化、可测试、可回归的 Agent 工作流资产。一个成熟 Skill 要有清晰触发条件、步骤、验收标准、风险边界和 changelog。测试上我会覆盖 trigger、procedure、output、safety 和 regression 五类样例；确定性检查沉淀到脚本或 CI，Skill 只负责流程和判断。这样 Skill 才能长期复用，而不是越写越乱。

## 检查清单

- [ ] Skill 是否有明确 description 和适用边界？
- [ ] 是否有版本号和 changelog？
- [ ] 是否有 trigger / procedure / output / safety 测试样例？
- [ ] 是否把确定性检查沉淀成脚本？
- [ ] 是否说明哪些动作需要人工确认？
- [ ] 是否避免和项目级规则冲突？

## 相关链接

- [Skills 编写](/note/AI-Tools/skill-authoring)
- [AI Coding Workflow](/note/AI-Tools/ai-coding-workflow)
- [Code Agent 工程化](/topics/code-agent-engineering)
- [Agent Harness Hook 机制](/topics/agent-harness-hooks)
