# UI Principles for HFL AI Agent Lab

## Research baseline

- VitePress default theme already supports home hero, actions, features, local search, nav, sidebar, doc outline, and theme CSS variables. Extend these before introducing a full replacement theme.
- Open-source VitePress blog themes commonly add category cards, article grids, tag archives, timeline navigation, hero panels, and dark-mode-friendly glass surfaces.
- Claude/Codex style skills are useful for repeatable UI work when they encode workflow, file entry points, validation, and design constraints rather than large copied templates.

## Layout checklist

- Hero: one clear value proposition and 2-3 actions.
- Audience cards: separate recruiter / learner / builder paths.
- Capability map: RAG, Runtime, Tool/MCP, Evaluation, Safety/Ops, Career evidence.
- Project pages: show business problem, architecture capability, evidence, and interview expression.
- Topic pages: include a short visual atlas before dense tables.

## Visual checklist

- Use restrained blue-cyan-purple gradients to match existing brand.
- Keep cards responsive: 3 columns desktop, 2 tablet, 1 mobile.
- Avoid low-contrast text on glass backgrounds.
- Make hover states useful but subtle.
- Ensure long tables remain horizontally scrollable.

## Validation checklist

- Build passes.
- Homepage renders with no hydration errors.
- Topic and project pages remain readable on mobile width.
- Links use clean VitePress paths and do not point to missing pages.
