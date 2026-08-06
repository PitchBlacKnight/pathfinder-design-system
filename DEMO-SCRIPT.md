# PATHFINDER 2.0 — Live Demo Run-of-Show

A 6–8 minute agentic-AI demo: you talk to Claude, components appear on screen
within a second. Works live in a room, on Zoom, or as a recorded Loom.

---

## Screen setup (before anyone joins)

1. **Left half:** terminal (or Claude Code desktop app) opened in `pathfinder-2.0/`.
2. **Right half:** browser at **http://localhost:4173/stage/** — the dark
   "Pathfinder 2.0" welcome screen with the pulsing **PATHFINDER LIVE** chip.
3. Warm up the server ahead of time: ask Claude to "start the pathfinder server",
   or run:

```bash
python3 -m http.server 4173 --directory .
```

4. Optional third window: the published spec site
   (https://flyer-topaz-40707494.figma.site) to show the source of truth.

The stage polls `stage/app.html` every 800ms — whatever Claude writes there
animates onto the screen. **No refresh, no build step.** The LIVE chip pulses
blue on every swap, which reads great on camera.

---

## The narrative (what you're actually demonstrating)

> "Pathfinder 2.0 is our design system — 866 tokens on SAP Fiori Horizon, dark
> theme. I've taught it to Claude as an *agent skill*: the tokens, the component
> anatomy, the do's and don'ts from our spec site. So instead of hand-coding, I
> direct. Watch."

Three beats: **single component → live iteration → full assembly.**

---

## Beat 1 — Component on demand (~2 min)

Say to Claude:

> **"Give me a Pathfinder data table of partner orders."**

While it builds (5–15s), narrate: *"It's not free-styling — it's following the
system: JetBrains Mono for IDs and money, status badges paired with icons never
color alone, max 7 columns, ghost-button row actions. Those rules live in the
skill, pulled straight from our spec site."*

When it lands: click a column header (**it sorts**), check a row (**it
selects**), filter by status (**rows hide**). *"Every color on this screen is a
token reference. There isn't a hex code in that file."*

## Beat 2 — Live iteration (~1.5 min)

> **"Make it compact and striped, and add a churn-risk column."**

*"This is the agentic part — I'm art-directing, not coding. It edits the classes,
the variant system does the rest."*

Then:

> **"Now give me a danger modal confirming deletion of the Vistro project."**

Open it. Point out: blurred overlay, focus trapped, Escape works, overlay-click
is *disabled* because destructive confirms require an explicit button — that's a
system rule, not an accident.

## Beat 3 — The showstopper (~1 min)

> **"Assemble a desktop."**

The full partner-portal dashboard composes itself: shell, sidenav, topbar,
four stat tiles, the orders table, a New Partner modal behind the primary
button. Click **+ New Partner** → modal → **Create Partner** → toast confirms.

Close: *"Component library in Figma, token file in code, and an agent that
speaks both. That's what a design system is in 2026 — not a sticker sheet, an
API that humans and AI both build with."*

---

## Prompts cheat-sheet (say any of these)

| You say | What happens |
|---|---|
| "Give me a data table" | Sortable/selectable/filterable orders table |
| "Open a modal" / "danger modal for deleting X" | Modal variants on stage |
| "Add stat tiles" | KPI tile row |
| "Make it compact / striped" | Live variant swap |
| "Assemble a desktop" | Full dashboard composition |
| "Reset the stage" | Back to the welcome screen |

## Recovery moves (if something goes sideways)

- **Stage looks stale:** the browser polls every 800ms — it's almost never
  stale; hard-refresh once if needed.
- **Claude is slow mid-demo:** keep narrating the system rules; the reveal
  animation covers the landing.
- **Total emergency:** `cp recipes/desktop.html stage/app.html` in the terminal
  puts the finale on screen in one second. The recipes folder is your
  understudy cast.

## Files that make it work

```
pathfinder-2.0/
├── tokens/pathfinder.tokens.css   ← 866 SAP Horizon tokens, extracted 1:1 from the spec site
├── css/pathfinder.css             ← the pf- component library (token-pure)
├── js/pathfinder.js               ← declarative behaviors + the live hot-swap loop
├── stage/index.html               ← the stage (never edited during demos)
├── stage/app.html                 ← THE live surface — Claude writes here
├── recipes/                       ← reference builds: data-table, modal, desktop
└── .claude/skills/pathfinder/     ← the agent skill: rules, recipes, etiquette
```
