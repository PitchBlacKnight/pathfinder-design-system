# PATHFINDER DESIGN SYSTEM 2.0 — Agentic Demo Framework

AVANT Communications Partner Portal design system, rebuilt as a live,
agent-buildable component framework. Dark-theme token suite, extracted 1:1 from the published spec site:
https://flyer-topaz-40707494.figma.site

## What this is

- **866 design tokens** (`tokens/pathfinder.tokens.css`) — every `--pf*` and
  `--pf-*` custom property from the spec site, byte-exact.
- **A token-pure component library** (`css/pathfinder.css` + `js/pathfinder.js`)
  — buttons, badges, data table, modal, cards, stat tiles, fields, toggle,
  progress, avatars, tabs, toasts, and a responsive app shell. Zero hardcoded
  colors; zero dependencies; no build step.
- **A live stage** (`stage/`) — a browser canvas that hot-swaps whatever Claude
  writes to `stage/app.html` onto the screen within ~1s, with an entrance
  animation and a pulsing LIVE indicator. The AVANT network image sits behind
  everything at 20% opacity (`stage/assets/bg-network.jpg`); the app shell and
  main content area are transparent on the stage, and the sidenav/topbar are
  78% translucent with a blur, so the texture reads through full assemblies.
  Data surfaces — cards, tables, modals — keep their own token backgrounds.
- **An agent skill** (`.claude/skills/pathfinder/SKILL.md`) — teaches Claude the
  tokens, component anatomy, spec-site rules (max 7 table columns, mono for
  data, always a Cancel path…), and the recipe book.
- **Recipes** (`recipes/`) — reference builds: data table, modal set, and the
  full "assemble a desktop" dashboard.

## Developer handoff

`handoff/index.html` is the developer spec for the Figma library: setup, token
tiers, every component's classes and Figma-to-code mapping, behavior hooks,
accessibility baseline, floorplan references and known gaps. Figma component
descriptions and floorplan notes link to it. Edit `handoff/components.json`,
then rebuild: `python3 tools/build-handoff.py handoff/components.json handoff/index.html`.

## Fully self-contained

The stage makes **zero external network requests**. Inter, Barlow Condensed and
JetBrains Mono are vendored in `fonts/` (latin subset, 121 KB total) and declared
in `css/pathfinder.fonts.css` — Inter and JetBrains Mono are variable fonts, so
each ships as one file with a weight range. The demo renders identically with the
network switched off, which matters when venue wifi is unreliable.

CSS and JS are cache-busted per page load, so the browser can never serve a stale
copy of the library after an edit.

## Quick start

```bash
cd pathfinder-2.0 && python3 -m http.server 4173 --directory .
```

Open http://localhost:4173/stage/ — then, in a Claude Code session in this
directory, say things like:

- "Give me a Pathfinder data table"
- "Open a danger modal confirming deletion"
- "Make the table compact and striped"
- **"Assemble a desktop"**

See `DEMO-SCRIPT.md` for the full interview run-of-show.

## Design decisions (the 2026 story)

- **Tokens are the API.** Components consume `var(--pf*)` exclusively, so
  retheming (light mode, a second brand) is a token-file swap.
- **Figma and code share one light theme.** The Figma library (2026-10-04)
  takes its Light values from this repo first. Tokens that exist only in Figma
  ship in `tokens/pathfinder.figma-additions.css`, which loads after the token
  file and is covered by `./contrast.sh`.
- **Declarative behavior.** Interactivity is wired by data attributes
  (`data-sort`, `data-modal-open`, `data-toast`) with one delegated listener —
  so HTML injected at runtime by an agent Just Works, no hydration.
- **The agent is a first-class consumer.** The skill encodes the same usage
  rules the spec site gives human engineers. Same system, two audiences.
- **Accessible by default.** `role="dialog"`, `aria-modal`, focus trap/restore,
  `aria-sort`, `aria-selected`, visible `:focus-visible` rings, WCAG-friendly
  text tokens on every surface.
- **Responsive by breakpoint tokens.** `--pfBreakpoint_*` drives the grid:
  sidenav collapses under 1024px, tile grids restack under 600px, tables
  scroll within their container.
