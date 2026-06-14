# Praxis — Implementation Report (audit pass 2026-06-14)

> Phase 7 of the audit. Every change below is **non-breaking** (no removed functionality, no
> architecture rewrite, no Style-Settings ID renames). Each was committed individually; the repo's
> `PostToolUse` hook auto-committed and pushed every edit to `origin`.

## Files changed

| File | Edits | Effective behaviour change |
|---|---|---|
| `theme.css` | 5 | Completed-task opacity; light heading hues; dead-code removal; heading-weight SSOT; token docs |
| `publish.css` | 2 | Light heading hues (sync); 1000px tablet breakpoint |
| `CHANGELOG-PROPOSED.md` | 1 | Docs-entry wording corrected to match reality |

Plus the four audit documents (`AUDIT.md`, `RELEASE-READINESS.md`, `ROADMAP.md`,
`CHANGELOG-PROPOSED.md`) created in earlier phases.

---

## Change 1 — Completed-task readability (a11y blocker)

**What:** `[x]` completed tasks raised from `opacity: 0.2` → `0.5`.
**Why:** 0.2 yields ~1.76:1 effective contrast — unreadable, fails even the 3:1 floor. 0.5 → ~4.2:1.

```css
/* before */                              /* after */
.markdown-rendered li[data-task="x"] {    .markdown-rendered li[data-task="x"] {
  opacity: 0.2;                              opacity: 0.5;   /* + explanatory comment */
  text-decoration-line: none;               text-decoration-line: none;
}                                          }
```

- **Pros:** Fixes the only hard WCAG failure; keeps the de-emphasised "done" look; hover-to-0.8 still works.
- **Cons:** Completed tasks are slightly more prominent than before.
- **Compat risk:** None. Pure value change. (theme.css ~:5550)

## Change 2 — Light-mode heading/colour hues darkened (a11y)

**What:** The six light-mode `--color-*` heading hues darkened to clear ~4.3:1 on `--bg1`.
Mirrored in `publish.css`. Dark mode untouched (dark-first identity preserved). Accent (`--ax1`) and
`--callout-*` left unchanged.

| Token | Before | After | Contrast (light bg) |
|---|---|---|---|
| `--color-red` | `#b96830` (3.68) | `#a85a28` | 4.50 |
| `--color-orange` | `#c47a40` (3.01) | `#a55f2c` | 4.37 |
| `--color-yellow` | `#a08030` (3.32) | `#8a6c22` | 4.40 |
| `--color-green` | `#3a8f84` (3.43) | `#2f7d72` | 4.35 |
| `--color-blue` | `#4a7fb0` (3.77) | `#3d6f9e` | 4.71 |
| `--color-purple` | `#7a60c8` (4.31) | `#6a51b4` | 5.42 |

- **Pros:** Light-mode colourful headings (and coloured inline text/tags/syntax) now meet ~normal-text
  AA, not just large-text AA; theme.css and publish.css stay in sync.
- **Cons:** Light-mode headings are visibly richer/darker — an intentional aesthetic shift in the
  light *fallback* only. Easily reverted by restoring the hex values.
- **Compat risk:** Low. Light mode only; no dark-mode/brand-identity change. (theme.css `.theme-light`; publish.css `.theme-light`)

## Change 3 — Dead-code removal: duplicate radius declarations

**What:** Removed the shadowed `--radius-m: 13px;` and redundant `--radius-l: 21px;` from the
"Map to Obsidian radius vars" block; they were overridden two lines later by the Style-Settings
block (`--radius-m/l: var(--praxis-radius-lg)` = 21px).

- **Pros:** One source of truth per radius var; less reader confusion.
- **Cons:** None — effective values unchanged (still 13/21px).
- **Compat risk:** None. (theme.css ~:4983)

## Change 4 — Heading-weight single source of truth

**What:** Removed the dead `--h1-weight: 600` / `--h2-weight: 600` / `--h3-weight: 500` from the
early Headings block; H1–H3 weights now come solely from the Praxis design token
(`--h1/2/3-weight: var(--praxis-heading-weight)` = 500). H4–H6 remain literals in the early block.

- **Pros:** Each heading-weight variable defined exactly once; the `600` that never applied is gone.
- **Cons:** Heading weights now live in two blocks by level (H1–H3 token-driven, H4–H6 literal) — but
  this reflects the actual design intent (Praxis only customises H1–H3).
- **Compat risk:** None — effective weights unchanged (all 500 except H6=400). (theme.css ~:148 / ~:5007)

## Change 5 — Publish 1000px tablet breakpoint

**What:** Added `@media (max-width: 1000px)` to `publish.css` (Obsidian Publish hides the right
sidebar at this width per the layout guidance). It eases page padding one step
(`calc((space-5 + space-6)/2)` ≈ 27px, giving a monotonic 34→27→21px progression with the existing
750px tier) and caps the dense `.cards-cols-5..8` presets to auto-fit so they don't crowd.

- **Pros:** Aligns with the documented Publish responsive tiers; better tablet layout; no overflow.
- **Cons:** Slightly tighter padding and fewer forced columns between 750–1000px.
- **Compat risk:** Low. Publish only; placed before the 750px block so the cascade resolves correctly. (publish.css ~:1122)

## Change 6 — Token & palette documentation

**What:** Added comments documenting the Fibonacci spacing scale (noting `-1/-7/-8` are reserved and
may be unreferenced), the effective radius scale (13px base + 21px medium/large), and a
cross-reference noting that `publish.css` mirrors the brand hex — change both together.

- **Pros:** Future maintainers understand the "unused" tokens are intentional and where the palette
  source of truth lives; reduces drift risk.
- **Cons:** None.
- **Compat risk:** None (comments only). (theme.css ~:4966)

---

## Verification performed

- **Brace balance:** `theme.css` 971/971, `publish.css` 188/188 (diff 0).
- **`!important` count unchanged:** theme.css 6, publish.css 4 (no new ones introduced).
- **Variable integrity:** `--praxis-heading-weight` defined (`:4957`) and referenced (`:5007–5009`);
  `--radius-s/m/l` still defined (`:5001–5003`); each `--h*-weight` defined exactly once.
- **Contrast:** all changed light hues recomputed ≥ 4.35:1; completed-task ≈ 4.2:1.
- Static only — no live Obsidian smoke test was run (owner chose textual review).

## Remaining issues (NOT addressed this pass — see ROADMAP.md)

| Issue | Why deferred |
|---|---|
| Graph-view has no styling; canvas barely styled | New feature work, not a fix — 1.x. |
| Task-icon `:is([data-task=…])` block duplicated 6× | Refactor needs full glyph + progress-pill regression testing — 1.x. |
| Two colour systems (theme.css vs publish.css) | Mitigated with docs + synced hues now; true single-source needs a build step — 1.x/2.0. |
| Light accent `--ax1` 4.31:1 for link text | Brand colour; mitigated by default underline. Flagged optional — needs owner sign-off to change hue. |
| Style-Settings ID namespacing inconsistent | Renaming resets users' saved settings — **breaking**, needs a migration note — 2.0. |
| Heading hierarchy weak with colour disabled (H5≈H6) | Size-scale rework — 1.x. |
| `theme.css` 212 KB; viewport-width active-line shadow | Perf optimisation — 1.x. |

## Suggested next step (owner decision required)

The highest-value *non-trivial* item is **graph-view + canvas identity** (closes the most visible
competitive gap). The most valuable *cleanup* is the **task-selector refactor**. Both are flagged in
ROADMAP.md as 1.x. Neither was auto-applied because they exceed "safe non-breaking fix" scope and
warrant their own reviewed change.
