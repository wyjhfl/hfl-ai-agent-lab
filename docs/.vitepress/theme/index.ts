import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { inject } from '@vercel/analytics'

import './tailwind.css'
import './custom.css'

import Mycomponent from './components/Mycomponent.vue'
import GiscusComments from './components/GiscusComments.vue'
import ReadingProgress from './components/ReadingProgress.vue'
import BackToTop from './components/BackToTop.vue'
import HomeShowcase from './components/HomeShowcase.vue'
import LatestArticles from './components/LatestArticles.vue'

export default {
  extends: DefaultTheme,
  Layout: () =>
    h(DefaultTheme.Layout, null, {
      'layout-top': () => h(ReadingProgress),
      'doc-after': () => h(GiscusComments),
      'layout-bottom': () => h(BackToTop),
    }),
  enhanceApp({ app }) {
    app.component('MyComponent', Mycomponent)
    app.component('HomeShowcase', HomeShowcase)
    app.component('LatestArticles', LatestArticles)
    if (!import.meta.env.SSR) {
      inject()
    }
  },
} satisfies Theme
