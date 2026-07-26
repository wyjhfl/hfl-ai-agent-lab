<script setup lang="ts">
import { computed, ref } from 'vue'
import { withBase } from 'vitepress'
import initialPageData from '../../data/blog-index-page-1.json'

interface BlogPost {
  title: string
  summary: string
  section: string
  url: string
  publishedAt: number
  publishedText: string
  updatedAt: number
  updatedText: string
}

interface BlogPage {
  key: string
  page: number
  totalPages: number
  items: BlogPost[]
}

const props = withDefaults(
  defineProps<{
    limit?: number
    paginated?: boolean
  }>(),
  {
    limit: 0,
    paginated: false,
  }
)

const loading = ref(true)
const failed = ref(false)
const posts = ref<BlogPost[]>([])
const page = ref(1)
const totalPages = ref(1)

const skeletonCount = computed(() => (props.limit > 0 ? Math.min(props.limit, 6) : 6))
const showPager = computed(() => props.paginated && !failed.value && totalPages.value > 1)
const initialPage = initialPageData as BlogPage
const initialItems = Array.isArray(initialPage.items) ? initialPage.items : []

loading.value = false
posts.value = props.limit > 0 ? initialItems.slice(0, props.limit) : initialItems
page.value = Number.isFinite(initialPage.page) && initialPage.page > 0 ? initialPage.page : 1
totalPages.value = Math.max(
  1,
  Number.isFinite(initialPage.totalPages) ? initialPage.totalPages : 1
)

function formatDate(post: BlogPost): string {
  const timestamp = post.updatedAt || post.publishedAt
  if (!timestamp) {
    return post.updatedText || post.publishedText || ''
  }
  const date = new Date(timestamp)
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

async function loadPage(target: number) {
  loading.value = true
  failed.value = false
  try {
    const response = await fetch(withBase(`/blog-index/all/page-${target}.json`))
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }
    const data = (await response.json()) as BlogPage
    const items = Array.isArray(data.items) ? data.items : []
    posts.value = props.limit > 0 ? items.slice(0, props.limit) : items
    page.value = Number.isFinite(data.page) && data.page > 0 ? data.page : target
    totalPages.value = Math.max(1, Number.isFinite(data.totalPages) ? data.totalPages : 1)
  } catch {
    failed.value = true
    posts.value = []
  } finally {
    loading.value = false
  }
}

function goTo(target: number) {
  if (loading.value || target < 1 || target > totalPages.value || target === page.value) {
    return
  }
  loadPage(target)
}

</script>

<template>
  <div class="latest-articles">
    <div v-if="loading" class="la-skeleton" aria-hidden="true">
      <div v-for="n in skeletonCount" :key="n" class="la-skeleton-row">
        <span class="la-skeleton-bar la-skeleton-title"></span>
        <span class="la-skeleton-bar la-skeleton-meta"></span>
      </div>
    </div>

    <p v-else-if="failed" class="la-error">
      文章索引加载失败，请稍后重试，或前往
      <a :href="withBase('/topics/')">专题图谱</a>
      浏览全部内容。
    </p>

    <template v-else>
      <ul class="la-list">
        <li v-for="post in posts" :key="post.url" class="la-item">
          <a class="la-title" :href="withBase(post.url)">{{ post.title }}</a>
          <div class="la-meta">
            <span class="la-badge">{{ post.section }}</span>
            <time class="la-date">{{ formatDate(post) }}</time>
          </div>
        </li>
      </ul>

      <div v-if="showPager" class="la-pager">
        <button
          type="button"
          class="la-pager-btn"
          :disabled="loading || page <= 1"
          @click="goTo(page - 1)"
        >
          上一页
        </button>
        <span class="la-pager-info">第 {{ page }} / {{ totalPages }} 页</span>
        <button
          type="button"
          class="la-pager-btn"
          :disabled="loading || page >= totalPages"
          @click="goTo(page + 1)"
        >
          下一页
        </button>
      </div>
    </template>
  </div>
</template>

<style scoped>
.latest-articles {
  margin-top: 1.25rem;
}

.la-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
}

.la-item {
  margin: 0;
  padding: 0.85rem 1rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  background: var(--vp-c-bg-soft);
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.75rem;
  flex-wrap: wrap;
  transition: border-color 0.2s ease;
}

.la-item:hover {
  border-color: var(--vp-c-brand-1);
}

.la-title {
  font-weight: 600;
  color: var(--vp-c-text-1);
  text-decoration: none;
  line-height: 1.5;
  flex: 1 1 16rem;
  min-width: 0;
}

.la-title:hover {
  color: var(--vp-c-brand-1);
}

.la-meta {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  flex: 0 0 auto;
}

.la-badge {
  display: inline-block;
  padding: 0.1rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.72rem;
  line-height: 1.6;
  color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
  white-space: nowrap;
}

.la-date {
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.la-pager {
  margin-top: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.la-pager-btn {
  padding: 0.35rem 0.9rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font-size: 0.85rem;
  cursor: pointer;
  transition: border-color 0.2s ease, color 0.2s ease;
}

.la-pager-btn:hover:not(:disabled) {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.la-pager-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.la-pager-info {
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  font-variant-numeric: tabular-nums;
}

.la-error {
  margin: 0;
  padding: 0.85rem 1rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
}

.la-error a {
  color: var(--vp-c-brand-1);
  text-decoration: underline;
}

.la-skeleton {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
}

.la-skeleton-row {
  padding: 0.85rem 1rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  background: var(--vp-c-bg-soft);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

.la-skeleton-bar {
  display: inline-block;
  height: 0.9rem;
  border-radius: 6px;
  background: var(--vp-c-divider);
  animation: la-pulse 1.4s ease-in-out infinite;
}

.la-skeleton-title {
  flex: 1 1 auto;
  max-width: 60%;
}

.la-skeleton-meta {
  flex: 0 0 7rem;
}

@keyframes la-pulse {
  0%,
  100% {
    opacity: 0.45;
  }
  50% {
    opacity: 1;
  }
}

@media (max-width: 640px) {
  .la-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.4rem;
  }

  .la-title {
    flex: 1 1 auto;
  }
}
</style>
