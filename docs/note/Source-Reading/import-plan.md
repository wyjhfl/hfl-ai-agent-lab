# Agent 拆解内容导入计划

## 为什么需要导入计划

当前 Source-Reading 栏目已经有 Hermes Agent、Harness Engineering、OpenClaw 的阅读框架，但内容还停留在"阅读计划"阶段。后续需要把历史对话和源码阅读笔记整理成正式技术文档。

导入过程遵循以下原则：

- 不直接复制聊天记录
- 不编造源码细节
- 把对话内容转化成可读技术文档
- 每篇文章保留架构理解、核心链路、模块拆解、可迁移设计、面试表达

## 内容来源

- Hermes Agent 拆解对话
- Harness Engineering 拆解对话
- OpenClaw 拆解对话
- Claude Code / Codex 工具拆解对话

## 导入优先级

### 优先级 1：Hermes Agent

重点内容：

- Agent 主循环
- 任务规划
- 工具调用
- Prompt Builder
- Memory
- Gateway
- Cron
- Skills

### 优先级 2：Harness Engineering

重点内容：

- 执行链路
- Trace
- Evaluator
- Feedback
- 失败样本
- 工程化亮点

### 优先级 3：OpenClaw

重点内容：

- Gateway
- Channel
- Session
- Agent Runtime
- Workspace
- Memory
- Skills
- Tools
- Plugins
- Compaction
- Multi-Agent
- Security

### 优先级 4：Claude Code / Codex

重点内容：

- 整理成 AI 编程工具与项目导师工作流
- Claude Code 使用方式和最佳实践
- Codex 使用方式和最佳实践
- AI Coding Workflow 工作流

## 统一文章模板

每篇源码拆解文章按以下结构组织：

1. 项目定位
2. 架构总览
3. 核心运行链路
4. 关键模块拆解
5. 关键设计思想
6. 可迁移到自己项目的设计
7. 面试表达
8. 后续 TODO

## 导入原则

- 不编造源码路径、类名、函数名
- 没有确认的内容写成"待补充"
- 不直接粘贴聊天记录
- 不记录或暴露模型不可见的完整中间分析过程
- 使用关键决策摘要、工具调用记录、状态变化记录、执行轨迹等工程化表述
- 项目 B 当前继续保持占位
