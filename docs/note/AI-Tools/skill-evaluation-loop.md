# Skill 评测闭环：让可复用工作流真的变好

Skill 写完并不等于可用。一个 Skill 是否有效，要看它在真实任务中是否触发准确、步骤清晰、少走弯路、能稳定产出并通过验证。

## 评测维度

| 维度 | 问题 | 证据 |
|---|---|---|
| 触发准确 | 该用时会不会用，不该用时会不会误触发 | prompt set + activation log |
| 流程完整 | 是否漏掉关键步骤或验证门禁 | execution trace |
| 上下文效率 | 是否加载过多无关资料 | token / loaded files |
| 工具使用 | 是否正确调用脚本、模板、引用文件 | command log |
| 输出质量 | 是否符合模板、项目规范和用户目标 | rubric / reviewer feedback |
| 回归稳定 | 改 Skill 后旧任务是否仍然通过 | regression cases |

## 最小评测集

```text
skill-evals/
  prompts/
    should-trigger-01.md
    should-trigger-02.md
    should-not-trigger-01.md
  expected/
    rubric.md
    output-shape.md
  runs/
    iteration-001/
    iteration-002/
```

## 触发测试

准备两类 prompt：

- **should trigger**：明确属于 Skill 范围。
- **should not trigger**：相似但不该使用该 Skill。

如果误触发多，通常是 `description` 太宽；如果漏触发多，通常是 description 没写清任务边界和关键词。

## 执行轨迹复盘

不要只看最终答案，还要看 Agent 执行过程：

- 是否一开始就读了不必要的大 reference。
- 是否在没有需求澄清时直接写代码。
- 是否重复跑无用命令。
- 是否忽略了 Skill 里的验证步骤。
- 是否被过多分支选项拖慢。

## 迭代原则

1. **先删再加**：如果 Skill 太长，先删除泛泛而谈的部分。
2. **把坑写具体**：不要写“注意安全”，要写“stdio server 不要用 stdout 打日志”。
3. **给默认路径**：不要列 5 个同等方案，让 Agent 默认选最稳路径。
4. **把脚本固化**：重复生成的校验脚本应该放进 `scripts/`。
5. **保留回归样例**：用户纠正过的错误必须加入 eval case。

## Skill 质量 Rubric

| 分数 | 标准 |
|---|---|
| 1 | 只是一段泛泛提示词，没有触发边界和验证 |
| 2 | 有流程，但缺少项目约束和失败处理 |
| 3 | 有清晰步骤、模板和基本验证 |
| 4 | 有 references / scripts / gotchas / regression cases |
| 5 | 有触发测试、执行轨迹复盘、版本记录和持续评测 |

## 版本发布门禁

- [ ] `SKILL.md` frontmatter 合法。
- [ ] description 通过 trigger / non-trigger prompt 检查。
- [ ] references 都被明确说明何时读取。
- [ ] scripts 可独立运行，有错误提示。
- [ ] 至少 3 个真实任务回归通过。
- [ ] changelog 说明新增、修改、废弃行为。

## 面试表达

> 我不会把 Skill 当成一次性提示词，而是把它当成可测试的工作流资产。每次改 Skill 都会跑触发测试、执行轨迹复盘和输出 rubric，发现误触发、漏步骤或上下文浪费后再迭代 description、流程和 references。

## 参考资料

- [Agent Skills Specification](https://agentskills.io/specification)
- [Optimizing skill descriptions](https://agentskills.io/skill-creation/optimizing-descriptions)
- [Evaluating skill output quality](https://agentskills.io/skill-creation/evaluating-skills)
- [Best practices for skill creators](https://agentskills.io/skill-creation/best-practices)
