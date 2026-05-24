import { defineConfigWithTheme, type DefaultTheme } from 'vitepress'

interface GiscusThemeConfig {
  repo?: string
  repoId?: string
  category?: string
  categoryId?: string
  mapping?: 'pathname' | 'url' | 'title' | 'og:title' | 'specific' | 'number'
  term?: string
  strict?: '0' | '1'
  reactionsEnabled?: '0' | '1'
  emitMetadata?: '0' | '1'
  inputPosition?: 'top' | 'bottom'
  lang?: string
  theme?: string
  lightTheme?: string
  darkTheme?: string
  loading?: 'lazy' | 'eager'
}

type ThemeConfig = DefaultTheme.Config & {
  giscus?: GiscusThemeConfig
}

const KNOWN_FENCE_LANGUAGES = new Set([
  'apache',
  'bash',
  'c++',
  'cmd',
  'cpp',
  'csharp',
  'css',
  'dart',
  'go',
  'html',
  'http',
  'java',
  'javascript',
  'js',
  'json',
  'jsx',
  'markdown',
  'mermaid',
  'nginx',
  'php',
  'plaintext',
  'powershell',
  'properties',
  'python',
  'regex',
  'sql',
  'text',
  'ts',
  'tsx',
  'txt',
  'typescript',
  'vue',
  'xml',
  'yaml',
  'yml',
])

const FENCE_LANGUAGE_ALIASES = new Map([
  ['htnl', 'html'],
  ['ja', 'java'],
  ['jav', 'java'],
  ['ks', 'js'],
  ['mysql', 'sql'],
  ['plain', 'plaintext'],
  ['pythobn', 'python'],
  ['shell', 'bash'],
  ['shellscript', 'bash'],
])

const SHELL_COMMAND_STARTERS = new Set([
  'bun',
  'conda',
  'curl',
  'deno',
  'docker',
  'git',
  'kubectl',
  'mvn',
  'node',
  'npm',
  'npx',
  'pip',
  'pip3',
  'pnpm',
  'python',
  'python3',
  'yarn',
])

