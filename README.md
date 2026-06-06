# Praxis

Praxis is a warm, focused Obsidian theme built from Minimal's proven foundation and shaped around a compact Praxis design system. It supports light and dark mode, but it is intentionally designed as a dark-first theme. It includes an Obsidian Publish companion stylesheet and keeps the Minimal-style helper classes that make notes, tables, image galleries, dashboards, and Dataview views easier to compose.

![Praxis screenshot](screenshot.png)

## About Praxis

- [Features](#features)
- [Install](#install)
- [Style Settings](#style-settings)
- [Helper classes](#helper-classes)
- [Obsidian Publish](#obsidian-publish)
- [Credits and license](#credits-and-license)

## Features

- Dark-first warm palette with a light mode fallback and a true black dark variant
- Compact interface spacing based on a Fibonacci scale
- Minimal-compatible helper classes for tables, images, iframes, maps, charts, cards, and page width
- Card layouts for tables, Dataview-style tables, and list-based galleries
- Image grids and image filters for visual notes
- Custom task icons for extended checkbox states
- Soft, outlined, and minimal callout styles
- Custom `[!author]` callout and `|noicon` callout metadata support
- Polished Properties styling for a quieter metadata panel
- Lightweight `publish.css` for Obsidian Publish

## Install

1. Create a folder named `Praxis` in your vault at `.obsidian/themes/Praxis`.
2. Add `theme.css` and `manifest.json` to that folder.
3. Open Obsidian Settings -> Appearance -> Themes and select `Praxis`.

### Install with BRAT

BRAT can install Praxis directly from GitHub while the theme is in beta or before it is listed in the community theme catalog.

1. Install and enable the `BRAT` community plugin.
2. Open BRAT settings and add this repository as a beta theme: `https://github.com/voi-tech/obsidian-praxis`.
3. Open Obsidian Settings -> Appearance -> Themes and select `Praxis`.

Praxis targets Obsidian 1.13.0 or newer and works on desktop and mobile. It uses modern CSS selectors, including `:has()`, for Minimal-compatible media and table helpers.

## Style Settings

Praxis works without plugins, and its Style Settings-backed features are enabled by default in the base theme. If you install the optional [Style Settings](https://github.com/mgmeyers/obsidian-style-settings) community plugin, Praxis exposes a small set of controls for the same defaults:

- background contrast
- callout style
- Properties heading and Add property visibility
- active line highlighting
- title and H1 underline
- link underlines

Praxis intentionally does not mirror the full Minimal Style Settings surface. Broader typography, color, and layout preferences should be managed through Obsidian's built-in Appearance settings or custom snippets.

## Helper Classes

Add helper classes with the `cssclasses` property in your note:

```yaml
---
cssclasses:
  - cards
  - table-wide
---
```

### Page Width

- `wide` expands the readable line width
- `max` expands content to the maximum available width

### Tables

- Width: `table-100`, `table-full`, `table-wide`, `table-max`
- Text: `table-small`, `table-tiny`, `table-nowrap`, `table-wrap`, `table-tabular`
- Layout: `table-center`, `table-lines`, `table-numbers`
- Rows and columns: `row-hover`, `row-alt`, `row-lines`, `row-lines-off`, `col-alt`, `col-lines`
- Fixed first column helpers: `table-col-1-150`, `table-col-1-200`

### Cards

- `cards` turns compatible tables into card grids
- `list-cards` turns top-level lists into card grids
- `cards-cover` crops images to fill their card image area
- `cards-align-bottom` pushes the last card field to the bottom
- `cards-16-9`, `cards-1-1`, `cards-2-1`, `cards-2-3` set image aspect ratios
- `cards-cols-1` through `cards-cols-8` force a specific number of columns

### Media

- Images: `img-100`, `img-wide`, `img-max`, `img-grid`, `img-grid-ratio`
- Iframes: `iframe-100`, `iframe-wide`, `iframe-max`
- Maps: `map-100`, `map-wide`, `map-max`
- Charts: `chart-100`, `chart-wide`, `chart-max`

### Image Filters

Add these suffixes to image embeds:

- `#outline` adds a subtle border
- `#interface` adds a framed interface treatment
- `#invert` inverts images in dark mode
- `#invertW` inverts images in light mode
- `#circle` crops the image into a circle

### Titles

- `hide-title` hides the inline title
- `alt-title` hides the inline title for notes that provide their own first heading
- `h1-borders` adds a divider treatment to H1 headings

### Tasks And Callouts

Praxis includes custom task icons for `/`, `-`, `>`, `<`, `?`, `!`, `*`, quote, `l`, `b`, `i`, `S`, `I`, `p`, `c`, `f`, `k`, `w`, `u`, `d`, `+`, `B`, `a`, `n`, `R`, `t`, `P`, and `L`.

It also supports `[0]` through `[9]` task states as horizontal progress bars, from empty (`[0]`) to full (`[9]`).

Callouts use Lucide-based icons. The custom `[!author]` callout is styled for quotes and attributions. Add `|noicon` metadata to a callout to hide its icon.

## Obsidian Publish

`publish.css` is a companion stylesheet for Obsidian Publish. It shares Praxis colors, typography, callouts, cards, table helpers, image helpers, and media width helpers while staying separate from the app theme.

To use it, publish `publish.css` at the root of your Publish vault. Style Settings does not run on Obsidian Publish, so Publish customization should be done directly through CSS variables in `publish.css`.

## Credits And License

Praxis is a fork and substantial adaptation of [Minimal](https://github.com/kepano/obsidian-minimal) by Steph Ango. It uses Minimal as its foundation for Obsidian app structure, helper classes, compatibility patterns, and Publish-oriented thinking, then adds the Praxis design layer: warm palettes, compact spacing, task treatments, callout styling, Properties refinements, and a companion `publish.css`.

Minimal is released under the MIT License. Praxis preserves the copyright and license notice in `theme.css` and is also released under the MIT License.

If Praxis is useful to you, please also [support the original Minimal project](https://www.buymeacoffee.com/kepano).
