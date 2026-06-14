# Praxis — Comprehensive Theme Audit

> Audit date: 2026-06-14 · Theme version: `26.6.111` · Target: `minAppVersion 1.13.0`
> Reviewer brief: Senior Frontend Engineer · Obsidian Theme Maintainer · CSS Architecture · UX/UI · Design Systems · Technical Review.
> Tone: deliberately critical. The benchmark is "best-in-class community theme," not "good enough for personal use."

---

## 0. Executive summary

Praxis is a **fork of Minimal Theme** (`@kepano`) with a well-considered, genuinely original
design layer bolted on top (Fibonacci spacing scale, a 30+ glyph custom task-icon system, a warm
dark-first palette, semantic colourful callouts and a Publish companion). The Praxis-original code
(`theme.css` lines 4946–5815) is of **high quality**: it is well commented, uses `color-mix()` and
CSS custom properties idiomatically, ships `prefers-reduced-motion` and `:focus-visible` support,
and is careful about mobile touch targets and the CodeMirror gutter.

The weaknesses are mostly **inherited from the Minimal base and from "fork drift"**: ~4,900 lines of
upstream CSS the author now owns but did not write, two parallel colour systems that can drift,
some dead/duplicated declarations, no graph-view or canvas identity, and a couple of real
accessibility defects (notably completed-task opacity). None of these are fatal. With a focused
clean-up pass Praxis can credibly compete with Minimal/Cupertino/Velocity.

**Headline verdict: _Beta → Mostly Ready_** (see [RELEASE-READINESS.md](RELEASE-READINESS.md)).

---

## Phase 1 — Project understanding

### 1.1 Repository structure

```
obsidian-praxis/
├── manifest.json      # name, version, minAppVersion 1.13.0, author, authorUrl — complete
├── theme.css          # 5,815 lines / 212 KB — the entire app theme
├── publish.css        # 1,173 lines /  52 KB — Obsidian Publish companion (standalone)
├── README.md          # user-facing docs (English)
├── LICENSE            # MIT (dual copyright: voitech 2026 + Steph Ango 2020–2024)
├── screenshot.png     # 549 KB marketing screenshot (not referenced by manifest)
├── docs/  scripts/    # empty, untracked (git does not store empty dirs)
└── .claude/settings.local.json  # local hook: auto git add+commit+push on every edit
```

There is **no `theme.json`** — correct. `theme.json`/`obsidian.css` is the *legacy* pre-0.16 theme
format. Modern themes use `manifest.json` + `theme.css`, which Praxis does.

### 1.2 Architecture

Praxis is a **two-layer** stylesheet:

| Layer | Lines | Origin | Character |
|---|---|---|---|
| **Base** | 1–~4945 | Minimal Theme (kepano), lightly customised | Minimal's `--bg1/--bg2/--ui1/--tx1…--ax1` colour scheme; helper classes (`.table-lines`, `.cards`, image grids, full-width media); focus mode; colourful frame; tab variants; plugin compat (Calendar, Dataview, Kanban, Git, Charts…). Many blocks still carry `MIT License | Copyright (c) Stephan Ango` markers. |
| **Praxis overrides** | 4946–5815 | Original | `--praxis-*` design tokens (Fibonacci spacing/radii), Properties styling, the entire custom task-icon system, the semantic callout system, link-underline + title-underline toggles, mobile narrow-viewport overrides, reduced-motion. |

`publish.css` is a **third, independent** stylesheet. It does **not** reuse the base `--bg1/--tx1`
scheme — it defines its own `--praxis-bg-primary/secondary/tertiary` plus a duplicated copy of the
brand palette. It is described as "inspired by Minimal Publish."

**Colour flow (app):** raw hex → `.theme-dark{--bg1…}` / `.theme-light{--bg1…}` → mapped to
semantic Obsidian variables (`--background-primary: var(--bg1)`, `--text-normal: var(--tx1)`, …) →
consumed by rules. This is the canonical Minimal pattern and is **fully compliant** with the
Obsidian guideline "override general variables under `body`, and colours under `.theme-light`/`.theme-dark`."

**Style Settings:** a single inline `@settings` YAML block (lines 32–110) exposes 9 controls:
background contrast (4 options), callout style (3), properties heading, add-property button,
disable active line, disable title underline, disable link underlines, disable colourful headings,
disable custom task icons. Clean and minimal — appropriate scope.

### 1.3 Strengths

