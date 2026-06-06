# 数据分析 Agent：从自然语言到 SQL、图表和洞察

## 这篇文章解决什么问题

数据分析 Agent 是很适合作品集的方向：用户用自然语言提问，Agent 查询数据、生成 SQL、做图表、解释结果、给出业务洞察。

但它也很容易踩坑：

- 模型生成错误 SQL。
- 查询越权数据。
- 大查询拖垮数据库。
- 图表看起来对但口径错。
- Agent 编造不存在的字段。
- 没有记录查询证据，无法复盘。
- 只做“文本转 SQL”，没有分析闭环。

数据分析 Agent 的目标不是把自然语言翻译成 SQL，而是构建一个安全、可解释、可验证的数据分析工作流。

## 基本架构

```text
User Question
  -> Intent / Metric Understanding
  -> Schema Retrieval
  -> SQL Draft
  -> SQL Validation
  -> Permission Check
  -> Query Execution
  -> Result Inspection
  -> Chart Recommendation
  -> Insight Generation
  -> Trace + Feedback
```

## 数据语义层

不要让模型直接面对全库 schema。需要语义层：

| 对象 | 示例 |
|---|---|
| metric | GMV、留存率、转化率、平均响应时间 |
| dimension | 日期、地区、渠道、产品线 |
| table | orders、users、tickets |
| join rule | orders.user_id = users.id |
| filter rule | 只允许查询当前 tenant |
| business definition | GMV = paid_amount，不包含退款 |

语义层能减少模型误解字段和口径。

## SQL 生成不能直接执行

推荐流程：

1. 生成 SQL 草稿。
2. 静态解析 SQL。
3. 检查只读。
4. 检查表和字段是否存在。
5. 注入 tenant_id / user 权限过滤。
6. 限制时间范围和 limit。
7. 估算查询成本。
8. 必要时人工确认。
9. 执行。

禁止：

- `DROP` / `DELETE` / `UPDATE`。
- 无 limit 的大查询。
- 跨租户查询。
- 查询敏感字段。
- 模型拼接未转义用户输入。

## 权限控制

数据分析 Agent 的权限比普通 BI 更敏感：

| 权限 | 说明 |
|---|---|
| table-level | 用户能看哪些表 |
| column-level | 是否能看手机号、邮箱、金额 |
| row-level | tenant_id、region、department |
| metric-level | 某些指标只给管理层看 |
| export-level | 是否允许导出明细 |
| aggregation-level | 只能看聚合，不能看明细 |

权限必须在 SQL 执行前生效，而不是让模型“不要回答”。

## 图表推荐

图表选择可以规则 + 模型结合：

| 数据形态 | 图表 |
|---|---|
| 时间序列 | 折线图 |
| 分类对比 | 柱状图 |
| 占比 | 饼图 / 条形占比 |
| 分布 | 直方图 / 箱线图 |
| 两变量关系 | 散点图 |
| 漏斗 | 漏斗图 |
| 地域 | 地图 |

模型可以解释“为什么用这个图”，但不要让模型编造数据。

## 洞察生成

洞察要基于查询结果：

- 趋势：上升、下降、波动。
- 异常：某天/某地区异常。
- 对比：A 比 B 高多少。
- 结构：主要贡献来自哪里。
- 假设：可能原因，但要标注不确定性。
- 下一步：建议进一步查询什么。

不要让 Agent 把相关性说成因果。

## Trace 记录

每次分析要记录：

- 用户问题。
- 使用的 schema / metric 定义。
- 生成的 SQL。
- 校验结果。
- 权限过滤条件。
- 查询耗时。
- 返回行数。
- 图表配置。
- 洞察文本。
- 用户反馈。

这样才能复盘“图表为什么这么画、数字从哪里来”。

## 评测方式

| 能力 | 评测 |
|---|---|
| Schema linking | 字段和表选择是否正确 |
| SQL correctness | SQL 是否能执行、口径是否正确 |
| Permission safety | 是否越权 |
| Chart selection | 图表是否匹配数据形态 |
| Insight faithfulness | 洞察是否被结果支持 |
| Clarification | 问题模糊时是否追问 |
| Cost control | 是否避免大查询 |

## 面试表达模板

> 数据分析 Agent 不只是 Text-to-SQL。我会先建立指标、维度、表、join 和权限规则组成的语义层，让模型基于受控 schema 生成 SQL。SQL 生成后不能直接执行，要经过静态解析、只读校验、表字段校验、tenant 过滤、limit 和查询成本检查。执行后再根据结果推荐图表并生成洞察，洞察必须引用查询结果，不能编造。全流程记录用户问题、schema、SQL、权限过滤、查询耗时、图表配置和反馈，方便复盘和评测。

## 作品集亮点

如果把数据分析 Agent 做成项目，可以突出：

- 自然语言到 SQL。
- 数据语义层。
- SQL 安全校验。
- 多租户权限控制。
- 图表自动推荐。
- 洞察生成和追问。
- 查询 Trace 和评测集。

## 相关链接

- [Structured Output 工程化](/note/Engineering/structured-output-engineering)
- [Agent 工具沙箱与权限边界](/note/Engineering/agent-tool-sandbox-permission)
- [Agent Trace 执行轨迹](/note/Engineering/agent-trace)
- [AI Agent 项目选题库](/topics/ai-agent-project-ideas)
- [AI Agent 项目包装](/topics/ai-agent-project-packaging)
