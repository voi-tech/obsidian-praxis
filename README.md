# @voitech/obsidian-praxis

Praxis theme for Obsidian and Obsidian Publish.

The app theme lives in `theme.css`. The Publish theme lives in `publish.css` and is based on `obsidian-minimal-publish` by Steph Ango, released under the MIT license.

## Install in Obsidian

1. Create a folder named `Praxis` in your vault at `.obsidian/themes/Praxis`.
2. Copy `theme.css` and `manifest.json` into that folder.
3. Open Obsidian Settings -> Appearance -> Themes and select `Praxis`.

The theme supports light and dark modes. It prefers Geist and Geist Mono when available, then falls back to Inter, system sans fonts, and system monospace fonts.

## Publish

`publish.css` is the package-owned copy for Obsidian Publish. It preserves the current Minimal Publish behavior used by the vault: compact typography, warm paper colors, purple accents, table helpers, cards, list cards, image grids, image zoom hooks, and callout colors.

To sync the package copy to the default vault path:

```sh
node scripts/sync-publish.mjs
```

To sync somewhere else:

```sh
OBSIDIAN_PUBLISH_CSS="/path/to/vault/publish.css" node scripts/sync-publish.mjs
```

## Helper Classes

The app theme carries over the Publish helper classes that are useful inside Obsidian:

- `hide-title`, `alt-title`, `h1-borders`
- `table-100`, `table-full`, `table-small`, `table-tiny`, `table-nowrap`, `table-lines`, `table-numbers`, `row-hover`, `row-alt`, `col-alt`, `col-lines`
- `cards`, `list-cards`, `cards-16-9`, `cards-1-1`, `cards-2-1`, `cards-2-3`, `cards-cols-1` through `cards-cols-8`, `cards-cover`, `cards-align-bottom`
- `img-grid`, `img-grid-ratio`, `img-zoom`
- image suffixes `#outline`, `#interface`, `#invert`, `#invertW`, and `#circle`

Some helpers depend on Obsidian's rendered Markdown structure and modern CSS selector support such as `:has()`.

## Validate

Run the package validation directly with Node:

```sh
node scripts/validate-theme.mjs
```

If the workspace package manager is available:

```sh
pnpm build
```

The validator checks required files, manifest fields, app theme markers, and the presence of the Publish CSS surface.