1. **Original design system that is more than a re-skin.** Fibonacci spacing (`--praxis-space-1…8`
   = 3/5/8/13/21/34/55/89) and a golden-ratio radius scale are a genuine, coherent identity.
2. **Custom task-icon system (lines 5302–5567)** is the standout feature — 30+ semantic task
   states (`[?]`, `[!]`, `[I]`, `[B]`, `[L]`…) plus a `[0]`–`[9]` progress-bar pill, all driven by
   inline SVG masks and theme-aware colour tokens. Nothing in Minimal/Cupertino/Velocity matches
   this. This is Praxis's competitive moat.
3. **Semantic callout taxonomy (5569–5730)** grouped by meaning (violet=intellectual, teal=positive,
   yellow=inquiry, orange=caution, red=critical, brown=attribution) with a bespoke `[!author]`
   callout and `|noicon` metadata support. Three styles (soft/outlined/minimal) via Style Settings.
4. **Accessibility scaffolding already present:** `:focus-visible` keyboard ring (5136–5143),
   `prefers-reduced-motion` block (5807–5815), link underlines on by default (5293), mobile 44px
   touch-target rule for checkboxes (1319), `color-scheme` set for native date inputs (5213–5219).
5. **Mobile editor gutter safety (5746–5805)** — a thoughtful fix to keep content clear of the
   absolute CodeMirror gutter on phones. Most themes ignore this.
6. **Dark-first warm palette** is distinctive and pleasant; dark-mode contrast is excellent
   (all body/heading/accent ≥ 4.5:1 — see §2.3).
7. **Disciplined `!important` usage** — only 6 in `theme.css`, all inside the reduced-motion block
   where it is the correct tool. This is *better* than most community themes.
8. **No remote assets.** All icons are inline `data:` SVGs; fonts are system stacks. Fully offline,
   guideline-compliant.

### 1.4 Weaknesses (summary; detailed in Phase 2)

1. **Fork debt:** ~4,900 lines of inherited Minimal CSS the author now maintains but did not author.
   Future Obsidian DOM changes will break selectors in code the maintainer may not fully understand.
2. **Two parallel colour systems** (`theme.css --bg1…` vs `publish.css --praxis-bg-*`) with the
   brand hex duplicated → silent drift risk.
3. **No graph-view styling and almost no canvas styling** — two signature Obsidian surfaces left at
   default. A flagship theme is expected to own these.
4. **Light mode is a second-class citizen:** all six colourful headings fail normal-text AA (pass
   only large-text AA), and the accent is marginal for links.
5. **Completed-task opacity 0.2** is an outright readability/contrast failure (1.76:1).
6. **Selector duplication** in the task-icon block (the ~30-item `:is()` list repeated 6×) — a
   maintainability hazard, ~110 lines that should be a fraction of that.
7. **Dead/duplicated declarations** (`--radius-m`, `--radius-l`, `--h1-weight`) and unused tokens.

### 1.5 Technical debt & risky areas

| Area | Risk | Notes |
|---|---|---|
| Inherited Minimal selectors (`.colorful-frame …`, frameless window chains) | **High** | Long descendant chains tightly coupled to Obsidian's workspace DOM; first to break on app updates. |
| Task-icon `:is([data-task=…])` mega-lists | Medium | Any new task glyph requires editing 6 places; easy to desync. |
| Two colour systems | Medium | Brand tweak must be applied in two files by hand. |
| `420pt`/`400px`/`600px` ad-hoc breakpoints | Low–Med | No shared breakpoint tokens; tablet (400–768px) range under-served. |
| Version scheme `26.6.111` | Low | CalVer-ish; fine, but non-obvious and easy to mis-order. |
| `screenshot.png` 549 KB | Low | Heavy for a repo asset; not referenced by manifest. |

---

## Phase 2 — Deep audit

### 2.1 Code problems

**Dead code / duplicated declarations**
- `theme.css:4984` `--radius-m: 13px;` is immediately shadowed by `:4995` `--radius-m: var(--praxis-radius-lg)` (= 21px). The 13px line is **dead**. Same for `--radius-l` (`:4985` and `:4996`, both 21px — redundant).
- `theme.css:147` `--h1-weight: 600;` (and `:148` h2 = 600) are overridden to `500` by `:5000–5001` (`var(--praxis-heading-weight)`). The early values are **dead**; heading weights are defined in two places — no single source of truth.
- **Unused design tokens:** `--praxis-space-1` (3px), `--praxis-space-7`, `--praxis-space-8`, `--praxis-radius-xl` have **zero references**. Defensible as a *complete* scale, but currently undocumented dead weight.

