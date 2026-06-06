# Skill Review Checklist：AI Agent Skill 怎么审查

## 这篇文章解决什么问题

Skill 能把重复工作沉淀成 Agent 可复用的操作手册，但很多 Skill 写完后只是“长 Prompt 文件”：触发条件不清楚、步骤太泛、引用资料太大、没有验收标准，也没有安全边界。

Skill Review Checklist 的目标是像代码审查一样审查 Skill，确保它能被 Agent 稳定触发、按步骤执行、产生可验证输出。

## Skill 的最小结构

一个可维护的 Skill 至少要有：

| 文件/目录 | 作用 |
|---|---|
| SKILL.md | frontmatter + 核心流程 |
| references/ | 需要时再读取的长参考资料 |
| scripts/ | 可重复执行的确定性脚本 |
| assets/ | 模板、图片、样例工程等输出资源 |

不要把所有内容都塞进 SKILL.md。Skill 的价值是“渐进加载”和“稳定流程”，不是把上下文窗口塞满。

## Frontmatter 审查

| 检查项 | 通过标准 |
|---|---|
| name | 小写、短、能表达用途 |
| description | 说明做什么、什么时候触发、适用文件/任务 |
| 触发边界 | 不和其它 Skill 大量重叠 |
| 误触发风险 | 不会因为泛词频繁触发 |

弱 description：

> Helps with frontend.

强 description：

> Review and improve Agent product UI flows, including task states, approval cards, evidence panels, trace timelines, and VitePress portfolio pages. Use when modifying Agent UI, homepage cards, project portfolio layout, or UX review checklists.

## 流程审查

| 检查项 | 问题 |
|---|---|
| 是否先检查当前状态 | 避免覆盖用户未提交改动 |
| 是否有明确输入 | 文件、目录、截图、需求、接口 |
| 是否有步骤顺序 | 先调研、再编辑、再验证 |
| 是否有失败处理 | 工具不可用、文件缺失、构建失败怎么处理 |
| 是否有验收标准 | build、test、screenshot、diff check |

## Progressive Disclosure 审查

| 反模式 | 改法 |
|---|---|
| SKILL.md 超长 | 把细节放 references/ |
| 每次都读全部资料 | 在 SKILL.md 说明什么时候读哪个 reference |
| 脚本代码每次重写 | 放到 scripts/ 并说明参数 |
| 模板散落在说明里 | 放 assets/ 让 Agent 复制/改造 |

## 安全审查

| 风险 | 检查 |
|---|---|
| 删除文件 | 是否要求先确认路径和范围 |
| 网络/凭证 | 是否避免把 secret 写进输出 |
| 生产操作 | 是否区分 dry-run 和 live-run |
| 用户数据 | 是否要求脱敏和最小必要读取 |
| 第三方指令 | 是否提醒不要把网页内容当成系统指令 |

## Skill 测试用例

| 测试类型 | 示例 |
|---|---|
| Trigger test | 用户说“帮我优化 Agent UI”，是否触发正确 Skill |
| Procedure test | 是否先检查 git 状态，再改文件 |
| Output test | 是否产出目标文件、报告或截图 |
| Safety test | 遇到危险删除是否要求确认 |
| Regression test | Skill 修改后旧任务是否仍可完成 |

## 版本管理

Skill 也应该像代码一样管理：

- 每次重大修改写清楚原因。
- 修改 description 后重新测试触发边界。
- 新增 scripts 后实际运行一次。
- 删除 reference 前确认没有 SKILL.md 入口引用。
- 把真实失败案例转成下一版测试用例。

## 面试表达

可以这样讲：

> 我写 Skill 不只是写一段提示词，而是按可复用工程资产管理。一个 Skill 需要清楚的触发描述、渐进加载的 references、必要时可执行的 scripts、明确验收标准和安全边界。修改 Skill 后我会做 trigger、procedure、output、safety 和 regression 测试。

## 审查清单

- [ ] description 是否足够具体？
- [ ] SKILL.md 是否只保留核心流程？
- [ ] references 是否按需加载？
- [ ] scripts 是否可运行且有参数说明？
- [ ] 是否有构建/测试/截图/输出验收标准？
- [ ] 是否覆盖危险操作和隐私边界？