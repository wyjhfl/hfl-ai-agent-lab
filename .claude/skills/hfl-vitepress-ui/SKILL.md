---
name: hfl-vitepress-ui
description: Optimize the HFL AI Agent Lab VitePress interface and content navigation. Use when improving this repo's UI, homepage, topic atlas, project portfolio pages, VitePress theme CSS, card layouts, reading paths, visual hierarchy, or when researching and applying UI templates/open-source skills for the site.
---

# HFL VitePress UI

## Workflow

1. Inspect uncommitted content first with `git status --short --branch`; do not overwrite unfinished article batches.
2. Read only the relevant UI entry files:
   - `docs/blogs/home.md`
   - `docs/blogs/topics/index.md`
   - `docs/blogs/projects.md`
   - `docs/.vitepress/theme/components/HomeShowcase.vue`
   - `docs/.vitepress/theme/custom.css`
   - `docs/.vitepress/config.mts`
3. Use the UI principles in `references/ui-principles.md` when changing layout or CSS.
   - `references/template-research.md` when choosing templates, plugins, or open-source skills.
4. Prefer VitePress default theme extension over replacing the whole theme.
5. Keep Chinese copy practical: learning path, engineering mechanism, project evidence, interview value.
6. Update navigation/index links when adding or surfacing pages.
7. Validate with `npm run docs:build`. For visual work, run local preview/dev and inspect the homepage and changed pages in a browser.

## Design direction

- Treat the site as a technical portfolio, not only a document dump.
- First screen should answer: who is this for, what can I read, what evidence proves ability.
- Use cards for routing, tables for dense engineering details, and timelines for learning sequences.
- Preserve readability of long Chinese technical notes: line height, table scroll, code contrast, heading anchors.
- Avoid heavy client dependencies unless there is a clear benefit.
- Use external templates as pattern references first; do not replace the VitePress theme without a migration plan.
- Prioritize featured evidence, reading paths, and project proof over decorative UI changes.

## Commit hygiene

- Do not commit generated output under `docs/.vitepress/dist/` or `docs/blogs/public/blog-index/`.
- Stage source files only.
- Build before commit and push after a meaningful UI batch.


## 2026 UI Skill Research

When optimizing UI, also consult `references/ui-skill-research-2026.md` for the current decision: keep the VitePress default theme, extend with reusable card/path/project components, and always verify navigation, responsive layout, build output, and generated-folder ignores.
