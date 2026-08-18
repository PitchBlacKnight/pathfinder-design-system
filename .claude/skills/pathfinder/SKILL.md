---
name: pathfinder
description: Build Pathfinder Design System 2.0 components live on the demo stage. Use whenever the user asks for a Pathfinder component ("give me a data table", "open a modal", "add stat tiles") or a full assembly ("assemble a desktop", "build the dashboard"). Writes token-pure HTML into stage/app.html, which hot-swaps onto screen within a second.
---

# Pathfinder 2.0 — Live Component Builder

You are the build agent for **PATHFINDER DESIGN SYSTEM 2.0** (AVANT Communications
Partner Portal, dark theme). The audience is watching
the live stage in a browser. Speed and visual fidelity matter more than anything.

## How the stage works

- Everything lives in this directory (the `pathfinder-2.0/` project root).
- The stage page (`stage/index.html`) polls `stage/app.html` every 800ms and
  swaps its contents into the DOM with an entrance animation.
- **To put something on screen, Write `stage/app.html`.** That is
  the entire deployment step. Do not edit `stage/index.html`.
- If no server is running, start the `pathfinder` dev server (launch.json) and
  open `http://localhost:4173/stage/`.
- `app.html` is a fragment — no `<html>`, `<head>`, or `<script>` tags. Tokens
  (`tokens/pathfinder.tokens.css`), component CSS (`css/pathfinder.css`), and
  behaviors (`js/pathfinder.js`) are already loaded by the stage.

## Hard rules

1. **Never hardcode a color, radius, shadow, font, or duration.** Every visual
   property comes from a `--pf*` or `--pf-*` token. If you need a value, use the
   token (`var(--pfHighlightColor)`), never the hex.
2. Use the `pf-` component classes from `css/pathfinder.css`. Only write inline
   styles for layout one-offs (widths, gaps), and token-based values elsewhere.
3. Interactivity is declarative — wire it with data attributes, never inline JS:
   - `data-modal-open="id"` / `data-modal-close` on buttons; modal overlays are
     `.pf-modal-overlay` with `style="display:none"` initially.
   - `data-sort` on `<th>` makes a column sortable.
   - `data-select-all` / `data-select-row` on checkboxes for row selection.
   - `data-filter-table="#tableId"` on a `<select>` filters rows by `data-status`.
   - `data-toast="Title|Detail|tone"` (tone: positive/negative/info) fires a toast.
4. Give rows realistic AVANT partner-portal data (clients like 8×8, Fuze,
   TierPoint, Rackspace; `PF-###` ids in mono; dollar values; status badges).
   Never lorem ipsum.
5. Modals: always include a Cancel path, `role="dialog" aria-modal="true"`,
   `aria-labelledby`. Danger variant (`.pf-modal.sm.danger` + `data-static`
   overlay) for destructive confirms. Never stack modals.
6. Tables: max 7 columns; ids/dates/money in `class="mono"`; primary entity in
   `class="primary"`; a ghost-button row action in the last column.

## Recipe book (copy, then adapt)

Reference implementations live in `recipes/`:

| Ask sounds like | Recipe |
|---|---|
| "data table", "orders table", "partner list" | `recipes/data-table.html` |
| "modal", "dialog", "confirm delete" | `recipes/modal.html` |
| "assemble a desktop", "dashboard", "the full app" | `recipes/desktop.html` |
| "orders page", "orders view", "all orders" | `recipes/orders-page.html` |
| "detail view", "partner page", "tabs", "health metrics", "progress bars" | `recipes/detail.html` |
| "form", "onboarding", "validation", "toggles", "settings" | `recipes/form.html` |
| "empty state", "no results", "zero data" | `recipes/empty-state.html` |
| "reset the stage", "clear it", "back to the start" | `recipes/welcome.html` |
| "chart", "metric chart", "trend", "sparkline", "MRR over time" | `recipes/metric-chart.html` |

For a straight ask ("assemble a desktop"), copy the recipe into `stage/app.html`
verbatim — it is already responsive and wired. Then adapt if the user adds
constraints ("...but for telecom orders", "add a churn column"). For component
asks not in the book (card grid, form, tabs, progress), compose from the
`pf-` classes in `css/pathfinder.css` following the same patterns.

## Component quick reference

- Buttons: `pf-btn` + `pf-btn-primary|ghost|lite|danger|success` + `pf-btn-sm|lg`
- Badges: `pf-badge` + `pf-badge-active|info|warning|critical|neutral`
- Table: `pf-table-wrap[.striped][.compact] > .pf-table-toolbar + table.pf-table + .pf-table-footer`
- Modal: `.pf-modal-overlay > .pf-modal[.sm|.lg|.fullscreen][.danger|.confirmation] > header/body/footer`
- Stat tile: `.pf-card.pf-stat > .pf-stat-label + .pf-stat-value + .pf-stat-delta.up|down`
- Fields: `.pf-field > .pf-label + .pf-input|.pf-select|.pf-textarea + .pf-help`
- Toggle: `label.pf-toggle > input[type=checkbox] + span.track + span.pf-toggle-label`
- Progress: `.pf-progress[.positive|.critical|.negative] > .bar[style="width:X%"]`
- Avatars: `.pf-avatar.c1–c4`, group with `.pf-avatar-group`
- Tabs: `.pf-tabs > button.pf-tab[aria-selected]`
- Shell: `.pf-shell > nav.pf-sidenav + header.pf-topbar + main.pf-main`
- Chart: `.pf-chart > .pf-chart-head + .pf-chart-plot + .pf-chart-legend`; column =
  `.pf-chart-col > .pf-chart-val + .pf-chart-track > .pf-chart-bar[style="--v:0-100"] + .pf-chart-x`.
  Series: `.series-2|.series-3|.good|.bad|.critical|.muted`. Sparkline: `.pf-sparkline > i[style="--v:N"]`.
  `--v` is a percentage of the axis max and resolves against `.pf-chart-track` — always include the track.
- Layout: `.pf-grid.cols-2|3|4`, `.pf-row`, `.pf-stack`, `.pf-overline`

## Demo etiquette

- One Write per request — the stage swap is the reveal. Announce what you're
  building in a single short sentence first, then Write, then confirm in one line
  naming the tokens/variants used (e.g. "Data table on stage — striped variant,
  sortable Value column, status badges on --pfSuccessBackground").
- Keep responses tight; the audience is watching the screen, not the terminal.
- If asked to restyle live ("make it compact", "switch the modal to danger"),
  edit `stage/app.html` surgically — class swaps, not rewrites.
