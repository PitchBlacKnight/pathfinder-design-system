# PROMPTS — exactly what to type, in order

Type these verbatim. Everything in **A** and **B** is proven — every one of them has
been run and verified. **C** is composed on the fly (also proven, but slower, 10–20s).
**D** are recovery lines.

Rule for all of it: **type the ask, then look at the screen, not the terminal.**
Narrate while it builds. The silence while you read your own screen is the only thing
that reads as fumbling.

---

## A · THE CORE THREE (this is the demo — 5 minutes)

### A1 — open on a component
```
Give me a Pathfinder data table of partner orders.
```
**While it builds:** "It's not free-styling — it's following the system. Mono for IDs
and money, status badges always paired with a word, never colour alone, max seven
columns. Those rules live in a skill file, not in my prompt."

**When it lands — touch it:** click the VALUE header (sorts), tick two rows, filter to
In Progress. Then: *"Every colour on this screen is a token reference. There isn't a
hex code in that file."*

### A2 — iterate (this is the beat that proves it's a system)
```
Make it compact and striped, and add a churn-risk column.
```
**While it builds:** "This is the part I want you to see — I'm art-directing, not
coding. It swaps two classes and the variant system does the rest."

**When it lands:** point at the churn badges. *"Watch what it did with the new column
— Low, Medium, High reuse the same three semantic tones the status column already
uses. It didn't invent a colour for a new concept, because it can't."*

### A3 — assemble
```
Assemble the desktop.
```
**While it builds:** "Same components, composed."

**When it lands:** *"Nothing new was designed just now. The table you watched me build
is the same component sitting in that shell. That's what a system means — the
dashboard is composition, not creation."* Then click **+ New Partner** → modal opens →
**Create partner** → toast fires. *"Click anything. It all works."*

---

## B · IF HE WANTS MORE (all one-second recipes)

Pick by what he asks about. Any of these is safe.

| He says | You type |
|---|---|
| "what about a record view?" | `Give me a partner detail view.` |
| "how do you handle lists?" | `Build the orders page.` |
| "what about forms / validation?" | `Show me a form with validation.` |
| "confirmations? destructive actions?" | `Show me a confirm-delete modal.` |
| "what about no data?" | `Show me the empty state.` |
| starting over | `Reset the stage.` |

**Best line for the empty state:** *"Empty states are how you tell whether someone has
actually shipped a product. It's the screen everybody skips."*

---

## C · THE SHOW-OFF (composed live, 10–20s — use ONE, not all)

Only reach for these if it's going well and he's engaged. They're slower because
nothing is pre-baked — which is exactly the point, and worth saying out loud.

```
Build the Partners page as a card directory.
```
```
Show me the analytics page.
```
```
Build a desktop with an activity feed, a churn watchlist, and open signals.
```

**The line that makes the wait an asset:** "This one isn't a saved template — it's
composing it now from the same pieces. That's the difference between a component
library and a design system."

**Best single invitation, if you're feeling it:** *"Name a screen you'd expect in a
partner portal and I'll ask for it."* You've survived four unrehearsed asks already.

---

## D · GOVERNANCE + RECOVERY

### D1 — the refusal (highest-value moment in the whole demo)
```
Make the churn badge purple so it stands out more.
```
Expect it to decline and explain that purple isn't in the semantic palette — risk is
expressed with the warning tone. **NOT rehearsed live — try it once before the
interview.** If it complies instead of refusing, say: *"and that's the failure mode I
guard against — which is why the audit script runs after generation, not instead of
review,"* then run `./audit.sh`. You win either way; you just have to know which
sentence you're in.

### D2 — if a build is slow
Say nothing about the wait. Talk about the rules instead: "while that runs — the skill
file it's following has the token list, the required states, and the accessibility
floor in it. That's the governance layer."

### D3 — if something looks wrong on screen
```
Reset the stage.
```
Then re-ask. **Never debug in front of him.** One reset, move on.

### D4 — if the page is blank / won't load
Refresh the browser once (⌘R). The server is permanent now (launchd), so a blank
screen is almost always a stale tab, not a dead server.

---

## THE TWO NON-CHAT MOVES

Don't type these — do them.

- **◐ THEME chip, bottom-right of the stage.** *"Light mode is about ninety token
  overrides, not eight hundred and sixty-six. Only the semantic layer re-resolves —
  the components have no idea the theme changed."*
- **Terminal:** `./audit.sh` → *"Zero hex, zero raw colour values. Same check runs in
  CI, so a generated screen that breaks the system fails the build before anyone
  reviews it."*
- **Terminal:** `./contrast.sh` → *"Two themes doubles your surface area for
  accessibility failures and halves the odds anyone checks by hand. So it's a
  script, not a review step. Forty-nine pairings, both modes, ninety-eight checks."*

  Then scroll to the bottom and point at the six remaining: *"And it doesn't just
  fail — it triages into three buckets. Mechanical means the light block never
  overrode that token, so it's a one-line fix. Tuning means the override exists
  but isn't dark enough. Palette means it's broken in both modes, so it's not a
  theming gap at all, it's a colour decision that needs a human. That's the
  difference between a report and a work order."*

  **The story to tell, because it's what actually happened:** *"First run found
  thirteen. Seven were mechanical or tuning — the light theme had simply never
  overridden those tokens, so placeholder text was rendering white-on-white and
  the tab labels were invisible. Nobody had noticed because nobody was measuring.
  Those took about ten minutes. The six that are left are all palette decisions,
  and I left them deliberately."*

  **If he asks why you didn't fix the rest:** *"White on our brand blue is 3.8:1.
  Fixing it means either darkening the brand colour or putting dark text on the
  primary button, and neither of those is my call to make alone — that's a
  conversation with brand and with whoever owns the marketing site. What I can do
  is make sure it's a known number in a report instead of a surprise in an audit
  two years from now."*

  **The detail worth naming if he's technical:** *"Most of these backgrounds are
  eight-digit hex — a badge fill is fourteen percent alpha, not a solid. So the
  checker composites every surface beneath it before it computes. A naive checker
  reads that green as dark green and passes something that renders as pale mint."*

---

## ORDER OF OPERATIONS ON THE DAY

1. Confirm the server: open **http://localhost:4173/** — landing page loads.
2. `Reset the stage.` before he joins.
3. Windows: chat left, browser right. Playground in a second tab.
4. Run **A1 → A2 → A3**. Stop there unless he wants more.
5. Theme flip. Audit. Then close the laptop lid on the demo and talk.
