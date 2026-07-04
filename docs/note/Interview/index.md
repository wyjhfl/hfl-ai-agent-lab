# 项目面试表达

这个目录不是通用面试题库，而是项目表达素材库。当前作品集只保留两个项目：

- [Project A：设备售后诊断与工单 Agentic RAG 平台](/projects/project-a-rag-workorder)
- [Project B：运营中台 Multi-Agent Runtime](/projects/project-b-agent-copilot)

## 推荐阅读路径

| 当前目标 | 先看 | 再看 | 输出结果 |
|---|---|---|---|
| 快速讲项目 A | [Project A 一分钟介绍](/note/Interview/project-a-one-minute) | [Project A 深挖问答](/note/Interview/project-a-deep-dive) | RAG 工程闭环讲法 |
| 快速讲项目 B | [Project B 一分钟介绍](/note/Interview/project-b-one-minute) | [Project B 深挖问答](/note/Interview/project-b-deep-dive) | Multi-Agent Runtime 讲法 |
| 改简历 | [简历描述模板](/note/Interview/resume-bullets) | [AI Agent Resume Project Matrix](/topics/ai-agent-resume-project-matrix) | 2-4 条高密度 bullet |
| 准备技术追问 | [AI Agent 面试题库](/note/AI-Interview/) | [AI Agent 面试追问地图](/topics/ai-agent-interview-followup-map) | RAG / Agent / Tool / Eval 问答 |

## Project A 表达入口

- [Project A 主入口](/projects/project-a-rag-workorder)
- [Project A 架构设计](/projects/project-a-architecture)
- [Project A Quality / Evaluation 方案](/projects/project-a-eval-plan)
- [Project A Demo 验收脚本](/projects/project-a-demo-script)
- [Project A 一分钟介绍](/note/Interview/project-a-one-minute)
- [Project A 深挖问答](/note/Interview/project-a-deep-dive)
- [Project A GitHub](https://github.com/wyjhfl/project-a-rag-platform)

## Project B 表达入口

- [Project B 主入口](/projects/project-b-agent-copilot)
- [Project B 架构设计](/projects/project-b-architecture)
- [Project B Operator Console UI](/projects/project-b-ui-blueprint)
- [Project B Trace / Evaluation 方案](/projects/project-b-trace-eval-plan)
- [Project B Demo 验收脚本](/projects/project-b-demo-script)
- [Project B 路线图](/projects/project-b-roadmap)
- [Project B 一分钟介绍](/note/Interview/project-b-one-minute)
- [Project B 深挖问答](/note/Interview/project-b-deep-dive)
- [Project B STAR 故事库](/note/Interview/project-b-star-story-bank)
- [Project B GitHub](https://github.com/wyjhfl/project-b-multi-agent)

## 技术表达原则

### 不只说用了什么

不要只说“用了 FastAPI、RAG、LangGraph”。要说清楚它们在项目里解决了什么工程问题：Project A 用 Agentic RAG 和 production acceptance 证明诊断链路可追溯、可验收；Project B 用 Runtime、ToolGateway、HITL 和 Trajectory 证明多 Agent 可治理。

### 不过度声明

Project A 可以强调 `v1.0.5`、测试、E2E、smoke 和 production acceptance。Project B 要明确是 production-grade engineering prototype，默认 fake/offline，不是 public-production-ready software。

### 不只讲最终答案

Project A 要讲 citations、trace_id、bad case 和工单升级；Project B 要讲 role steps、policy decision、approval、audit event 和 trajectory。面试官更关心你如何控制风险、验证质量和排查失败。
