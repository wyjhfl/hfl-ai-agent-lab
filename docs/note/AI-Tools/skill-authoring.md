# Skills 编写：把一次性提示词沉淀成可复用工作流

## 这篇文章解决什么问题

AI 编程工具的效果不稳定，很多时候不是模型不够强，而是每次都在重新解释同一套流程：文件该放哪里、输出格式是什么、哪些命令必须检查、哪些内容不能改、失败时怎么回退。

Skills 的价值是把这些重复说明沉淀成可复用的工作流。它不是单纯的 Prompt 模板，而是给 Agent 的“小型操作手册”：什么时候触发、按什么步骤执行、需要哪些脚本/参考资料/模板、最终怎么验证。

这篇文章面向个人博客、AI Agent 项目、求职作品集三个场景，整理如何设计一个能长期复用的 Skill。

## Skill 适合解决什么问题

Skill 适合处理“重复、可流程化、对一致性有要求”的任务。

| 场景 | 不用 Skill 的问题 | 用 Skill 的价值 |
|---|---|---|
| 博客内容生产 | 每次都要解释文章风格、目录、检查方式 | 固定选题、写作结构、链接规则和构建检查 |
| 项目版本推进 | AI 容易改错范围、漏跑测试 | 固定改动边界、测试命令、提交说明 |
| 简历/面试材料 | 表达风格不统一，容易夸大 | 固定事实来源、STAR 表达和项目亮点模板 |
| 数据处理 | 反复写相似脚本，容易出错 | 把确定性脚本放进 `scripts/` |
| 公司内部流程 | 业务规则需要反复解释 | 把规则放进 `references/`，按需加载 |

判断标准很简单：如果你连续三次对 AI 说了类似的话，就应该考虑把它写成 Skill。

## Skill 的基本结构

一个 Skill 通常是一个目录，核心文件是 `SKILL.md`，可选目录包括 `scripts/`、`references/`、`assets/`。

```text
skill-name/
├── SKILL.md
├── agents/
│   └── openai.yaml
├── scripts/
├── references/
└── assets/
```

### SKILL.md

`SKILL.md` 是 Agent 真正会读取的操作说明。它至少要包含 frontmatter：

```markdown
---
name: blog-topic-writer
description: Write and update HFL AI Agent Lab topic articles. Use when creating AI Agent, RAG, MCP, Skills, interview, or portfolio content for the VitePress blog, including routing, internal links, build checks, and batch commit summaries.
---
```

`description` 是触发入口，比正文更重要。它应该写清楚：

- Skill 做什么。
- 什么任务应该触发它。
- 适用的文件类型或场景。
- 关键约束，例如构建检查、链接规则、不能改的目录。

### scripts/

适合放确定性脚本，例如：

- Markdown frontmatter 检查。
- 图片压缩和重命名。
- 文章索引生成。
- 简历项目经历格式校验。
- 批量替换固定模板。

原则：能用脚本稳定完成的事情，不要每次都让模型重新写一遍。

### references/

适合放较长的参考资料，例如：

- 项目数据库 schema。
- 公司业务词表。
- API 文档。
- 写作风格指南。
- 面试项目事实清单。

原则：`SKILL.md` 保持精简，只写流程；长资料放 `references/`，需要时再读。

### assets/

适合放最终产物会用到的文件，例如：

- PPT 模板。
- 简历模板。
- 站点图片素材。
- 代码项目脚手架。
- Mermaid 图模板。

## 写 Skill 的核心原则

### 1. 不要把 Skill 写成百科

Skill 不是教材。Agent 已经知道很多通用知识，Skill 应该只补充“这个任务中特有、容易忘、必须遵守”的内容。

差的写法：

> Markdown 是一种轻量级标记语言，可以用 `#` 表示标题。

好的写法：

> 新增博客专题时，文件必须放在 `docs/blogs/topics/`；标题使用一级标题；正文必须包含“解决什么问题”“工程化拆解”“面试表达”“相关链接”四段。

### 2. 先定义触发，再定义步骤

很多 Skill 失败是因为触发描述太模糊。`description` 应该像检索关键词一样覆盖真实请求。

例如博客写作 Skill 可以写：

```yaml
description: Create or update VitePress blog articles for AI Agent, RAG, MCP, Skills, LLM engineering, interview preparation, and portfolio pages. Use when the user asks to add knowledge content, optimize the personal blog, write topic articles, update navigation, run docs build, or prepare a content batch for commit.
```

这里同时包含了主题词、动作词和交付物，触发概率更高。

### 3. 自由度要和风险匹配

不是所有 Skill 都要写得很死。

| 风险 | 写法 |
|---|---|
| 低风险：写文章、总结、生成提纲 | 给结构和质量标准，保留表达自由 |
| 中风险：修改项目代码 | 给文件范围、测试命令、提交规则 |
| 高风险：部署、删除、迁移数据 | 给固定脚本、审批点、回滚步骤 |

博客写作可以允许模型自由组织段落；数据库迁移不能让模型自由发挥。

### 4. 把验证写进 Skill

一个可用的 Skill 不能只告诉 Agent 怎么做，还要告诉它怎么证明做完了。

博客内容类 Skill 的验证可以包括：

- `npm run docs:build`
- 新增页面能被侧边栏或专题入口访问。
- 内链没有死链。
- 没有把 `docs/.vitepress/dist` 等生成产物加入提交。
- `git status --short` 只包含本次允许的源文件。

代码类 Skill 的验证可以包括：

- 单元测试。
- 类型检查。
- lint。
- API smoke test。
- diff 审查。

## 一个博客内容 Skill 示例

下面是一个适合 HFL AI Agent Lab 的最小 Skill 设计。