**Selector specificity / duplication**
- The custom-checkbox block (`theme.css:5387–5500`) repeats a ~30-entry `:is([data-task="…"])` list **six times** (`:checked`, `::before`, `::after` × {input, li>input, li>p>input}). ~110 lines that encode the same set of glyphs over and over. Single biggest maintainability liability in the original layer.
- Inherited `.colorful-frame.is-hidden-frameless:not(.praxis-focus-mode) .workspace-split.mod-vertical > * > .workspace-leaf-resize-handle:after` (and siblings) — 4-level descendant chains coupled to internal workspace structure. Fragile against app updates. (Inherited from Minimal.)
- The Obsidian guideline explicitly says "**avoid overly complex selectors targeting specific classes**." The original layer mostly respects this; the inherited base layer does not.

**Cascade / naming**
- Style Settings IDs are **inconsistently namespaced**: `praxis-underline-title-off`, `praxis-links-underlined-off`, `praxis-checkboxes-off`, `praxis-callout-style`, `praxis-background-style` **are** prefixed, but `colorful-headings-off`, `active-line-off`, `metadata-heading-on`, `metadata-add-property-on` **are not** (the latter inherited from Minimal). The body-class hooks therefore mix conventions. ⚠️ **Renaming is breaking** (resets users' saved Style Settings) — fix only with a migration story (v2).
- `body :is(input[data-task="0"]…)` progress rules (`:5530–5539`) are **not** gated behind `:not(.praxis-checkboxes-off)` while the visual rules above them are — harmless (they only set a variable) but inconsistent.

**Invalid / fragile CSS**
- No invalid CSS found. Braces balanced; `var()` fallbacks present where it matters.
- `-webkit-` prefixes (79) are used correctly alongside standard properties (mask, appearance, datetime-edit). Good Safari/iOS hygiene.

**Obsidian API compatibility**
- Uses `:has()` (28×) and `color-mix()` (12×) — both fine on the Electron Chromium shipped with `minAppVersion 1.13.0`, and documented in README. ✅
- Targets current DOM (`.workspace-tab-header-inner-title`, `.metadata-property-value`, `data-task`) — current as of 1.13.x.

### 2.2 Visual consistency

- **Radius:** brand claims "≈13px." Reality: `--radius-s` = 13px, but `--radius-m`/`--radius-l` are remapped to **21px**, and many default Obsidian surfaces consume `--radius-m`. So the *effective* corner radius across the UI is a 13/21 mix, not a single 13px identity. Internally consistent but the README's "13px" framing is imprecise. Tables hard-code `--praxis-radius` (13px); callouts use `--radius-s` (13px); images use 5px. Document the radius scale explicitly.
- **Spacing:** Fibonacci scale is coherent, but `--p-spacing: 1.75rem` (line 206) and `--heading-spacing: 2em` are *not* on the Fibonacci scale — minor inconsistency between the "golden-ratio spacing" claim and reality.
- **Heading hierarchy:** sizes are very compact (`--h1: 1.125em … --h6: 0.85em`; h5/h6 differ only by `variant`, both 0.85em). H5 and H6 are nearly indistinguishable except small-caps. Combined with colourful headings this works, but with colours disabled the hierarchy is weak.
- **Typography identity:** no bundled font; relies on the OS UI/text stack. Good for offline/perf, but undercuts the "strong visual identity" goal — Cupertino leans on SF, Velocity on its serif/spacing. Praxis's identity is carried by colour + spacing, not type.
- **Animations/transitions:** 60 transition/animation declarations; reduced-motion handled globally. Reasonable.
- **Hover states:** consistent via `--background-modifier-hover: var(--bg3)`.

### 2.3 Accessibility (WCAG 2.1)

Computed contrast (sRGB), body bg = `--bg1`:

**Dark mode (`#1d1a17`) — strong:**
| Token | Hex | Ratio | Verdict |
|---|---|---|---|
| tx1 normal | `#efe7d5` | 14.07 | AA/AAA |
| tx2 muted | `#b8a88a` | 7.43 | AAA |
| tx3 faint | `#8c8078` | 4.52 | AA (just) |
| ax1 accent | `#9878e0` | 5.03 | AA |
| H1 red `#d97a40` | | 5.62 | AA |
| H2 orange `#e8975c` | | 7.43 | AAA |
| H3 yellow `#c9a84c` | | 7.58 | AAA |
| H4 green `#5bbfb2` | | 7.87 | AAA |
| H5 blue `#6b9fd4` | | 6.22 | AA |
| H6 purple `#9878e0` | | 5.03 | AA |
| error `#e06f6f` | | 5.50 | AA |
| callout titles on 12% tint | | 4.3–6.4 | AA / AA-large |

**Light mode (`#f7f1e7`) — marginal:**
| Token | Hex | Ratio | Verdict |
|---|---|---|---|
| tx1 / tx2 / tx3 | | 14.9 / 9.2 / 4.65 | AA |
| ax1 accent `#7a60c8` | | **4.31** | ⚠️ below 4.5 for body/link text (mitigated: links underlined) |
| H1 red `#b96830` | | **3.68** | large-text AA only |
| H2 orange `#c47a40` | | **3.01** | large-text AA only (on the edge) |
| H3 yellow `#a08030` | | **3.32** | large-text AA only |
| H4 green `#3a8f84` | | **3.43** | large-text AA only |
| H5 blue `#4a7fb0` | | **3.77** | large-text AA only |
| H6 purple `#7a60c8` | | **4.31** | large-text AA only |

> Headings are "large text," so 3:1 is the *applicable* threshold and they technically pass. But
> H2 orange at **3.01** has no safety margin, and the *whole* light palette being large-text-only
> means any inline coloured text (links, tags using accent) is sub-AA. **Light mode needs a darkening pass.**

**Hard failures:**
- **Completed task `[x]` at `opacity: 0.2` (theme.css:5543)** → effective contrast **1.76:1**. Unreadable; fails even 3:1. Raising to `0.5` → ~4.2:1. **Must fix.**

**Good:**
- Keyboard `:focus-visible` ring (double box-shadow) present and high-contrast (5136).
- `prefers-reduced-motion` honoured (5807).
- Links carry an underline affordance by default → colour is not the sole signal.
- Reduced-motion + zoom: sizes use `em`/`rem`, so browser/OS zoom scales correctly.

**Gaps:**
- No `prefers-contrast: more` handling (the "high contrast" Style Setting is manual, not media-driven).
- Active-line highlight `rgba(255,255,255,.035)` is below any contrast floor (decorative — acceptable).

### 2.4 Performance

- **File size:** `theme.css` 212 KB is **large** for a community theme (Minimal ≈ similar; Cupertino smaller). Much of it is inherited base + the repetitive task block + 30 inline SVG data-URIs. The SVGs are tiny individually but inflate parse size. Not a render problem, but a download/parse cost and a maintenance smell.
- **Selectors:** `:has()` (28×) is the main cost. Most are scoped (`.markdown-source-view.mod-cm6:has(.cm-lineNumbers)`), so style-recalc cost is bounded. The task-icon `:checked` rules apply mask-image — cheap. No expensive universal `:has()`.
- **No `backdrop-filter` / `filter: blur()`** anywhere → no GPU blur cost, no Safari/iOS blur jank. Good.
- **`box-shadow: -25vw 0 …, 25vw 0 …` on the active line (1759)** is a viewport-width shadow painted per active line — a known Minimal trick to fake full-width highlight; it forces a wide paint region on every cursor move. Minor repaint cost; disable-able via Style Settings. Worth a note.
- **Animations** are short and transform/opacity-based; reduced-motion neutralises them.
- **No layout-shift hazards** identified beyond standard image loading.

### 2.5 Subsystem notes

- **Tables (1572–1665):** excellent — rounded container with `overflow:hidden`, edge-cell padding tokens, header styling, Dataview/Sortable overrides, mobile horizontal scroll. Best-in-class.
- **Callouts (5569–5730):** strong semantic system; three styles; `[!author]` and `|noicon`. Brown callout title forced to `--tx2` for contrast — a thoughtful a11y touch.
- **Checkboxes/tasks:** feature-rich (see §1.3) but the implementation is the most duplicated code in the file (§2.1). Completed-task opacity bug (§2.3).
- **Tabs (3440–3760):** multiple variants (modern/square/underline/plain-square) + a tall-bar-compact-tab root layout (5070–5134). Polished, Minimal-derived.
- **Graph view:** **no styling at all.** Relies on Obsidian defaults + accent. Gap.
- **Canvas:** only incidental rules (gutter exclusions, PDF canvas). No canvas card/edge identity. Gap.
- **Sidebars/Properties:** Properties panel is nicely quietened (transparent backgrounds, tight metadata). Good.
- **Mobile:** dedicated ≤400px block + editor-gutter safety + 44px touch targets. Above average. Tablet range (400–768px) thin.
- **Publish (`publish.css`):** standalone, dark+light, own palette, callout parity, reduced-motion. Solid, but see Phase 4.

---

## Phase 3 — Competitive comparison

> Compared against the current public versions of each theme's design approach. Praxis shares
> Minimal's DNA directly (it is a fork), so the Minimal comparison is the most material.

### 3.1 Minimal Theme (kepano)

**What Minimal does better**
- **Architecture & ecosystem:** Minimal is paired with the *Minimal Theme Settings* and *Hider*
  plugins, giving it runtime controls Praxis can only approximate through Style Settings + body
  classes. Its helper-class vocabulary is an established ecosystem (cheatsheets, community snippets).
- **Maintenance:** Minimal is authored by the person who designed Obsidian's variable system, so its
  base tracks app changes fast. Praxis inherits that base but lags upstream fixes by definition.
- **Breadth of tested surfaces:** Minimal has years of community bug reports across plugins/platforms.
- **Discipline:** Minimal's helper classes are documented and stable; Praxis added good ideas on top
  but also some duplication Minimal avoids.

**What Praxis already does better**
- **Visual identity:** Minimal is deliberately neutral/monochrome; Praxis's warm palette + colourful
  headings + semantic callouts give it a stronger, more opinionated personality out of the box.
- **Task system:** Praxis's 30+ semantic task icons + progress pills far exceed Minimal's checkbox set.
- **Callouts:** Praxis ships a richer semantic callout taxonomy and the `[!author]` callout.
- **Built-in accessibility:** explicit `:focus-visible`, reduced-motion, 44px targets are first-class
  in Praxis's original layer.

**What to borrow from Minimal**
- Its **documented, stable helper-class contract** and changelog discipline.
- Its **breakpoint strategy** (`.is-tablet`/`.is-phone` + consistent widths) instead of ad-hoc px.
- Consider a lightweight **companion settings approach** or lean harder on Style Settings parity.

### 3.2 Cupertino (macOS-feel theme)

**Analysis**
- **Typography:** leans on SF Pro / system rounded; tight, Apple-like leading. Praxis is more compact
  and colourful; less "system-native."
- **Colour:** Cupertino is cooler, greyer, more neutral; Praxis is warm and saturated.
- **Visual polish & macOS feeling:** Cupertino nails translucency, vibrancy and native control mimicry
  (sidebar materials, traffic-light alignment). Praxis deliberately avoids blur (perf win) so it feels
  less "macOS," more "editorial."
- **Animations/interaction:** Cupertino uses spring-like easing and subtle vibrancy transitions.

**Worth adapting**
- Cupertino's **refined control/easing curves** and consistent **interaction micro-states** (hover→active
  timing) could sharpen Praxis without adopting blur.
