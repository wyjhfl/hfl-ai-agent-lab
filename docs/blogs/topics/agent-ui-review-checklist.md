# Agent UI Review Checklist：让作品集界面像产品而不是草稿

AI Agent 项目最容易出现的问题是：技术内容很强，但页面像“把笔记和设计过程贴上去”。真正面向访客、招聘方和面试官的作品集页面，首屏应该直接回答：

1. 你做的是什么？
2. 解决什么问题？
3. 有哪些项目证据？
4. 我应该点哪里继续看？

不要把“我如何整理内容”“我如何设计信息架构”“内容太多怎么办”放在首屏大标题里。这些是后台设计过程，不是用户价值。

---

## 1. 首屏文案检查

### 合格首屏应该像这样

| 元素 | 合格写法 |
|---|---|
| Eyebrow | AI Agent Engineering Lab |
| 主标题 | AI Agent 工程作品集 / RAG · MCP · 多 Agent · Eval |
| 副标题 | 聚焦可落地的大模型应用：RAG 知识库、多 Agent 协作、MCP 工具平台、评测红队、Coding Agent 与多模态文档智能。 |
| CTA | 查看项目作品 / Agent Builder Hub / 内容地图 |

### 不合格写法

- “内容再多，也按目标进入”
- “不再堆文章”
- “我们重新组织了内容”
- “旧内容不删除”
- “这里按某某方式分类”

这些话对维护者有意义，对访客没有意义。

---

## 2. 首页四层结构

推荐首页从上到下组织：

```text
Hero：一句话定位 + 3 个 CTA
Project Proof：最强 4 个项目证据
Capability Map：RAG / MCP / Eval / Security / UI / Career
Reading Paths：做项目 / 看作品 / 准备面试
```

### Hero

目标：让人 10 秒知道你是谁、做什么方向、为什么值得继续看。

不要在 Hero 里解释：

- 内容如何分类；
- 网站如何重构；
- 文章数量有多少；
- 设计思路是什么。

### Project Proof

展示项目时优先放“证明能力”的信息：

- Project F：多模态文档智能、RAG 入库、PII 治理。
- Project E：Coding Agent、测试门禁、PR 协作。
- Project D：Eval、红队、Release Gate。
- Project C：MCP Gateway、Skill Hub、审批审计。

### Capability Map

能力地图不要只是标签，要告诉访客每个能力能证明什么：

- RAG：能处理知识入库、权限、引用和检索评测。
- MCP：能把工具做成可治理扩展能力。
- Eval：能用指标和回归集驱动迭代。
- Security：能处理 Prompt Injection、PII、审批和审计。
- UI：能把 Agent 过程做成可理解产品。
- Career：能把项目证据转成简历和面试讲法。

---

## 3. Agent 产品 UI 必备状态

Agent UI 不应该只有输入框和回复框。至少要展示 6 个状态：

| 状态 | 用户要知道什么 | UI 组件 |
|---|---|---|
| Intake | Agent 收到了什么任务 | Task intake card |
| Planning | Agent 准备怎么做 | Plan preview |
| Tool Call | 正在调用什么工具 | Tool call card |
| Approval | 哪些动作需要用户确认 | Approval card |
| Evidence | 结果依据是什么 | Citation / evidence panel |
| Recovery | 失败后怎么继续 | Retry / rollback / human takeover |

如果页面只展示最终回答，面试官很难判断你是否真的做了 Agent 工程，而不是简单聊天壳。

---

## 4. 视觉层级检查

### 标题层级

- 页面只有一个核心大标题。
- 卡片标题不超过两行。
- 技术标签不要抢主标题视觉权重。
- 不要在一个屏幕里同时出现 5 个同级大标题。

### 卡片密度

每张卡片只回答一个问题：

- 这个项目是什么？
- 它证明什么能力？
- 下一步链接是什么？

不要把 8 个链接、5 个标签、3 段解释都塞进一张卡。

### CTA 数量

首屏最多 3 个 CTA：

1. 项目作品集；
2. Agent Builder Hub；
3. 内容地图或学习路线。

如果 CTA 超过 4 个，访客会不知道该点哪里。

---

## 5. 面试官视角检查

假设一个面试官只有 3 分钟看你的网站，他会找：

- 你做过哪些项目；
- 每个项目的技术难点；
- 是否有架构图、指标、Demo、Trace；
- 项目是否和简历 bullet 对得上；
- 是否能支撑系统设计追问。

所以每个项目页都应该有：

| 模块 | 作用 |
|---|---|
| Problem | 业务问题 |
| Architecture | 系统边界 |
| Workflow | Agent 执行链路 |
| UI / Console | 产品化证据 |
| Eval | 指标和回归 |
| Security | 风险控制 |
| Demo | 可演示路径 |
| Interview | 一分钟介绍和深挖问答 |

---

## 6. 移动端检查

移动端常见问题：

- Hero 字太大，一屏看不到 CTA。
- 卡片宽度过窄，长英文标签挤破布局。
- 表格横向溢出。
- 右侧证据栏完全消失。
- 导航项太多，用户找不到项目入口。

移动端建议：

- Hero 大标题控制在 2-3 行。
- 技术栈标签换行显示。
- 表格改成卡片或允许横向滚动。
- Evidence panel 改成 drawer。
- 页面顶部保留“项目作品集”和“内容地图”入口。

---

## 7. 每次 UI 修改后的验证命令

```powershell
git diff --check
npm run docs:build
npm run docs:preview -- --host 127.0.0.1 --port 4173
```

浏览器至少抽查：

- `/home`
- `/content-map`
- `/projects`
- `/topics/`
- `/topics/agent-builder-hub`

检查点：

- 首屏是否直接表达作品集价值；
- 是否存在乱码或连续问号占位；
- 新链接是否可点击；
- 移动端网格是否塌陷；
- 构建产物是否保持 ignored。

---

## 8. 可复制 UI 审查清单

- [ ] 首屏标题不是设计过程，而是作品集定位。
- [ ] 首屏 CTA 不超过 3 个。
- [ ] 项目卡片优先展示能力证据，不堆长链接。
- [ ] 长列表进入内容地图或折叠区。
- [ ] 页面能在 10 秒内让访客知道你做 AI Agent / LLM 工程。
- [ ] 每个项目都有架构、UI、评测、安全、Demo、面试表达入口。
- [ ] 页面没有乱码、死链和未提交生成物。
- [ ] 构建通过，预览抽查通过。

继续阅读：

- [Agent UI Pattern Library](/topics/agent-ui-pattern-library)
- [AI Agent Portfolio UI Blueprint](/topics/ai-agent-portfolio-ui-blueprint)
- [AI Agent Offer Portfolio Review](/topics/ai-agent-offer-portfolio-review)
- [Agent Builder Hub](/topics/agent-builder-hub)