```markdown
---
name: hfl-blog-batch
description: Create a coherent batch of HFL AI Agent Lab content for AI Agent, RAG, MCP, Skills, LLM engineering, interview preparation, and portfolio pages. Use when updating VitePress docs, adding topic articles, linking sidebar entries, running docs build, and preparing one batch commit.
---

# HFL Blog Batch

## Workflow

1. Inspect `docs/blogs/topics`, `docs/note/AI-Agent`, `docs/note/Engineering`, `docs/note/AI-Tools`, and `docs/note/AI-Interview` before writing.
2. Pick a coherent content batch instead of one isolated note.
3. Add source Markdown only; do not commit generated `docs/.vitepress/dist` or `docs/blogs/public/blog-index`.
4. Update entry pages and VitePress sidebar when new pages must be discoverable.
5. Run `npm run docs:build`.
6. Review `git diff --stat` and `git status --short`.
7. Commit with `docs: ...` after build passes.

## Content Rules

- Write in Chinese.
- Prefer engineering framing: problem, architecture, workflow, validation, interview expression.
- Avoid empty trend commentary.
- Add internal links to related notes.
- Do not copy external articles.

## Final Checks

- Build passes.
- New pages are reachable.
- Commit contains only intended files.
- Summary lists new pages and verification result.
```

这个 Skill 不需要解释什么是 VitePress，也不需要解释什么是 Markdown。它只保留当前仓库真正需要的操作规则。

## 一个 Agent 项目 Skill 示例

如果要为项目 B 这种多 Agent 工程项目写 Skill，可以这样设计：

```markdown
---
name: project-b-release-runner
description: Advance project-b-multi-agent release work. Use when adding operational automation, tests, runbooks, release notes, validation scripts, or post-release checks for the multi-agent operations platform.
---

# Project B Release Runner

## Workflow

1. Read `AGENTS.md`, `README.md`, current release plan, and latest release notes.
2. Identify the exact release scope before editing.
3. Keep runtime code, scripts, tests, and docs aligned.
4. Add tests for new scripts or changed behavior.
5. Run the focused pytest target first, then broader checks if shared behavior changed.
6. Update release notes and handoff docs only after implementation passes.

## Guardrails

- Do not reset or discard user changes.
- Do not claim smoke tests passed unless command output proves it.
- Do not modify unrelated release files.
- Keep generated artifacts out of commits unless the release plan explicitly requires them.
```

这种 Skill 的目标不是让 Agent “更聪明”，而是让它“更守规矩”。

## Skill 和 Prompt 模板的区别

| 维度 | Prompt 模板 | Skill |
|---|---|---|
| 生命周期 | 一次性复制粘贴 | 长期复用 |
| 触发方式 | 用户主动粘贴 | Agent 根据描述触发 |
| 内容范围 | 通常只有文字指令 | 可包含脚本、参考资料、素材 |
| 适用场景 | 简单输出格式 | 多步骤工作流 |
| 验证能力 | 通常较弱 | 可以内置检查命令和验收标准 |

如果只是“帮我按这个格式写一段话”，Prompt 模板足够。如果涉及文件、命令、项目规则、验证和交付，就更适合 Skill。

## Skill 和 MCP 的关系

Skill 和 MCP 经常被放在一起讨论，但它们解决的问题不同：

| 能力 | 解决的问题 | 例子 |
|---|---|---|
| Skill | 告诉 Agent 怎么做事 | 写博客批次、跑发布检查、生成面试稿 |
| MCP | 给 Agent 提供外部能力 | 查数据库、读 GitHub、调用业务 API |
| Script | 把确定步骤变成程序 | 生成索引、校验 Markdown、转换文件 |
| Hook | 在关键节点拦截或审计 | 禁止危险命令、要求人工审批 |

一个完整的 Agent 工作流通常是：Skill 规定流程，MCP 暴露工具，Script 保证确定性，Hook 控制风险。

## 常见误区

### 误区一：把所有背景都塞进 SKILL.md

这会浪费上下文，也会降低可维护性。`SKILL.md` 只保留必要流程，长资料放到 `references/`。

### 误区二：description 写得太短

`description: blog writer` 很难触发。应该写出任务、场景、关键词和触发条件。

### 误区三：只有步骤，没有验收

没有验收标准，Agent 容易只完成“看起来完成”的部分。Skill 应该明确最后必须检查什么。

### 误区四：用 Skill 代替项目文档

Skill 是给 Agent 执行任务看的，不是给人读的完整产品文档。项目背景、设计说明、API 文档仍然应该放在仓库文档中。

### 误区五：为低频任务创建 Skill

只做一次的任务不一定需要 Skill。Skill 的收益来自复用。

## 面试表达

可以这样讲 Skills：

> 我把 Skills 理解成 Agent 的可复用操作手册。它解决的不是模型能力问题，而是工程流程一致性问题。比如博客内容生产、项目版本推进、简历材料整理，都有固定的文件范围、输出结构、检查命令和提交标准。我会把这些规则写进 `SKILL.md`，把长参考资料放到 `references/`，把确定性操作放到 `scripts/`，最后通过构建、测试或 diff 审查验证结果。这样每次使用 Agent 时，不需要重新解释流程，也能降低误改文件、漏跑检查和假验证的风险。

## 相关链接

- [AI Coding Workflow](/note/AI-Tools/ai-coding-workflow)
- [Claude Code 拆解](/note/AI-Tools/claude-code)
- [Codex 拆解](/note/AI-Tools/codex)
- [MCP Server 工程化](/note/Engineering/mcp-server)
- [Tool System 横向对比](/topics/tool-system-comparison)

## 参考资料

- [OpenAI Academy: Using skills](https://openai.com/academy/skills/)