- Its **traffic-light / frameless alignment** polish on macOS (Praxis already has `--top-left-padding-y`
  handling — could go further).

**Do NOT copy**
- Heavy **`backdrop-filter` translucency** — it would erase Praxis's current GPU-cost advantage and
  introduce iOS/Safari jank. Praxis's no-blur stance is a deliberate, defensible differentiator.
- Cupertino's tighter coupling to macOS look on Windows/Linux/mobile.

### 3.3 Velocity (readability-focused theme)

**Analysis**
- **Readability & note width:** Velocity is built around long-form reading — generous measure,
  comfortable leading, restrained colour. Praxis's `--line-width: 44.5rem` and `--line-height: 1.5`
  are good, but its heading sizes are *very* compact and h5/h6 nearly collapse.
- **Typography & hierarchy:** Velocity's heading hierarchy is clearer at a glance; Praxis relies on
  colour to disambiguate levels (fails when colourful headings are off).
- **Minimalist approach:** Velocity is quieter; Praxis is more decorative.

**Worth introducing into Praxis**
- A **stronger size-based heading hierarchy** so levels read even with colour disabled (differentiate
  h5/h6; consider slightly larger h1/h2).
- A **reading-mode line-height / measure** refinement pass for long notes.
- An **optional "quiet" preset** (Style Settings) that tones colour down for distraction-free reading
  — directly competing with Velocity's niche.

