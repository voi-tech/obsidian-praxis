# Praxis Card UI Redesign Implementation Report

## Files Changed

- `theme.css` — added the card token vocabulary, refactored existing surfaces to semantic variables, added default floating card surfaces, translucent-window handling, and accessibility fallbacks.
- `publish.css` — added matching card radius/surface/elevation tokens and moved Publish surfaces onto the same vocabulary without frosted translucency.
- `README.md` — documented the new card-based default direction, translucency behavior, compatibility, and Publish split.
- `IMPLEMENTATION-REPORT.md` — records the implementation scope and verification notes.

## Token Changes

`theme.css` now defines semantic radius aliases:

- `--praxis-radius-control`
- `--praxis-radius-card`
- `--praxis-radius-panel`
- `--praxis-radius-modal`

It also defines card/floating/modal elevation tokens:

- `--praxis-elevation-card`
- `--praxis-elevation-floating`
- `--praxis-elevation-modal`

Dark and light mode now expose the surface hierarchy:

- `--praxis-surface-1`
- `--praxis-surface-2`
- `--praxis-surface-3`
- `--praxis-surface-card`
- `--praxis-surface-elevated`
- `--praxis-surface-floating`
- `--praxis-surface-modal`

Translucency is isolated to:

- `--praxis-surface-translucent`
- `--praxis-surface-translucent-strong`
- `--praxis-border-translucent`
- `--praxis-backdrop-blur`

`publish.css` mirrors the radius, surface, and elevation vocabulary that applies to Publish surfaces, excluding all translucency and blur tokens.

## Selector Changes

Existing surfaces moved to tokens:

- `--tab-radius` and `--tab-radius-active`
- app and Publish tables
- app and Publish callouts, including `[!author]`
- app graph controls
- app canvas node containers
- Style Settings level-2 containers
- hider ribbon floating pill
- Publish cards, interface images, code blocks, and canvas node radius

New floating card containers in `theme.css`:

- `.modal`
- `.menu`
- `.suggestion-container`
- `.prompt`

Rounded row treatments without added elevation:

- `.nav-file-title`
- `.nav-folder-title`
- `.tree-item-self`
- `.suggestion-item`
- `.menu-item`
- `.search-result-file-title`
- `.search-result-file-match`
- backlink and outgoing-link pane rows

Static sidebar shells stay flush, with `.mod-left-split` and `.mod-right-split` using `--praxis-surface-2` as a background layer.

## Design Rationale

The redesign makes card UI the default language without adding a Style Settings toggle. The implementation uses a two-layer vocabulary: semantic radii/elevation tokens and semantic surface tokens. Selectors consume those tokens instead of hard-coded colors or one-off shadows.

Static surfaces remain restrained: sidebars and repeated rows use background layers and radii, not shadows. Floating surfaces carry the visible elevation so modals, menus, suggestions, prompts, graph controls, and the floating status bar read as lifted without making dense lists expensive or noisy.

The editor, reading surface, inline title, and Properties remain unframed by design.

## Accessibility, Performance, And Mobile

- `prefers-contrast: more` strengthens existing border/divider tokens and disables blur for translucent surfaces.
- `prefers-reduced-transparency: reduce` restores solid floating/modal surfaces and disables backdrop filters.
- Focus-visible rings were extended to menu, suggestion, nav, tree, and button controls.
- Backdrop filtering is scoped to `body:not(.is-mobile).is-translucent` and only targets floating chrome containers.
- Mobile drawers are not frosted, keeping mobile sidebars solid and predictable.
- True-black contrast disables blur and uses a stronger translucent rim color to avoid muddy glass on black.

## Publish Notes

Publish receives the same card vocabulary for radii, surfaces, and elevation. Publish tables, cards, callouts, code blocks, interface images, author callouts, and canvas node radius now reference those tokens. Publish intentionally has no frosted translucency layer because it does not share Obsidian's native translucent window state.

## Verification

Completed local checks:

- `git diff --check` passed.
- `theme.css` and `publish.css` have balanced braces.
- `postcss.parse()` passed for `theme.css` and `publish.css`.

Obsidian CLI checks were attempted with `obsidian help`, `obsidian dev:errors`, and `obsidian dev:console level=error`. Each command exited with code 134 and no output in this session, so live reload, error capture, and screenshot matrix verification could not be completed here.

The Obsidian CLI checks were then rerun outside the sandbox:

- `obsidian dev:errors` reported `No errors captured.`
- `obsidian dev:debug on` attached the debugger and started console capture.
- `obsidian dev:console level=error` reported `No console messages captured.`
- `obsidian dev:screenshot path=/private/tmp/praxis-card-ui-check.png` produced a valid screenshot of the current dark desktop workspace.

The full requested dark/light x opaque/translucent x desktop/mobile screenshot matrix was not completed in this pass.

## Remaining Risks

- Visual validation still depends on a running Obsidian instance with representative panes open.
- Exact menu/prompt appearance can vary by Obsidian version and plugins that inject additional menu content.
- `prefers-reduced-transparency` support varies by engine, but the high-contrast fallback and normal opaque mode remain solid.
