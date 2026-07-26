# Claude Code 实战工作流：从需求拆解到可提交修改

## 这篇文章解决什么问题

很多人使用 Claude Code 时，只会说"帮我改一下网站"或"帮我补一篇文章"。这样容易导致：

- 修改范围失控，AI 自动改了不该动的文件。
- 误动配置、主题、导航，造成构建问题。
- 内容风格不一致，前后文不统一。
- 构建没有检查，提交后才发现页面报错。
- 本地草稿或 archive 被误提交到远端。
- AI 只汇报"已完成"，但没有可验证的执行证据。

核心观点：**Claude Code 不是替代工程流程，而是需要被纳入工程流程。** 一个可靠的 Claude Code 工作流应该包括：需求拆解 → 限定文件 → 明确产出 → 执行修改 → 本地检查 → diff 审查 → 构建验证 → 限定提交 → 输出总结。

这篇文章基于 HFL AI Agent Lab 站点建设的真实经验，整理如何把 Claude Code 当成工程协作工具来使用。

---

## 为什么不能只给一句话需求

一句话需求容易导致 Claude Code 自由发挥。对于文档站、项目仓库、博客系统尤其危险，因为它可能：

- 同时修改多个模块，超出你的预期范围。
- 自动重构不需要改的文件，引入不必要的 diff。
- 把草稿文件（drafts/）或归档文件（archive/）加入提交。
- 改动导航配置（config.mts）、主题样式（theme/），造成构建问题。
- 自称完成但没有执行任何检查命令。

所以要把提示词写成"工程任务单"——不是告诉 AI "做什么"，而是告诉它"在什么范围内、按什么标准、做什么、检查什么、提交什么"。

---

## 一个 Claude Code 任务单应该包含什么

| 模块 | 作用 | 示例 |
|---|---|---|
| 当前任务 | 明确这次要做什么 | 执行 v3.0，新增 AI 工具工作流专题第一批 |
| 目标版本 | 标记版本号，方便追溯 | v3.0 |
| 允许新增文件 | 限定 AI 可以创建的新文件 | docs/blogs/topics/claude-code-workflow.md |
| 允许修改文件 | 限定 AI 可以修改的现有文件 | docs/blogs/topics/index.md, README.md |
| 禁止修改文件 | 明确哪些文件绝对不要动 | docs/.vitepress/config.mts, archive/, drafts/ |
| 写作要求 | 内容风格、结构、长度、禁止事项 | 每篇不少于 180 行，不要写"待补充" |
| 检查命令 | 执行哪些命令验证结果 | npm run docs:build, git diff --check |
| 提交范围 | 只提交哪些文件 | git add file1 file2（不用 git add .） |
| 禁止行为 | 明确列出不能做的事 | 不要展开项目 B，不要修改项目 B 占位策略 |
| 输出格式 | 要求 AI 输出可验证的总结 | 输出修改总结表格、文件行数、commit hash |

这个任务单不是给 AI "自由理解"的，而是给 AI "严格执行"的。

---

## 限定修改范围

为什么要明确限定修改范围？因为 Claude Code 在整个仓库中都有读写能力，如果你不告诉它边界在哪里，它可能：

- 修改 `.vitepress/config.mts` 导致导航错误。
- 修改 `.vitepress/theme/` 导致样式问题。
- 把 `drafts/` 中的草稿文件加入提交。
- 把 `archive/` 中的历史文件重新激活。
- 修改 `docs/projects/` 中的项目页面，破坏项目展示策略。

示例——限定修改范围的写法：

```text
只允许修改：
- docs/blogs/topics/index.md
- README.md
- docs/blogs/index.md
- docs/blogs/about.md

不要修改：
- docs/projects/*
- docs/.vitepress/theme/*
- drafts
- archive
- .claude
```

**关键原则：白名单比黑名单更安全。** 告诉 AI "只能改这几个文件"比"不要改那些文件"更可靠——因为你可能遗漏了某些不该改的目录。

---

## 明确写作要求

如果你只说"帮我写一篇文章"，AI 可能写出任何风格、任何长度、任何结构的内容。你需要明确：

- 文章结构：必须包含哪些章节。
- 内容风格：正式博客还是随意笔记。
- 长度要求：不少于多少行。
- 禁止内容：不要写"待补充"、不要写特定术语。
- 表述规范：涉及执行过程时使用什么表述。
- 目标读者：面向谁写。
- 可传播性：能否转成小红书内容。

示例——写作要求的写法：

```text
写作要求：
1. 每篇要有清晰标题。
2. 每篇要有"这篇文章解决什么问题"。
3. 每篇要体现工程化视角。
4. 每篇要能转成小红书内容。
5. 每篇要有"面试表达"。
6. 不要写"待补充"。
7. 不要写 Chain-of-Thought、CoT、思考链。
8. 每篇建议不少于 180 行。
```

---

## 检查命令

不要相信 AI 说"我已经完成了"。要求它执行具体的检查命令，并输出结果：

```text
检查命令：
git diff --check
npm run docs:build
```

- `git diff --check`：检查是否有 whitespace 错误。
- `npm run docs:build`：检查 VitePress 构建是否通过。

如果构建失败，要求 AI 修复后重新执行，直到通过。

还可以要求 AI 执行内容检查：

```text
检查内容：
- grep 确认禁止内容不存在（如"待补充"）
- grep 确认必要章节存在（如"这篇文章解决什么问题"）
- wc -l 确认文件行数满足要求
```