**Do NOT copy**
- Velocity's monochrome restraint wholesale — it would erase Praxis's identity. Offer it as a *mode*,
  not the default.

---

## Phase 4 — Official guideline compliance

### 4.1 App theme guidelines
(<https://docs.obsidian.md/Themes/App+themes/Theme+guidelines>)

| Rule | Status | Evidence |
|---|---|---|
| Override general vars under `body`, colours under `.theme-light`/`.theme-dark` | ✅ Pass | `body{…}` token blocks; colours in `.theme-dark`/`.theme-light` (250–316). |
| Avoid overly complex selectors targeting specific classes | ⚠️ Partial | Original layer mostly fine; inherited `.colorful-frame …` and resize-handle chains are deep/fragile. |
| No remote assets (offline) | ✅ Pass | Inline `data:` SVGs; system fonts; no `@font-face`, no remote `url()`. |
| Avoid `!important` (blocks user snippets) | ✅ Pass | Only 6 in theme.css, all in reduced-motion (correct use). |
| Support light **and** dark | ✅ Pass (dark strong, light marginal) | Both defined; light fails some AA (§2.3). |
| Mobile support | ✅ Pass | `.is-phone`/`.is-mobile` rules, 44px targets, gutter safety. |
| Required files (`manifest.json` + `theme.css`) | ✅ Pass | Both present and valid. |
| `manifest.json` fields (name, version, minAppVersion, author) | ✅ Pass | All present; `authorUrl` bonus. |

**Submission readiness note:** community-store listing additionally requires a tagged GitHub release
containing `manifest.json` + `theme.css`, a `screenshot.png` of recommended proportions, and a PR to
`obsidianmd/obsidian-releases`. The repo has a screenshot but release logistics are out of scope here.

### 4.2 Publish theme best practices
(<https://docs.obsidian.md/Themes/Obsidian+Publish+themes/Best+practices+for+Publish+themes>)

| Rule | Status | Evidence |
|---|---|---|
| Prefer CSS variables over complex selectors | ✅ Pass | publish.css is variable-driven. |
| Avoid App-specific selectors/rules; build for Publish from scratch | ✅ Mostly | Standalone file; minimal app-only leakage. |
| Keep `publish.css` small (avoid FOUC / multi-MB) | ✅ Pass | 52 KB, no base64 fonts/images. |
| Conservative CSS features (check caniuse) | ⚠️ Note | Uses `color-mix()`/`:has()` — fine on modern browsers, but Publish visitors may use older browsers; provide fallbacks for critical colours. |
| Responsive breakpoints **1000px** (hide right sidebar) + **750px** (hide both) | ⚠️ **Partial** | publish.css has `@media (max-width:750px)` + a `400pt` query but **no 1000px tier** → the 750–1000px (tablet) range is unstyled relative to the documented layout. |
| Dark **and** light support | ✅ Pass | Both `.theme-dark`/`.theme-light` defined. |
| Maintainability | ⚠️ Note | Brand palette duplicated from theme.css → drift risk. |

---

## Appendix A — Problem inventory (prioritised)

| # | Severity | Area | Issue | Location |
|---|---|---|---|---|
| 1 | **High (a11y)** | Tasks | Completed `[x]` opacity 0.2 → 1.76:1 contrast | theme.css:5543 |
| 2 | High (UX) | Light mode | Colourful headings large-text-AA-only; H2 orange 3.01 | 2786–2797 / .theme-light palette |
| 3 | Medium | Identity | No graph-view styling; canvas unstyled | (absent) |
| 4 | Medium | Maintainability | Task-icon `:is()` list duplicated 6× | 5387–5500 |
| 5 | Medium | Maintainability | Two colour systems, duplicated brand hex | theme.css vs publish.css |
| 6 | Medium | Publish | Missing 1000px breakpoint | publish.css |
| 7 | Low | Dead code | `--radius-m`/`--radius-l` duplicate defs | 4984–4985 |
| 8 | Low | Dead code | `--h1/h2-weight` overridden (no SSOT) | 147–148 / 5000 |
| 9 | Low | Dead code | Unused `--praxis-space-1/7/8`, `--radius-xl` | 4966/4972/4973/4980 |
| 10 | Low | Light a11y | Accent 4.31 marginal for link text | .theme-light |
| 11 | Low | Consistency | Style Settings ID namespacing mixed (breaking to fix) | @settings block |
| 12 | Low | Docs | README "13px" vs effective 13/21 radius mix | README / 4994–4996 |
| 13 | Info | Perf | 212 KB theme.css; viewport-width active-line shadow | overall / 1759 |

See [ROADMAP.md](ROADMAP.md) for sequencing and [IMPLEMENTATION-REPORT.md](IMPLEMENTATION-REPORT.md)
for what was fixed in this pass.
