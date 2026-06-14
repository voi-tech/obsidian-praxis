# Praxis — Roadmap

> Companion to [AUDIT.md](AUDIT.md) / [RELEASE-READINESS.md](RELEASE-READINESS.md).
> Sequenced by impact-to-effort. "Done now" = applied in the audit implementation pass.

---

## Immediate fixes (highest impact, lowest risk) — applied this pass

These are small, safe, high-leverage changes implemented in the same session as the audit. See
[IMPLEMENTATION-REPORT.md](IMPLEMENTATION-REPORT.md) for before/after.

1. **Completed-task readability** — raise `[x]` opacity 0.2 → 0.5 (1.76:1 → ~4.2:1). _a11y blocker._
2. **Light-mode heading darkening** — nudge the light colourful-heading hues so none sits at the
   3:1 floor (H2 orange was 3.01). _a11y._
3. **Dead-code removal** — drop duplicate `--radius-m`/`--radius-l`; consolidate heading weights to a
   single source of truth. _maintainability, zero visual change._
4. **Publish 1000px breakpoint** — add the documented tablet tier to `publish.css`.
5. **Token documentation** — document the Fibonacci/radius scale and add a canonical palette
   cross-reference comment linking `theme.css` ↔ `publish.css`.
6. **Docs accuracy** — correct the radius framing in README; keep install/repo URLs consistent.

---

## Version 1.x roadmap

### UX
- **Style-Settings "Quiet / Reading" preset** — one toggle that tones colour down, widens leading,
  and softens callouts for distraction-free long-form reading (direct answer to Velocity).
- **Graph-view identity** — colour nodes/links/tags with the brand palette, style the controls panel
  and search, respect contrast modes. Currently unstyled — a visible gap.
- **Canvas identity** — card radius/border tokens, edge colour, group label styling, selection ring.

### Styling
- **Stronger heading hierarchy** — make size carry the hierarchy so it reads with colour disabled;
  differentiate H5/H6 (currently both 0.85em). Consider a modular scale tied to the golden ratio.
- **Interaction micro-states** — unify hover→active easing/timing (Cupertino-inspired, no blur).
- **Refactor the task-icon selector block** — replace the 6× repeated `:is([data-task=…])` lists with
  a compact construction (single attribute-driven rule set + per-glyph variable assignment), behind a
  full regression test of every glyph and the `[0]–[9]` progress pills.

### Readability
- Reading-mode measure/leading refinement pass for long notes.
- Optional drop-cap / first-line treatment as a Style-Setting (advanced typography).

### Performance
- Audit the viewport-width active-line `box-shadow` (theme.css:1759) repaint cost; consider a
  cheaper full-width highlight technique.
- Trim/optimise inline SVGs; consider whether the full 30-glyph set ships by default or is opt-in.
- Slim `screenshot.png`.

### Mobile
- Fill the **tablet (400–768px)** gap with a dedicated tier instead of relying on ≤400px + desktop.
- Introduce shared breakpoint tokens rather than ad-hoc `400px`/`600px`/`400pt`.

### Accessibility
- Full light-mode AA pass (bring inline coloured text, not just headings, to ≥4.5:1).
- `@media (prefers-contrast: more)` automatic high-contrast variant.
- Verify screen-reader-irrelevant decorative elements are `aria-hidden`/inert where the theme injects content.

### Style Settings
- Expose heading-hierarchy strength, reading preset, accent colour, and graph colours.
- Plan a **migration path** to namespace all setting IDs under `praxis-` consistently (breaking —
  needs a documented one-time reset note for users).

---

## Version 2 roadmap (innovation)

### Unique Praxis features
- **Knowledge-work task OS** — extend the task-icon system into a documented, configurable
  "workflow language" (status + signal + category) with Dataview/Tasks-plugin recipes shipped as docs.
- **Semantic callout presets** for thinking frameworks (decision logs, hypotheses, evidence, claims).

### New interactions
- Subtle, opt-in **focus/typewriter reading** enhancements building on the existing focus mode.
- Hover previews / backlink affordances tuned to the palette.

### Advanced typography
- Optional **bundled or opt-in webfont** profile (with offline fallback) to give Praxis a type
  identity beyond colour — gated so the default stays system-font and offline-clean.
- Modular type scale, optical-size awareness, fine-grained measure controls.

### Customisable layouts
- **Layout presets** (compact / comfortable / editorial) as a single Style-Setting axis.
- Configurable note width + sidebar density profiles.

### Alternative colour systems
- **Multiple accent/palette schemes** (e.g. warm/cool/mono) selectable in Style Settings, with a
  single canonical token source feeding both `theme.css` and `publish.css`.
- Auto-generated light variants from dark seeds (algorithmic contrast targeting AA).

### Enhanced Publish
- Bring graph/canvas/quiet-mode parity to `publish.css`; share the palette via a generated token file
  to eliminate drift; richer responsive tiers.

### AI-assisted / knowledge-work
- Ship documentation + snippet recipes for AI-assisted note workflows (summary callouts, task
  extraction) — theme-level styling hooks for plugin output, not bundled JS.

---

## Maintainability program (cross-cutting)

- **Single source of truth for colour** — define the brand palette once; generate the publish copy.
- **Reduce fork debt** — periodically diff against upstream Minimal; document which inherited blocks
  Praxis intentionally diverges from, and delete inherited code Praxis does not use.
- **Adopt a build step** (optional) — author in modular files, concatenate/minify to `theme.css`,
  enabling deduplication of the task block and a generated palette without shipping multiple files.
- **Changelog discipline** — keep [CHANGELOG-PROPOSED.md](CHANGELOG-PROPOSED.md) current per release.