---

## 限定提交范围

**永远不要使用 `git add .`。** 明确告诉 AI 只提交哪些文件：

```text
只提交允许文件：
git add docs/blogs/topics/file1.md docs/blogs/topics/file2.md
git commit -m "docs: add xxx"
git push

不要使用 git add .
```

为什么要限定提交范围？因为仓库中可能有：

- 本地调试脚本（如 check_v29.py）。
- 草稿文件（drafts/）。
- 归档文件（archive/）。
- Claude Code 的配置文件（.claude/）。
- 临时文件。

这些都不应该被提交到远端。

---

## 要求输出可验证总结

不要接受 AI 的"已完成"三个字。要求它输出结构化的总结：

```text
输出格式：
## v3.0 修改总结
- 是否新增 xxx 专题
- 是否更新 topics/index.md
- 是否同步 README、首页与 about
- git diff --check 是否通过
- npm run docs:build 是否通过
- 文件行数
- commit hash
```

这样你可以快速验证 AI 是否真正完成了任务，而不是只听它的"汇报"。

---

## 一个完整的任务单示例

下面是一个完整的 Claude Code 任务单示例：

```text
当前任务：执行 v3.0，新增 AI 工具工作流专题第一批。

允许新增：
- docs/blogs/topics/claude-code-workflow.md
- docs/blogs/topics/ai-coding-review-checklist.md

允许修改：
- docs/blogs/topics/index.md
- README.md

不要修改：
- docs/.vitepress/config.mts
- docs/.vitepress/theme/*
- docs/projects/*
- archive
- drafts
- .claude

写作要求：
1. 每篇不少于 180 行。
2. 每篇要有"这篇文章解决什么问题"。
3. 每篇要有"面试表达"。
4. 不要写"待补充"。

检查命令：
git diff --check
npm run docs:build

提交范围：
git add docs/blogs/topics/claude-code-workflow.md docs/blogs/topics/ai-coding-review-checklist.md docs/blogs/topics/index.md README.md
git commit -m "docs: add AI workflow topics"
git push

输出格式：
## v3.0 修改总结
（表格形式列出每项检查结果）
```

---

## Claude Code 工作流的五个阶段

把上面的内容串起来，一个完整的 Claude Code 工作流分为五个阶段：

**阶段一：任务拆解。** 明确这次要做什么、版本号是什么、预期产出是什么。

**阶段二：范围限定。** 列出允许新增、允许修改、禁止修改的文件清单。

**阶段三：标准明确。** 写作要求、内容风格、长度限制、禁止事项。

**阶段四：执行与检查。** AI 执行修改，然后执行检查命令，修复问题直到通过。

**阶段五：审查与提交。** 你审查 diff，确认只提交允许的文件，然后 push。

每个阶段都有明确的输入和输出，不是 AI "自由发挥"的过程。

---

## 常见误区

**只给一句话需求。** "帮我改一下网站"——AI 会自由发挥，修改范围不可控。

**不限定修改范围。** AI 可能修改配置、主题、导航，造成构建问题。

**不要求执行检查命令。** AI 说"已完成"就信了，结果提交后构建失败。

**使用 `git add .`。** 草稿、归档、临时文件都被提交到远端。

**不要求输出总结。** 无法验证 AI 是否真正完成了任务。

**接受 AI 的"已完成"汇报。** 没有可验证证据的汇报不可信。

**让 AI 自己决定写作风格。** 没有明确要求，每次写出来的文章风格可能不同。

**不审查 diff。** 直接 push，结果发现改了不该改的文件。

---

## 对个人项目的启发

**项目 A（RAG 工单系统）：**

RAG 工单系统的开发也可以用 Claude Code 工作流来推进。比如"新增文档上传功能"，可以拆解为：允许新增 `upload.py`、允许修改 `router.py` 和 `test_upload.py`、不要修改 `config.py`。检查命令可以是 `pytest tests/` 和 `python -m py_compile`。这样每次让 Claude Code 做的事情都是可控的、可验证的。

**项目 B（多 Agent 运营中台 Copilot）：**

多 Agent 系统的开发更需要严格的工作流控制。每个 Agent 的代码修改都应该限定范围，避免一个 Agent 的修改影响另一个 Agent。工具调用的权限控制、状态管理的修改，都需要明确的审查和验证流程。

---

## 面试表达

我不会把 Claude Code 当成"聊天助手"来用。在面试中，我会这样表达：

我把 Claude Code 纳入工程流程来使用。每次给它的任务都写成"工程任务单"的形式——明确任务目标、限定修改范围、列出写作要求、指定检查命令、限定提交范围、要求输出可验证总结。这样做的好处是：修改范围可控，不会误动不该动的文件；结果可验证，不是只听 AI 汇报；提交安全，不会把草稿和归档文件误提交。

在生产级项目中，AI 编程助手的使用更需要工程化。我会要求 AI 执行具体的检查命令（测试、构建、lint），审查它的 diff 再决定是否提交，限定它只能修改白名单内的文件。这不是不信任 AI，而是把 AI 当成工程团队的一员——任何人都需要 code review，AI 也不例外。

---

## 后续 TODO

- 补充 Claude Code 与 GitHub Actions 的集成示例。
- 补充多轮迭代场景下的任务单模板。
- 补充 Claude Code 处理构建失败的重试策略。
- 补充 Claude Code 与其他 AI 编程助手的工作流对比。
