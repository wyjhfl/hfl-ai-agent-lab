# 2026 UI Skill Research Notes

## Decision

Keep extending VitePress default theme instead of replacing the whole theme. The current site benefits from VitePress search, sidebar, markdown rendering, clean URLs, and existing custom components.

## References to reuse

- VitePress default theme extension: custom layouts/components/CSS variables.
- vitepress-theme-teek: card density, blog affordances, visual polish.
- Nólëbase Integrations: optional page experience enhancements and changelog-style navigation.
- UI / frontend skill patterns: accessibility checklist, metadata, responsive review, motion restraint, build verification.

## HFL UI review workflow

1. Check git status and current page entry points.
2. Decide whether this batch improves learning navigation, project evidence, interview expression, or visual hierarchy.
3. Add/modify content and always wire it into nav/sidebar/topic/home where appropriate.
4. Reuse existing design tokens: `--hfl-card-border`, `--hfl-surface-glass`, `--hfl-gradient-soft`, brand colors.
5. Keep custom CSS component-oriented and responsive.
6. Run `npm run docs:build` before commit.
7. Confirm generated folders stay ignored.

## Current UI patterns

- Home showcase: hero, metrics, quick starts, featured evidence, capability map.
- Project portfolio: evidence matrix, architecture cards, project status card.
- Learning dashboard: stage cards, capability tracks, sprint timeline, CTA panel.
- Project B UI blueprint: screen wire cards for Copilot, timeline, evidence, tools, approval, eval.

## Future candidates

- Static Product UI mockup component for Project B.
- Trace Drawer demo with sample JSON.
- Eval Dashboard static cards.
- Topic atlas grouping by learner intent.
- Accessibility pass: focus states, contrast, mobile card spacing.
