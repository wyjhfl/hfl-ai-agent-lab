<template>
  <div v-if="showComment" class="comments-section">
    <div class="comments-header">
      <h3 class="comments-title">评论区</h3>
    </div>
    <p class="comments-subtitle">
      欢迎留下你的想法和建议
    </p>
    <!-- Giscus 暂时关闭，v0.5 再接入 -->
    <!-- <GiscusPanel /> -->
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useData, useRoute } from 'vitepress'

const route = useRoute()
const { frontmatter } = useData()

const showComment = computed(() => {
  // Giscus 暂时关闭
  return false
})
</script>

<style scoped>
.comments-section {
  margin: 4rem 0 2rem;
  padding: 3rem 2.5rem;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
}

.comments-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.comments-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin: 0;
}

.comments-subtitle {
  text-align: center;
  font-size: 1rem;
  color: var(--vp-c-text-2);
  margin-bottom: 2rem;
  line-height: 1.8;
}
</style>
