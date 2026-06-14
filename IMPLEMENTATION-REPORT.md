# Praxis Card UI Redesign Implementation Report

## Files Changed

- `theme.css` — added the Card Layout 2.0 token vocabulary, workspace shell card, side-pane content cards, carded search/backlink surfaces, Properties sidebar cards, settings cards, stronger helper cards, translucent-window handling, and accessibility fallbacks.
- `publish.css` — added matching card radius/surface/elevation tokens and moved Publish cards onto the same vocabulary without frosted translucency.
- `README.md` — documented the stronger default card direction, translucency behavior, compatibility, and Publish split.
- `IMPLEMENTATION-REPORT.md` — records the implementation scope and verification notes.

## Token Changes

`theme.css` now defines semantic radius aliases:

- `--praxis-radius-control`
- `--praxis-radius-card`
- `--praxis-radius-panel`
- `--praxis-radius-modal`
- `--praxis-radius-workspace`

It also defines card/floating/modal elevation tokens:

- `--praxis-elevation-card`
- `--praxis-elevation-floating`
- `--praxis-elevation-modal`
- `--praxis-elevation-workspace`

Dark and light mode now expose the surface hierarchy:

- `--praxis-surface-1`
- `--praxis-surface-2`
- `--praxis-surface-3`
- `--praxis-surface-card`
- `--praxis-surface-panel-card`
- `--praxis-surface-workspace`
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
- app and Publish cards/list-cards, including default card backgrounds
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

New structural card containers in `theme.css`:

- desktop root workspace tab containers
- side-pane `nav-header` and `view-content` surfaces
- side-pane `.metadata-container` for Properties
- `.search-result-file-matches`
- settings modal `.setting-item` rows and Style Settings section containers

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

The redesign makes card UI the default language without adding a Style Settings toggle. The second pass moves beyond tokenized floating surfaces and makes the high-visibility chrome read as cards: the root workspace gets a shell card, sidebars keep flush shells but card their contents, and search/backlink/settings surfaces become visible card groups.

The implementation uses a two-layer vocabulary: semantic radii/elevation tokens and semantic surface tokens. Selectors consume those tokens instead of hard-coded colors or one-off shadows.

Static repeated rows remain restrained: nav rows, tree rows, menu items, suggestion items, and search matches use background layers and radii, not shadows. Floating surfaces and real content cards carry visible elevation. The editor, reading surface, and inline title remain unframed inside the workspace shell. Properties are carded in sidebars, while in-note metadata stays quieter.

## Accessibility, Performance, And Mobile

- `prefers-contrast: more` strengthens existing border/divider tokens and disables blur for translucent surfaces.
- `prefers-reduced-transparency: reduce` restores solid floating/modal surfaces and disables backdrop filters.
- Focus-visible rings were extended to menu, suggestion, nav, tree, and button controls.
- Backdrop filtering is scoped to `body:not(.is-mobile).is-translucent` and only targets floating chrome containers.
- Mobile drawers are not frosted, keeping mobile sidebars solid and predictable.
- True-black contrast disables blur and uses a stronger translucent rim color to avoid muddy glass on black.

## Publish Notes

Publish receives the same card vocabulary for radii, surfaces, and elevation. Publish tables, cards/list-cards, callouts, code blocks, interface images, author callouts, and canvas node radius now reference those tokens. Publish intentionally has no frosted translucency layer because it does not share Obsidian's native translucent window state.

## Verification

Completed local checks:

- `git diff --check` passed.
- `theme.css` and `publish.css` have balanced braces.
- `postcss.parse()` passed for `theme.css` and `publish.css`.

Obsidian CLI checks were attempted inside the sandbox and exited with code 134, so the live checks were rerun outside the sandbox:

- `obsidian dev:errors` reported `No errors captured.`
- `obsidian eval code="app.customCss.setTheme(app.customCss.theme)"` reloaded the active theme.
- `obsidian dev:debug on` attached the debugger and started console capture.
- `obsidian dev:console level=error` reported `No console messages captured.`
- `obsidian dev:screenshot path=/private/tmp/praxis-card-layout-2-final.png` produced a valid screenshot of the current dark desktop workspace.
- `obsidian eval code="app.customCss.theme"` reported the active theme as `Praxis`.

The running Obsidian instance did not expose the new Card Layout 2.0 rules in loaded `document.styleSheets`, so the screenshot validates the running app had no captured errors but does not visually validate this repo copy of `theme.css`. The full requested dark/light x opaque/translucent x desktop/mobile screenshot matrix was not completed in this pass.

## Remaining Risks

- Visual validation still depends on a running Obsidian instance with representative panes open.
- Exact menu/prompt appearance can vary by Obsidian version and plugins that inject additional menu content.
- Sidebar content cards may need small per-pane spacing adjustments after visual review in vaults with unusually dense plugins.
- The workspace shell is scoped away from focus mode so existing focus-mode chrome can keep winning.
- `prefers-reduced-transparency` support varies by engine, but the high-contrast fallback and normal opaque mode remain solid.
