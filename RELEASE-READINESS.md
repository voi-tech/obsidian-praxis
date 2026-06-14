# Praxis — Public Release Readiness

> Companion to [AUDIT.md](AUDIT.md). Date: 2026-06-14 · Version `26.6.111`.

## Verdict

### **Mostly Ready** (post-fix). As-shipped today: **Beta.**

Scale: `Ready · Mostly Ready · Beta · Experimental · Needs Major Work`.

- **As it stands right now** (before this audit's fixes): **Beta.** The theme is stable, attractive,
  feature-rich and guideline-compliant on the essentials, but carries one real accessibility defect
  (completed-task contrast), a marginal light mode, and two untouched signature surfaces (graph,
  canvas). Those are exactly the things a discerning reviewer or community-store maintainer notices.
- **After the immediate fixes** in this pass (task opacity, light-mode darkening, dead-code cleanup,
  Publish breakpoint, docs): **Mostly Ready** — shippable as a 1.0 beta in the community catalog,
  with graph/canvas identity and the duplication refactor following as fast-follow 1.x work.

It is **not yet "Ready"** in the unqualified sense, because "Ready" for a flagship-tier theme implies
graph/canvas are styled, light mode is fully AA, and the maintainability debt (duplicated task block,
two colour systems) has a documented plan. Those are 1.x items, not 1.0 blockers.

## Justification

**Why not lower (Experimental / Needs Major Work):**
- Architecture is sound and guideline-compliant; `!important` discipline is exemplary.
- No invalid CSS, no remote assets, valid manifest, working light+dark, real mobile support.
- The original design layer is genuinely high quality and differentiated.

**Why not higher (Ready):**
- A hard a11y failure existed (completed-task contrast 1.76:1).
- Light mode passes only large-text AA for its signature colourful headings.
- Graph view and canvas — surfaces users screenshot and judge themes by — are unstyled.
- Maintainability debt (6× duplicated task selectors, dual colour systems) is real and undocumented.

## Blocking issues (must fix before a public 1.0)

1. **Completed-task `[x]` opacity 0.2 → 1.76:1 contrast** (theme.css:5543). _Fixed in this pass → ~4.2:1._
2. **Light-mode colourful headings on the AA edge** (H2 orange 3.01:1). _Darkened in this pass._
3. **README/identity accuracy** — radius "13px" claim vs effective 13/21 mix; ensure install + repo
   URLs are correct and consistent. _Addressed in this pass._

## Recommended fixes (should-have for a confident 1.0; some done now, some 1.x)

- Remove dead duplicate declarations (`--radius-m`, `--radius-l`, `--h1/h2-weight`). _Done._
- Add the Publish **1000px** breakpoint and tablet container behaviour. _Done._
- Document the canonical palette/token reference to fight theme.css↔publish.css drift. _Done._
- Give **graph view** a Praxis identity (node/line/tag colours, controls panel). _1.x._
- Add minimal **canvas** identity (card radius/border, edge colour, group styling). _1.x._
- Refactor the duplicated **task-icon selector block** behind a compact construction. _1.x (regression-tested)._
- Strengthen **size-based heading hierarchy** so levels read with colour disabled. _1.x._

## Optional improvements (nice-to-have / differentiation)

- `prefers-contrast: more` automatic high-contrast.
- A Style-Settings "quiet/reading" preset (competes with Velocity).
- Refined interaction easing (inspired by Cupertino, without blur).
- Slim `screenshot.png`; add a couple of focused feature screenshots for the catalog.
- Consider a clearer, sortable version scheme or document the CalVer convention.

## Pre-submission checklist (community catalog)

- [x] `manifest.json` valid (name, version, minAppVersion, author).
- [x] `theme.css` present, valid, no remote assets.
- [x] Light + dark mode both functional.
- [x] Mobile support.
- [x] `prefers-reduced-motion` honoured.
- [x] Accessibility: no sub-3:1 readable text (after fixes).
- [ ] Graph + canvas styled (recommended, not strictly required).
- [ ] Tagged GitHub release with `manifest.json` + `theme.css`.
- [ ] `screenshot.png` at recommended proportions, reasonable size.
- [ ] PR to `obsidianmd/obsidian-releases` (out of scope of this audit).
