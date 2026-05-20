---
# 落地页 - 重定向到首页
layout: false
---

<script setup>
import { useRouter } from 'vitepress'
const router = useRouter()
router.go('/home')
</script>
