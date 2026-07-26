---
title: 简历
sidebar: false
description: HFL 的 AI Agent 工程方向简历：Project A 设备售后 Agentic RAG 平台与 Project B 运营中台 Multi-Agent Runtime，覆盖 RAG 工程化、多 Agent 治理、评测与生产交付。
---

<!-- TODO(作者): 打印投递前补充姓名、联系方式、教育经历 -->

<div class="resume-page-marker" aria-hidden="true"></div>

<span class="print-hint">提示：本页已适配 A4 打印，按 Ctrl / Cmd + P 即可导出 PDF；打印时站点导航、页脚与本提示会自动隐藏。</span>

# HFL · AI Agent 工程方向

目标岗位：AI Agent / RAG / 大模型应用工程师 · GitHub：[github.com/wyjhfl](https://github.com/wyjhfl) · 作品集：[hfl-ai-agent-lab.vercel.app](https://hfl-ai-agent-lab.vercel.app)

## 核心技能

| 技能域 | 具体能力 | 站内证据 |
| --- | --- | --- |
| RAG 工程化 | 文档入库、metadata、query rewrite、GraphRAG、citation 与拒答边界 | [RAG 工程化路径](/topics/rag-engineering-system) |
| Multi-Agent 编排与治理 | 多角色编排、状态机、工具风险分级、审批与治理链路 | [Agent 编排模式](/topics/agent-orchestration-patterns) |
| 工具与 MCP | Tool / MCP Server / Skill 边界选型，ToolGateway 统一执行边界 | [MCP 与 Skills 扩展策略](/topics/mcp-skills-agent-extension-strategy) |
| 评测与可观测 | 检索指标、bad case 边界、trace 回放、Prometheus 监控 | [Project A 评测方案](/projects/project-a-eval-plan) |
| 安全治理 | Prompt Injection 防护、RBAC、审计、Secret 治理 | [安全治理路线](/topics/ai-agent-security-interview-guide) |
| 工程交付 | pytest / Playwright 测试体系、CI、Docker、生产验收门禁 | [工程化笔记](/note/Engineering/) |

## 项目经历

### Project A · 设备售后诊断与工单 Agentic RAG 平台

面向设备售后支持场景，把「设备型号 / 故障码 / 现场现象」转成可追溯的诊断回答与工单闭环。

- FastAPI + Vue 3 + LangGraph + Chroma 实现 adaptive retrieval 与 Agentic 诊断链路；
- 回答附 citation 与 trace_id，资料不足触发拒答，高风险场景升级人工工单；
- GraphRAG 关系检索补充向量召回，Quality 页沉淀 regression / faithfulness / bad case 证据；
- JobService 异步任务（claim / heartbeat / retry / timeout）+ 审计日志 + Prometheus 指标与 Grafana 看板。

**结果**：v1.0.5 发布，185 个后端测试与 35 条 E2E 测试通过，13 步生产验收覆盖测试、构建、OpenAPI、secret scan、Docker 与 Full E2E。

[GitHub 仓库](https://github.com/wyjhfl/project-a-rag-platform) · [架构设计](/projects/project-a-architecture) · [评测方案](/projects/project-a-eval-plan) · [Demo 脚本](/projects/project-a-demo-script)

### Project B · 运营中台 Multi-Agent Runtime

企业级 Multi-Agent Runtime 工程原型，验证多角色协作下工具调用如何被统一治理、审计与回放。

- Coordinator / Analyst / Executor / Reviewer 四角色编排（自研 Harness，可选 LangGraph adapter）；
- 全部工具调用经 ToolGateway + PolicyEngine + OperationWhitelist 统一执行边界；
- 高风险操作进入 HITL 人工审批队列，Audit 审计事件 + Trace / Multi-Agent Trajectory 回放；
- Next.js Operator Console 覆盖 Tasks / Approvals / Trace / Audit / Metrics / NL2SQL / RBAC。

**结果**：默认 fake / offline 模式，不依赖真实 LLM 与外部 MCP Server，即可离线演示「任务创建 → 审批 → 审计 → 轨迹回放」的完整治理链路。

[GitHub 仓库](https://github.com/wyjhfl/project-b-multi-agent) · [架构设计](/projects/project-b-architecture) · [Operator Console 蓝图](/projects/project-b-ui-blueprint) · [Demo 脚本](/projects/project-b-demo-script)

## 知识体系

站内沉淀 265 页工程内容：116 篇工程化笔记覆盖 RAG、LangGraph、MCP、评测、安全与部署的实现细节，77 篇专题把项目、笔记与面试表达串成可复用的方法论。入口：[专题总览](/topics/) · [工程化笔记](/note/Engineering/)。

<style>
/* 打印规则仅在本页生效（生产构建会把页面样式并入全局样式表，
   用 body:has(.resume-page-marker) 限定，避免影响其它页面的打印） */
@media print {
  body:has(.resume-page-marker) {
    /* 站点框架、浮动组件与页内提示 */
    .VPNav,
    .VPLocalNav,
    .VPSidebar,
    .VPFooter,
    .VPDocFooter,
    .reading-progress,
    .back-to-top,
    .comments-section,
    .VPDoc .aside,
    .print-hint {
      display: none !important;
    }

    /* 正文占满纸面，页边距交给 @page */
    .VPContent {
      padding: 0 !important;
    }
    .VPDoc {
      padding: 0 !important;
    }
    .VPDoc .container,
    .VPDoc .content,
    .VPDoc .content-container {
      max-width: none !important;
    }

    .vp-doc {
      font-size: 12pt;
      line-height: 1.5;
    }
    .vp-doc a {
      color: inherit !important;
      text-decoration: none !important;
    }
    .vp-doc table {
      display: table;
      width: 100%;
      border-collapse: collapse;
    }
    .vp-doc th,
    .vp-doc td {
      border: 0.5pt solid #999;
    }
    .vp-doc h1 {
      break-after: avoid;
    }
  }

  @page {
    margin: 14mm;
  }
}
</style>
