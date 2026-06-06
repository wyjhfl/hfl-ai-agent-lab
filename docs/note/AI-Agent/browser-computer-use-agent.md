# Browser / Computer Use Agent：让 Agent 操作 GUI 的工程边界

## 这篇文章解决什么问题

浏览器和电脑控制 Agent 可以像人一样点击、输入、读取屏幕、操作网页或桌面应用。它看起来很强，但风险和不确定性也更高：

- UI 会变化。
- 页面加载慢。
- 点击可能点错。
- 账号和权限敏感。
- 网页可能包含恶意指令。
- GUI 操作难以回放。
- 高风险动作需要人工确认。

这篇文章整理 Browser / Computer Use Agent 的工程边界：什么时候用、怎么设计、如何验证、如何控制风险。

## 什么时候需要 Computer Use

优先级应该是：

```text
API > MCP/Tool > Browser Automation > Computer Use
```

只有当没有稳定 API 或 MCP 工具时，才考虑 GUI 操作。

适合场景：

- 内部后台没有 API。
- 需要操作第三方网页。
- 需要读取网页视觉状态。
- 需要做端到端 UI smoke test。
- 需要自动填表但不能直接调接口。

不适合场景：

- 高风险资金操作。
- 大批量不可回滚操作。
- 有稳定 API 可用的场景。
- 涉及敏感信息但没有安全隔离。

## 系统架构

```text
User Task
  ↓
Agent Planner
  ↓
Browser / Computer Controller
  ↓
Observation
  ↓
Action
  ↓
Trace + Screenshot + DOM Snapshot
  ↓
Human Approval / Result
```

关键是每一步都要可观察、可记录、可暂停。

## 观察方式

浏览器 Agent 可以结合：

- DOM。
- Screenshot。
- Accessibility tree。
- URL。
- Network 状态。
- Console error。
- Local storage / cookies 状态。

只看截图容易误判；只看 DOM 又可能忽略视觉布局。工程上通常需要多种观察信号。

## 动作类型

常见动作：

- navigate。
- click。
- type。
- select。
- scroll。
- wait。
- upload。
- screenshot。
- extract。
- submit。

每个动作都应该进入 Trace：

```json
{
  "step": 3,
  "action": "click",
  "target": "button[data-testid='submit']",
  "url": "https://example.com/form",
  "result": "success",
  "screenshot": "run_001_step_003.png"
}
```

## 风险控制

### 1. 白名单

限制可访问域名、可操作页面、可用账号。

### 2. 高风险动作审批

以下动作必须人工确认：

- 提交订单。
- 付款。
- 删除数据。
- 发送邮件。
- 修改配置。
- 发布内容。

### 3. 沙箱账号

尽量使用测试账号或低权限账号，不要让 Agent 拿管理员账号。

### 4. 操作前后截图

每个关键动作前后保存截图，方便审计和回放。

### 5. DOM 定位优先

能用稳定 selector 就不要盲点坐标。坐标点击容易受分辨率和布局影响。

## 和 Playwright 的关系

Playwright 更适合确定性自动化：

- 固定测试流程。
- 已知 selector。
- 可重复 E2E。
- 构建验证。

Computer Use Agent 更适合不确定任务：

- 页面结构未知。
- 需要视觉理解。
- 需要动态决策。

实际项目可以组合：

- 用 Agent 探索流程。
- 把稳定流程沉淀成 Playwright 脚本。
- 用脚本做长期回归测试。

## 面试表达

可以这样讲 Browser / Computer Use Agent：

> 我不会优先让 Agent 操作 GUI。我的优先级是 API、MCP/Tool、浏览器自动化，最后才是 Computer Use。GUI Agent 的问题是页面变化、点击不稳定、权限敏感和审计困难，所以我会限制域名和账号，优先使用 DOM selector，记录每一步 screenshot、URL、action 和结果，高风险提交必须人工确认。对于稳定流程，我会把 Agent 探索出的操作沉淀成 Playwright 脚本，用于回归测试。

## 相关链接

- [Agent 安全威胁模型](/note/Engineering/agent-security-threat-model)
- [Tool Calling 工程化](/topics/tool-calling-engineering)
- [Agent Trace 执行轨迹](/note/Engineering/agent-trace)
- [生产级 Agent 治理清单](/topics/production-agent-governance-checklist)

## 参考资料

- [OpenAI Computer Use](https://platform.openai.com/docs/guides/tools-computer-use)
- [Playwright documentation](https://playwright.dev/docs/intro)

