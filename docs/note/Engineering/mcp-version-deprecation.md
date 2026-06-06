# MCP Version Deprecation：MCP 工具版本弃用怎么做

## 这篇文章解决什么问题

MCP 工具一旦被多个 Agent、Skill、工作流和用户依赖，就不能随意改 schema 或删除工具。版本弃用如果没有流程，会导致线上任务失败、评测样本失效、审批策略失配、客户端缓存旧 schema。

MCP Version Deprecation 的目标是让工具 schema 变化、版本迁移和旧版本下线可通知、可灰度、可回滚。

## 什么变更需要新版本

| 变更 | 处理 |
|---|---|
| 新增可选字段 | minor version |
| 删除字段 | major version |
| 字段类型变化 | major version |
| 风险等级变化 | policy review |
| 输出结构变化 | client contract test |
| 权限 scope 变化 | auth review |
| 副作用变化 | approval policy review |
| 错误码变化 | compatibility test |

## 弃用流程

1. schema diff 检测；
2. owner 提交 migration note；
3. gateway 标记 deprecated_since；
4. client 记录仍在使用的 run / workflow；
5. contract test 覆盖新旧版本；
6. 灰度默认版本；
7. 发布迁移截止时间；
8. 下线旧版本并保留回滚窗口。

## Deprecation Metadata

| 字段 | 说明 |
|---|---|
| tool_id | 工具 ID |
| version | 当前版本 |
| deprecated | 是否弃用 |
| deprecated_since | 弃用开始时间 |
| sunset_at | 最终下线时间 |
| replacement_version | 替代版本 |
| migration_note | 迁移说明 |
| breaking_changes | 破坏性变更 |
| owner | 负责人 |
| usage_count | 仍在使用的调用量 |

## 面试表达模板

> 我不会直接修改 MCP 工具 schema，而是把工具版本纳入 deprecation 流程。schema diff 后由 owner 写 migration note，Gateway 标记 deprecated_since 和 sunset_at，Client 侧统计旧版本使用量并跑 contract test。新版本灰度通过后再切默认版本，旧版本保留回滚窗口。

## 常见误区

### 误区一：工具 schema 改完 Agent 会自动适配

模型可能仍按旧描述生成参数，Client 和评测样本也可能依赖旧结构。

### 误区二：只看 Server 版本

还要看 tool schema version、policy version、approval policy 和 client cache。

### 误区三：没有迁移观察期

高频工具下线前必须观察旧版本使用量，否则会影响线上 workflow。

## 相关链接

- [MCP Tool Schema 设计](/note/Engineering/mcp-tool-schema-design)
- [MCP Client 测试](/note/Engineering/mcp-client-testing)
- [MCP Gateway 运维](/note/Engineering/mcp-gateway-operations)
- [MCP Observability Metrics](/note/Engineering/mcp-observability-metrics)
- [Tool Registry 工程化](/note/Engineering/tool-registry-engineering)
