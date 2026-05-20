<template>
  <div class="landing-page">
    <p>正在跳转到首页...</p>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vitepress'
const router = useRouter()
router.go('/home')
</script>

<style scoped>
.landing-page {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  font-size: 1.2rem;
  color: var(--vp-c-text-2);
}
</style>
