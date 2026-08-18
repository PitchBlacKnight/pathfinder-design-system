# Pathfinder 2.0 — live demo rig (State Farm interview prep)

Agent-buildable design system demo. Mikel drives it live in interviews: he asks for
components in chat, they appear on a browser stage within a second.

## Run it
- **The server is permanent — do NOT start one.** A LaunchAgent
  (`~/Library/LaunchAgents/com.pitchblacknight.pathfinder.plist`) runs it at login
  and restarts it if it dies. Verify with `curl -s -o /dev/null -w '%{http_code}'
  http://localhost:4173/`. Logs: `/tmp/pathfinder-server.log`.
  Remove with `launchctl unload <plist>` if it's ever unwanted.
- Landing page: http://localhost:4173/ — links to both surfaces
- Stage: http://localhost:4173/stage/ — polls `stage/app.html` every 800ms
- Playground: http://localhost:4173/playground/ — Figma component model
  (variants/props/slots/modes) driving real components
- Purity audit: `./audit.sh` (checks stage/app.html; exit 1 on violations)
- Contrast audit: `./contrast.sh` (WCAG 2.1 across both modes; `--report` never
  exits 1, `--verbose` shows composited RGB). Pairing list lives in
  `tools/contrast.mjs` and is hand-derived from css/pathfinder.css — if a
  component adds a new fg/bg pair, add it there or it goes unchecked.
- Theme: ◐ THEME chip on stage, or `data-theme="light"` on <html> — light mode is
  ~90 semantic overrides at the bottom of `tokens/pathfinder.tokens.css`

## Build rules (full detail in .claude/skills/pathfinder/SKILL.md)
- To show something: Write `stage/app.html` (fragment only). Never edit stage/index.html.
- Token purity is absolute: every visual value is a `--pf*` token reference. No hex,
  no rgb(), no raw font stacks. `./audit.sh` enforces this.
- Recipes in `recipes/` (welcome, data-table, orders-page, desktop, detail, form,
  modal, empty-state, metric-chart) — copy then adapt. Reset ask = welcome.html.
- If token or CSS files change, the stage needs one manual reload (stylesheets load
  once; only the fragment hot-swaps).

## History that matters
- Tokens were renamed `--sap*` → `--pf*` on 2026-08-06. Do NOT reintroduce SAP/Fiori/
  Horizon references anywhere; `tokens/_site-raw.css` is the only permitted trace
  (raw extraction archive, not served).
- `figma-library-map.json` maps tokens to Figma VariableIDs in file 38dpOqgSdfgnc34LOj4TRf.
- Deferred builds (see memory: pathfinder-optional-builds): self-generating /docs/
  page, web component in playground, provenance table. Offer only if usage is healthy.

## Context
- Interview prep hub: ../interview-kit/ (drill-day.md, research-*.md, stephen-stories.html);
  published at guide.mikelrosenthal.com (never share that link with interviewers).
- DEMO-SCRIPT.md in this folder is the run-of-show. Demo etiquette: announce in one
  line, Write, confirm in one line naming tokens/variants. Keep responses tight.
- Mikel is conserving Fable 5 usage until Monday's reset — verify leanly (one
  screenshot, not interaction loops) and flag cost before any sizeable build.