function normalizeFenceLanguageToken(token: string): string {
  const lowered = token.trim().toLowerCase()
  if (!lowered) return ''

  const direct = FENCE_LANGUAGE_ALIASES.get(lowered) || (KNOWN_FENCE_LANGUAGES.has(lowered) ? lowered : '')
  if (direct) return direct

  const leading = lowered.match(/^[a-z0-9+#-]+/u)?.[0] || ''
  if (!leading || leading === lowered) return ''

  return FENCE_LANGUAGE_ALIASES.get(leading) || (KNOWN_FENCE_LANGUAGES.has(leading) ? leading : '')
}

function normalizeFenceInfo(info: string, content: string): { info: string; content: string } {
  const trimmedInfo = info.trim()
  if (!trimmedInfo) {
    return { info, content }
  }

  const [firstToken, ...restTokens] = trimmedInfo.split(/\s+/)
  const rest = restTokens.join(' ')
  const loweredFirstToken = firstToken.toLowerCase()
  const normalizedLanguage = normalizeFenceLanguageToken(firstToken)

  if (firstToken === '$' || (!normalizedLanguage && rest && SHELL_COMMAND_STARTERS.has(loweredFirstToken))) {
    const normalizedContent = content.startsWith(trimmedInfo) ? content : `${trimmedInfo}\n${content}`
    return {
      info: 'bash',
      content: normalizedContent,
    }
  }

  if (normalizedLanguage) {
    if (!rest || normalizedLanguage !== loweredFirstToken) {
      return {
        info: normalizedLanguage,
        content,
      }
    }
  }

  if (/^[-=]+$/.test(firstToken) || /^[^\p{L}\p{N}]+$/u.test(firstToken)) {
    return {
      info: 'txt',
      content,
    }
  }

  return { info, content }
}

function sanitizeNoteMarkdown(content: string): string {
  const withoutMarkdownImages = content
    // 移除 obsidian 风格的图片
    .replace(/!\[\[([^[\]]+)\]\]/g, '')
    // 移除链接中指向本地图片的内容
    .replace(
      /\[([^\]]*)]\(([^)]+\.(?:png|jpe?g|gif|bmp|webp|svg)(?:[?#][^)]+)?)\)/gi,
      (match, text, url) => {
        // 保留 http/https 外链
        if (/^https?:\/\//i.test(url)) return match
        return '[$1](about:blank)'
      }
    )
    // 移除 img 标签
    .replace(/<img\b[^>]*>/gi, '')

  const escapedAngleBrackets = withoutMarkdownImages.replace(/</g, '&lt;').replace(/>/g, '&gt;')
  const escapedProcessingInstruction = escapedAngleBrackets
    .replace(/<\?/g, '&lt;?')
    .replace(/\?>/g, '?&gt;')

  const escapedInvalidTagLikeContent = escapedProcessingInstruction.replace(
    /<([^>\n]+)>/g,
    (match, innerRaw) => {
      const inner = innerRaw.trim()
      if (!inner) return '&lt;&gt;'
      if (inner.startsWith('!--') && inner.endsWith('--')) return match
      if (inner.startsWith('!DOCTYPE')) return match

      const normalized = inner.startsWith('/') ? inner.slice(1).trim() : inner
      const tagName = normalized.split(/\s+/)[0] || ''
      if (!/^[A-Za-z][\w:-]*$/.test(tagName)) return `&lt;${innerRaw}&gt;`

      return match
    }
  )

  const escapedAttrs = escapedInvalidTagLikeContent.replace(
    /\{([^{}\n]+)\}/g,
    (_match, inner) => `&#123;${inner}&#125;`
  )

  return escapedAttrs.replace(/\{\{/g, '&#123;&#123;').replace(/\}\}/g, '&#125;&#125;')
}

export default defineConfigWithTheme<ThemeConfig>({
  title: 'HFL AI Agent Lab',
  description: 'AI Agent 工程知识库 · 多 Agent 项目展示 · 求职作品集',
  srcDir: '.',
  srcExclude: ['.obsidian/**', 'local/**', 'self/**'],
  rewrites: {
    'blogs/:path(.*)': ':path',
  },
  head: [
    ['meta', { name: 'theme-color', content: '#0ea5e9' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'HFL AI Agent Lab' }],
    ['meta', { property: 'og:description', content: 'AI Agent 工程知识库 · 多 Agent 项目展示 · 求职作品集' }],
  ],

  base: '/',
  cleanUrls: true,
  ignoreDeadLinks: false,
  lastUpdated: true,
  
  sitemap: {
    hostname: 'https://hfl-ai-agent-lab.vercel.app',
  },

  themeConfig: {
    logo: false,
    outline: {
      level: 'deep',
      label: '目录',
    },
    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: '搜索文档',
            buttonAriaLabel: '搜索文档'
          },
          modal: {
            noResultsText: '无法找到相关结果',
            resetButtonTitle: '清除查询条件',
            footer: {
              selectText: '选择',
              navigateText: '切换',
              closeText: '关闭'
            }
          }
        }
      }
    },
    // giscus 暂时关闭，v0.5 再接入自己的 GitHub Discussions
    // giscus: { ... },
    nav: [
      { text: '首页', link: '/home' },
      { text: '学习路线', link: '/note/AI-Agent/' },
      { text: '专题文章', link: '/blogs/topics/' },
      { text: '源码拆解', link: '/note/Source-Reading/' },
      { text: '工程笔记', link: '/note/Engineering/' },
      { text: '面试题库', link: '/note/AI-Interview/' },
      { text: '项目实战', link: '/projects' },
      { text: '关于我', link: '/about' },
      { text: 'GitHub', link: 'https://github.com/wyjhfl' },
    ],
    sidebar: {
      '/note/AI-Agent/': [
        {
          text: 'AI Agent 学习路线',
          items: [
            { text: '路线总览', link: '/note/AI-Agent/' },
            { text: 'Agent 基础', link: '/note/AI-Agent/agent-basic' },
            { text: 'Prompt Engineering', link: '/note/AI-Agent/prompt-engineering' },
            { text: 'RAG 基础', link: '/note/AI-Agent/rag' },
            { text: 'Tool Calling', link: '/note/AI-Agent/tool-calling' },
            { text: 'LangGraph 状态机', link: '/note/AI-Agent/langgraph' },
            { text: 'Multi-Agent 架构', link: '/note/AI-Agent/multi-agent' },
            { text: 'Human-in-the-loop', link: '/note/AI-Agent/human-in-the-loop' },
            { text: 'Trace 与 Evaluation', link: '/note/AI-Agent/evaluation' },
            { text: 'Production Engineering', link: '/note/AI-Agent/production' },
          ],
        },
      ],

      '/note/Source-Reading/': [
        {
          text: 'Agent 源码拆解',
          items: [
            { text: '源码拆解总览', link: '/note/Source-Reading/' },
            { text: 'Hermes Agent', link: '/note/Source-Reading/hermes-agent' },
            { text: 'Hermes Agent 高级玩法', link: '/note/Source-Reading/hermes-agent-advanced' },
            { text: 'Harness Engineering', link: '/note/Source-Reading/harness-engineering' },
            { text: 'OpenClaw', link: '/note/Source-Reading/openclaw' },
            { text: '拆解内容导入计划', link: '/note/Source-Reading/import-plan' },
          ],
        },
      ],

      '/note/Engineering/': [
        {
          text: '工程化笔记',
          items: [
            { text: '工程化总览', link: '/note/Engineering/' },
            { text: 'FastAPI 后端接口', link: '/note/Engineering/fastapi' },
            { text: '数据库设计', link: '/note/Engineering/database' },
            { text: 'RAG 工程化', link: '/note/Engineering/rag-engineering' },
            { text: '向量数据库', link: '/note/Engineering/vector-database' },
            { text: 'Docker 部署', link: '/note/Engineering/docker-deploy' },
            { text: '日志与可观测性', link: '/note/Engineering/observability' },
            { text: '异步任务与长任务处理', link: '/note/Engineering/async-task' },
            { text: 'API 安全与工具权限控制', link: '/note/Engineering/api-security' },
            { text: 'Agent Trace 执行轨迹', link: '/note/Engineering/agent-trace' },
            { text: 'Evaluation Pipeline', link: '/note/Engineering/eval-pipeline' },
            { text: 'MCP Server 工程化', link: '/note/Engineering/mcp-server' },
            { text: 'AI Agent 上线检查清单', link: '/note/Engineering/production-checklist' },
          ],
        },
      ],

      '/note/AI-Tools/': [
        {
          text: 'AI 编程工具',
          items: [
            { text: 'AI 工具总览', link: '/note/AI-Tools/' },
            { text: 'Claude Code 拆解', link: '/note/AI-Tools/claude-code' },
            { text: 'Codex 拆解', link: '/note/AI-Tools/codex' },
            { text: 'AI Coding Workflow', link: '/note/AI-Tools/ai-coding-workflow' },
          ],
        },
      ],

      '/note/AI-Interview/': [
        {
          text: 'AI Agent 面试题库',
          items: [
            { text: '题库总览', link: '/note/AI-Interview/' },
            { text: 'Agent 面试题', link: '/note/AI-Interview/agent-interview' },
            { text: 'RAG 面试题', link: '/note/AI-Interview/rag-interview' },
            { text: 'LLM 工具调用面试题', link: '/note/AI-Interview/llm-tools-interview' },
            { text: '大模型工程面试题', link: '/note/AI-Interview/llm-engineering-interview' },
            { text: 'LangChain / LangGraph 面试题', link: '/note/AI-Interview/langchain-interview' },
          ],
        },
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/wyjhfl' }
    ],

    footer: {
      message: 'HFL AI Agent Lab',
      copyright: 'Copyright © 2026 HFL',
    },

    editLink: {
      pattern: 'https://github.com/wyjhfl/hfl-ai-agent-lab/tree/master/docs/:path',
      text: '欢迎一起完善文档',
    },

    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'full',
        timeStyle: 'medium',
      },
    },

    docFooter: {
      prev: '上一页',
      next: '下一页',
    },
  },

  markdown: {
    math: true,
    config(md) {
      md.set({ linkify: false })

      const defaultFenceRenderer = md.renderer.rules.fence
      if (!defaultFenceRenderer) return

      md.renderer.rules.fence = (tokens, idx, options, env, self) => {
        const token = tokens[idx]
        const originalInfo = token.info
        const originalContent = token.content
        const normalized = normalizeFenceInfo(originalInfo, originalContent)

        token.info = normalized.info
        token.content = normalized.content

        try {
          return defaultFenceRenderer(tokens, idx, options, env, self)
        } finally {
          token.info = originalInfo
          token.content = originalContent
        }
      }
    },
  },

  vite: {
    publicDir: 'blogs/public',
    build: {
      chunkSizeWarningLimit: 1500,
      rollupOptions: {
        output: {
          manualChunks: {
            'vitepress-vendor': ['vitepress'],
          },
        },
      },
    },
    optimizeDeps: {
      exclude: ['vitepress'],
    },
    ssr: {
      noExternal: ['@iconify/vue'],
    },
    plugins: [
      {
        name: 'sanitize-note-md',
        enforce: 'pre',
        transform(code, id) {
          const normalizedId = id.split('?')[0].replace(/\\/g, '/')
          if (!normalizedId.endsWith('.md')) return null
          if (!normalizedId.includes('/docs/note/')) return null
          if (normalizedId.endsWith('/docs/note/index.md')) return null
          return sanitizeNoteMarkdown(code)
        },
      },
    ],
  },
})
