# AI Agent Portfolio UI Blueprint：个人作品集页面怎么设计

## 这篇文章解决什么问题

AI Agent 求职作品集不能只像资料目录，也不能只像普通博客。面试官真正想快速判断：你做过什么项目、解决什么业务问题、系统架构是否完整、是否有评测、是否能控制风险、是否有代码和 Demo 证据。

Portfolio UI Blueprint 的目标是把个人网站改造成“能力证据面板”：每个页面都能帮助读者从技术关键词看到可验证证据。

## 三类读者

| 读者 | 他们最关心什么 | 页面要给什么入口 |
|---|---|---|
| 招聘方 / 面试官 | 你是否真的做过项目 | 项目卡片、Demo、架构图、关键代码 |
| 技术同行 | 设计是否有工程深度 | Trace、RAG、MCP、Eval、安全、成本 |
| 学习者 | 按什么顺序学 | 学习路线、专题地图、检查清单 |

首页要在 10 秒内回答这三类问题，而不是把所有文章平铺出来。

## 首页信息架构

推荐首页由 6 个区块组成：

1. **Hero**：一句话定位，比如“AI Agent 工程知识库与求职作品集”。
2. **Primary CTA**：项目作品、学习路线、专题地图。
3. **Audience Cards**：招聘方、学习者、开发者分别进入不同路径。
4. **Capability Map**：RAG、Agent Runtime、Tool/MCP、Evaluation、Safety、Ops。
5. **Evidence Links**：作品集路线、Demo 脚本、简历矩阵、Offer Review。
6. **Recent / Featured**：只放最能代表能力的 6-9 篇，不要堆全部文章。

## 项目页模板

| 模块 | 内容 | 证明什么 |
|---|---|---|
| Project Hero | 业务问题、用户、价值 | 不是玩具 Demo |
| Architecture Snapshot | 前端、后端、RAG、Agent、工具、评测 | 系统设计能力 |
| Workflow Demo | 从输入到结果的主路径 | 产品闭环 |
| Evidence Matrix | 代码、文章、截图、评测、日志 | 关键词有证据 |
| Failure Story | 失败样本、根因、修复 | 真实工程经验 |
| Interview Pack | 60 秒介绍、深挖问答、STAR 故事 | 面试可表达 |

## 作品集卡片字段

| 字段 | 示例 |
|---|---|
| project_name | 设备售后诊断与工单 RAG 系统 |
| target_user | 售后工程师 / 客服运营 |
| core_capabilities | RAG、工单、诊断、Trace、Eval |
| proof_links | GitHub、Demo、架构图、评测报告 |
| risk_controls | ACL、PII、工具审批、Fallback |
| interview_angle | 如何从 Demo 提升到生产级 |

## 技术文章页 UI 建议

技术文章页不需要花哨，但要易读：

- 开头明确“解决什么问题”。
- 用表格表达取舍和检查清单。
- 用 Mermaid 或架构图表达系统边界。
- 每篇文章结尾给“面试表达”和“落地检查清单”。
- 长表格要横向滚动，移动端不要挤压到不可读。

## 与 VitePress 的实现关系

VitePress 默认主题已经提供 Home Hero、actions、features、nav、sidebar、local search 和 outline。个人作品集网站不一定要换主题，优先做三件事：

1. 用 frontmatter 的 hero / features 组织第一屏。
2. 用自定义 Vue 组件补充作品集式卡片、时间线、能力地图。
3. 用 custom.css 控制视觉层级、卡片、暗色模式、表格和移动端响应式。

这样比直接引入大型博客主题更稳，也更容易长期维护。

## 页面评审清单

- [ ] 首页是否 10 秒内说明定位和价值？
- [ ] 是否给招聘方一个直接看项目的入口？
- [ ] 是否有能力地图，而不是只有文章列表？
- [ ] 项目页是否能看到架构、Demo、评测和失败复盘？
- [ ] 每个简历关键词是否能找到对应证据？
- [ ] 移动端是否仍能读清卡片和表格？

## 面试表达

可以这样讲：

> 我把个人网站当成 Agent 工程能力证据面板来设计。首页先区分招聘方、学习者和开发者路径，项目页再按业务问题、架构、Workflow、评测、失败复盘和面试讲法组织。这样简历里的 RAG、MCP、Evaluation、Agent Runtime 都能在网站上找到对应证据。