---
cssclasses: []
---

# Praxis Theme — Test Note

Use this note to visually verify callout styles, custom checkbox states, and progress bars after changes to `theme.css` and `publish.css`.

Test in: **Dark mode**, **Light mode**, **True Black** (`praxis-contrast-black`).
Test callout style variants: **Soft** (default), **Outlined**, **Minimal** (Style Settings).

---

## Error states (Etap 1 regression test)

> [!danger] Red — danger ✅ must be red (#e06f6f dark / #c05050 light), NOT orange
> `[!danger]` critical. Also: `[!error]`, `[!bug]`

> [!failure] Red — failure ✅ must be red, NOT orange
> `[!failure]` negative. Also: `[!fail]`, `[!missing]`

> [!bug] Red — bug ✅ must be red
> `[!bug]` technical issue

**Error state test:** Try to create a file with an existing name in Obsidian.
The error message text (`--text-error`) must be **red**, not orange.

---

## Callouts — voitech.lol design system semantics

### Violet group — brand / reference

> [!note] Violet — note
> `[!note]` intellectual / reference

> [!abstract] Violet — abstract
> Also: `[!summary]`, `[!tldr]`

> [!important] Violet — important
> `[!important]` key emphasis (violet, NOT orange)

### Mint group — success / technology

> [!tip] Mint — tip
> `[!tip]` helpful. Also: `[!hint]`

> [!success] Mint — success
> `[!success]` completed. Also: `[!check]`, `[!done]`

> [!info] Mint — info
> `[!info]` informational / neutral

### Orange group — warning / attention

> [!warning] Orange — warning ✅ must be orange, not yellow
> `[!warning]` caution. Also: `[!caution]`, `[!attention]`

### Yellow group — question

> [!question] Yellow — question
> `[!question]` uncertain / inquiry. Also: `[!help]`, `[!faq]`

### Red group — error / danger

> [!danger] Red — danger ✅ must be red (#e06f6f)
> `[!danger]` critical. Also: `[!error]`

> [!failure] Red — failure
> `[!failure]` negative. Also: `[!fail]`, `[!missing]`

> [!bug] Red — bug
> `[!bug]` technical issue

### Brown group — context / knowledge

> [!quote] Brown — quote ✅ must be brown (#8b7255), NOT grey/text-secondary
> `[!quote]` attribution. Also: `[!cite]`

> [!example] Brown — example
> `[!example]` neutral demonstration

---

## Custom callout — author

> [!author] Brown — author variant ✅ must be brown, NOT grey
> This is the main content of the note or passage.

---

## Callout with |noicon

> [!note|noicon] Note without icon
> The icon should be hidden. Title text only.

> [!warning|noicon] Warning without icon
> The icon should be hidden.

---

## Callout style variants — check all three

Apply each Style Settings callout style and verify the danger/quote callouts render correctly:

- **Soft** (default): background tinted, left border
- **Outlined**: transparent background, border all sides
- **Minimal**: transparent background, narrow left border only

---

## Custom checkbox states

### Status / workflow

- [ ] incomplete (empty)
- [x] complete (faded, no line-through)
- [/] in-progress (half-fill)
- [-] canceled (strikethrough, muted)
- [>] forwarded / delegated
- [<] scheduled / rescheduled

### Signals

- [?] question / uncertain
- [!] urgent / important
- [*] starred / highlight
- ["] quote reference

### Actionable

- [t] timed / waiting
- [a] alarm / deadline
- [l] location
- [P] phone call
- [R] review / due
- [+] added / created

### Categorical

- [i] information
- [S] money / savings
- [I] idea / insight
- [B] brain / mental model
- [b] bookmark
- [n] note / annotation
- [k] key insight / access
- [w] win / achievement

### Sentiment

- [p] pros / positive
- [c] cons / negative
- [u] trending up
- [d] trending down
- [L] love / value
- [f] fire / hot topic

---

## Progress bars [0]–[9]

- [0] 0% — empty bar (red, `--color-red`)
- [1] 10% (red)
- [2] 20% (red)
- [3] 30% (red)
- [4] 40% (orange, `--color-orange`)
- [5] 50% — half (orange)
- [6] 60% (yellow, `--color-yellow`)
- [7] 70% (yellow)
- [8] 80% (green/mint, `--color-green`)
- [9] 90% — nearly full (green/mint)

> **Note:** `--color-red` maps to `#d97a40` (orange hue from design system), which is intentional for progress bars (low = warm warning). For actual error states, `--praxis-error: #e06f6f` is used via `--text-error`.

---

## Focus states (keyboard navigation test)

Navigate the following using **Tab key only** (no mouse):
1. File explorer (left sidebar) — nav items must show visible focus ring
2. Command palette (Cmd+P) — items must show visible focus ring
3. Search input (Cmd+F) — input must show violet outline

---

## Accessibility — reduced motion test

1. macOS: System Settings → Accessibility → Display → **Reduce Motion ON**
2. Open Obsidian with this theme
3. Toggle the left sidebar — the animation must be instant (≤1ms)
4. Open command palette — it must appear instantly

---

## Mobile checklist (Obsidian iOS/Android)

- [ ] Sidebar drawer opens/closes smoothly at 375px
- [ ] Task checkboxes are tappable (≥44px touch target)
- [ ] Callouts render correctly at 375px — all 5 color groups
- [ ] Brown callout `[!author]` is brown, not grey
- [ ] Red callout `[!danger]` is red, not orange
- [ ] Code blocks scroll horizontally (not overflow)
- [ ] Properties (frontmatter) panel is editable
- [ ] Image grid gap is reduced on narrow screens
