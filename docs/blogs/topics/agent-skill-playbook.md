# Agent Skill Playbook：把可复用工作流沉淀成能力资产

Skill 不是“写一段提示词”。一个好的 Skill 应该像小型工程模块：有触发条件、有执行流程、有脚本、有素材、有测试、有版本、有回滚方案。

如果你想把 AI 编程协作、MCP 服务创建、UI 优化、面试材料整理变成长期可复用能力，就应该用 Skill 的方式沉淀。

---

## 1. 什么时候应该写 Skill

满足下面任意 3 条，就值得写 Skill：

- 同一类任务会重复出现，例如“写项目 case study”“做 UI 检查”“生成 MCP Server 模板”。
- 任务需要固定流程，而不是随便聊几句。
- 任务需要引用固定资产，例如模板、脚本、评分表、示例文件。
- 任务容易出错，需要 checklist 或验证命令。
- 任务适合交给不同 Agent / Codex 会话复用。
- 任务结果要进入作品集、简历或团队规范。

不适合写 Skill 的情况：

- 只做一次的临时问题。
- 没有稳定流程、需要大量实时判断的开放研究。
- 只是一个 prompt 片段，没有脚本、资产或检查标准。

---

## 2. Skill 的最小结构

一个可维护 Skill 推荐这样组织：

```text
my-skill/
├── SKILL.md
├── scripts/
│   └── verify_output.js
├── templates/
│   └── case-study.md
├── references/
│   └── rubric.md
└── assets/
    └── example.png
```

核心原则：

- `SKILL.md` 只放流程和入口，不要塞满所有参考资料。
- `scripts/` 放可执行检查，减少人工判断。
- `templates/` 放可复制产物，例如 PRD、case study、README。
- `references/` 放长文档，通过渐进式加载减少上下文污染。
- `assets/` 放示例图、样例文件或视觉素材。

---

## 3. SKILL.md 应该怎么写

建议使用以下结构：

```markdown
---
name: agent-demo-packager
description: Use when packaging an AI Agent project into portfolio-ready README, demo script, metrics, and interview talking points.
---

# Agent Demo Packager

## When to use
- 用户已经有一个 Agent 项目，但缺少作品集表达。
- 需要生成 README、Demo 脚本、指标表和面试讲法。

## Workflow
1. 读取项目 README、架构文档、测试结果。
2. 识别项目证明的能力域。
3. 生成 case study。
4. 生成 demo acceptance script。
5. 运行链接和构建检查。

## Output
- `docs/projects/<project>/case-study.md`
- `docs/projects/<project>/demo-script.md`
- `docs/interview/<project>-deep-dive.md`
```

写法要点：

- `description` 要明确触发场景。
- Workflow 写“必须做什么”，不要写模糊建议。
- Output 写清楚文件路径或交付物。
- 明确验证命令，例如 `npm run docs:build`、`pytest`、`link check`。

---

## 4. Progressive Disclosure：不要一次加载所有上下文

一个常见错误是把所有参考资料都写进 `SKILL.md`，导致每次调用 Skill 都加载大量无关内容。

更好的方式：

```markdown
## References

如果用户要生成项目 README，读取 `templates/project-readme.md`。
如果用户要做 UI 检查，读取 `references/ui-rubric.md`。
如果用户要做 MCP Server，读取 `references/mcp-server-checklist.md`。
```

这样 Skill 可以按需加载资料，而不是把所有内容塞进上下文。

---

## 5. 三个适合个人博客的 Skill 方向

### A. Portfolio Case Study Skill

用途：把一个项目整理成作品集文章。

输出：

- 项目背景
- 系统架构
- 技术难点
- Eval 指标
- Demo 脚本
- 面试一分钟介绍

关联站内内容：

- [AI Agent 作品集 Case Study 模板](/topics/ai-agent-portfolio-case-study-template)
- [AI Agent Demo Acceptance Script](/topics/ai-agent-demo-acceptance-script)
- [能力证据地图](/topics/ai-agent-job-search-evidence-map)

### B. MCP Server Builder Skill

用途：根据场景生成 MCP Server 设计、schema、测试和安全策略。

输出：

- tool/resource/prompt 清单
- input schema
- sandbox profile
- integration test plan
- README 结构

关联站内内容：

- [MCP Server 从零到作品集](/topics/mcp-server-from-zero-to-portfolio)
- [MCP Tool Schema 设计](/note/Engineering/mcp-tool-schema-design)
- [MCP Server Testing Harness](/note/Engineering/mcp-server-testing-harness)

### C. Agent UI Review Skill

用途：检查 Agent 产品 UI 是否让用户看得懂状态、风险和下一步。

输出：

- 信息架构审查
- 状态可见性审查
- 人工审批路径审查
- 空状态、错误态、加载态检查
- 移动端和可访问性检查

关联站内内容：

- [Agent UI Pattern Library](/topics/agent-ui-pattern-library)
- [站点 UI 优化路线](/topics/ai-agent-site-ui-optimization-playbook)
- [UI Design Skill 调研](/note/AI-Tools/ui-design-skill-research)

---

## 6. Skill 测试清单

不要只测试“能不能生成文字”，要测试输出是否稳定、可用、可验证。

| 测试 | 检查点 |
|---|---|
| trigger test | 描述是否会在正确任务中触发 |
| minimal input test | 用户只给少量上下文时是否会先补问题 |
| artifact test | 是否生成指定文件结构 |
| validation test | 是否运行构建、链接、格式检查 |
| regression test | 同类任务多次运行是否保持结构一致 |
| safety test | 是否避免泄露 token、删除内容、误改配置 |

推荐每个 Skill 至少准备三个样例：

1. 正常项目输入。
2. 信息不足输入。
3. 存在风险或冲突的输入。

---

## 7. Skill 如何变成求职亮点

简历表达可以写：

> 设计并沉淀 Agent 开发 Skills，将 MCP Server 创建、项目 case study 生成、UI 评审和 Demo 验收流程标准化；通过模板、脚本和检查清单降低重复任务出错率，并将输出接入个人作品集站点。

面试讲法：

1. **为什么写 Skill**：重复任务多，纯 prompt 不稳定。
2. **怎么设计边界**：触发条件、流程、脚本、模板、验证。
3. **如何评测**：trigger、artifact、regression、safety。
4. **带来什么价值**：减少上下文重复、提升产物一致性、让 Agent 协作可复用。

---

## 8. 推荐落地顺序

- [ ] 先写一个 Portfolio Case Study Skill。
- [ ] 再写一个 MCP Server Builder Skill。
- [ ] 最后写一个 Agent UI Review Skill。
- [ ] 每个 Skill 至少配一个模板、一个脚本、三个测试样例。
- [ ] 把 Skill 输出接入博客项目页或专题页。
- [ ] 把使用过程截图、失败案例和改进记录写进作品集。

下一步继续看：

- [Skills 编写](/note/AI-Tools/skill-authoring)
- [Skill 测试与版本管理](/note/AI-Tools/skill-testing-versioning)
- [Skill 评测闭环](/note/AI-Tools/skill-evaluation-loop)
- [Skill × MCP 组合实战](/note/AI-Tools/skill-mcp-integration)

---

## 参考资料

- [Claude Docs：Skills overview](https://claude.com/docs/skills/overview)
- [Anthropic Engineering：Equipping agents for the real world with Agent Skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills)
- [Model Context Protocol：Prompts](https://modelcontextprotocol.io/docs/concepts/prompts)
- [Model Context Protocol：Resources](https://modelcontextprotocol.io/docs/concepts/resources)
