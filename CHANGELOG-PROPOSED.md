# Praxis — Proposed Changelog

> Format based on [Keep a Changelog](https://keepachangelog.com/). This file proposes the changes
> from the 2026-06-14 audit, grouped by release. Entries under **Unreleased** were implemented in the
> audit pass (see [IMPLEMENTATION-REPORT.md](IMPLEMENTATION-REPORT.md)); later sections are planned.

## [Unreleased] — audit fixes (this pass)

### Fixed
- **Accessibility:** completed task `[x]` was rendered at `opacity: 0.2` (~1.76:1 contrast,
  unreadable). Raised to `0.5` (~4.2:1) while keeping the "done = de-emphasised" look.
- **Light mode:** darkened the colourful-heading hues so none sits on the 3:1 large-text floor
  (H2 orange was 3.01:1).

### Changed
- Consolidated heading-weight definitions to a single source of truth (removed the dead
  `--h1-weight`/`--h2-weight: 600` that were silently overridden to `500`).

### Removed
- Dead duplicate custom-property declarations: the shadowed `--radius-m: 13px` and redundant
  `--radius-l: 21px` (effective values unchanged).

### Added
- `publish.css`: the documented **1000px** responsive breakpoint (tablet tier) for parity with
  Obsidian Publish layout guidance.
- Documentation comments: the Fibonacci spacing/radius scale and a canonical palette cross-reference
  linking `theme.css` ↔ `publish.css` to prevent drift; clarified previously-unused scale tokens.

### Docs
- README: corrected the corner-radius description (13px base + 21px medium/large), kept install and
  repository references consistent.

---

## [1.x] — planned

### Added
- Graph-view styling (nodes/links/tags/controls) using the brand palette.
- Canvas identity (card radius/border, edge colour, group/label styling, selection ring).
- Style-Settings "Quiet / Reading" preset for distraction-free long-form reading.
- Dedicated tablet (400–768px) responsive tier; shared breakpoint tokens.
- `@media (prefers-contrast: more)` automatic high-contrast variant.

### Changed
- Stronger size-based heading hierarchy (readable with colourful headings disabled; H5/H6 differentiated).
- Unified hover→active interaction easing/timing.
- Refactored the custom task-icon selector block (6× duplicated `:is([data-task=…])` lists → compact
  attribute-driven construction) — behind full glyph + progress-pill regression testing.

### Fixed
- Full light-mode AA pass for inline coloured text (links/tags/accent), not just headings.

### Performance
- Cheaper full-width active-line highlight; SVG/asset trimming; slimmer screenshot.

---

## [2.0] — planned (innovation)

### Added
- Configurable task "workflow language" + shipped Dataview/Tasks recipes.
- Multiple accent/palette schemes from a single canonical token source feeding theme + publish.
- Layout presets (compact / comfortable / editorial) and width/density profiles.
- Optional opt-in webfont type identity with offline fallback; modular type scale.
- Publish parity for graph/canvas/quiet-mode; generated shared palette to eliminate drift.

### Changed
- Namespaced all Style-Settings IDs under `praxis-` (breaking; ships with a documented user reset note).
