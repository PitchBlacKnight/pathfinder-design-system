import json, html, re, sys
cards = json.load(open(sys.argv[1]))
E = html.escape
slug = lambda s: re.sub(r'^-|-$', '', re.sub(r'[^a-z0-9]+', '-', s.lower()))
FIGMA = 'https://www.figma.com/design/ysLgPqCzELzxKw6KVZdKjE'
DOCS = 'https://port-sable-50786193.figma.site'

def status(h):
    if h == 'RECIPE': return '<span class="pf-badge pf-badge-info">Recipe</span>'
    if not h: return '<span class="pf-badge pf-badge-neutral">Figma only</span>'
    return '<span class="pf-badge pf-badge-positive">In code</span>'

rows = []
for name, node, h, react, maps in cards:
    code = '<span class="muted">recipes/empty-state.html</span>' if h == 'RECIPE' else ('<span class="muted">Not in pathfinder.css yet</span>' if not h else f'<code>{E(h)}</code>')
    m = ''.join(f'<li>{E(x)}</li>' for x in maps) or '<li class="muted">No variant mapping</li>'
    rows.append(f'''<tr id="{slug(name)}">
  <td><strong>{E(name)}</strong><br><a class="node" href="{FIGMA}?node-id={node.replace(':','-')}">node {node}</a></td>
  <td>{status(h)}</td>
  <td class="code">{code}</td>
  <td><ul>{m}</ul></td>
  <td class="code"><code>{E(react)}</code></td>
</tr>''')

in_code = sum(1 for c in cards if c[2] and c[2] != 'RECIPE')
figma_only = sum(1 for c in cards if not c[2])

floor = [
 ('Dashboard','4:61','Overview of partner KPIs, activity and recent records in one screen.','recipes/desktop.html, stage/app.html'),
 ('Project Manager','38:2','Command center for milestones, ownership, dependencies and delivery health.',''),
 ('Analytical List','35:2','Filterable, sortable master list with bulk actions and pagination.','recipes/data-table.html, recipes/orders-page.html'),
 ('Object Detail','38:255','Single record view: identity header, key facts, tabs and related records.','recipes/detail.html'),
 ('Project Information','38:467','Structured project record with grouped attributes and editable details.',''),
 ('Guided Wizard','38:717','Multi-step flow with per-step validation, progress and a review step.','recipes/form.html (fields only)'),
 ('Approval Queue','38:850','Review, approve, reject or escalate partner requests; high-risk items flagged.',''),
 ('IQA Builder','38:1057','Workspace for authoring questions, logic, scoring and outcomes.',''),
 ('Connectivity Navigator','38:1322','Spatial canvas with relationship context, selection details and navigation.',''),
]
NONE = '<span class="muted">None yet. Build from the components shown.</span>'
def fref(r): return '<code>' + E(r) + '</code>' if r else NONE
frows = ''.join('<tr><td><strong>%s</strong><br><a class="node" href="%s?node-id=%s">page %s</a></td><td>%s</td><td class="code">%s</td></tr>' % (n, FIGMA, i.replace(':','-'), i, p, fref(r)) for n,i,p,r in floor)

behav = [
 ('data-modal-open="id"','Any button','Opens the overlay with that id. Focus moves to its first control.'),
 ('data-modal-close','Button inside a modal','Closes the modal and returns focus to the trigger.'),
 ('data-static','.pf-modal-overlay','Danger and confirmation dialogs. Escape and overlay click do not close it.'),
 ('data-confirm-gate="checkboxId"','Button','Stays disabled until that checkbox is checked. Required on the most critical deletes.'),
 ('data-toast="Title|Detail|tone"','Any button','Shows a .pf-toast in the aria-live region. Can share a button with data-modal-close.'),
 ('data-sort','th','Click toggles aria-sort ascending/descending. Numeric values sort as numbers.'),
 ('data-select-all / data-select-row','Checkbox in th / td','Keeps row checkboxes and aria-selected in sync.'),
 ('data-filter-table="#table"','select','Shows only rows whose data-status matches the value ("all" shows every row).'),
 ('data-open','.pf-modal-overlay','Renders the modal already open (used by the live stage).'),
]
brows = ''.join(f'<tr><td class="code"><code>{E(a)}</code></td><td>{E(b)}</td><td>{E(c)}</td></tr>' for a,b,c in behav)

tiers = [
 ('1. Primitives','Raw palette and alphas, such as blue/600 or white/a38.','None. Never reference a primitive in product code.'),
 ('2. Theme','Every color that changes between Dark and Light, including role tokens (control/*, content/*, global/*).','<code>:root</code> and <code>:root[data-theme="light"]</code>'),
 ('3. Layout','Spacing, sizing, radius, type sizes and weights, motion, breakpoints. No modes.','<code>--pfSpace*</code>, <code>--pfFont*Size</code>, <code>--pfBreakpoint_*</code>'),
 ('4. Component','Component-level tokens that alias Theme or Layout. This is what components bind to.','<code>--pfButton_Emphasized_Background</code> and the rest'),
]
trows = ''.join(f'<tr><td><strong>{a}</strong></td><td>{b}</td><td class="code">{c}</td></tr>' for a,b,c in tiers)

nav = [('setup','Setup'),('tokens','Tokens'),('components','Components'),('behavior','Behavior'),('a11y','Accessibility'),('responsive','Responsive'),('floorplans','Floorplans'),('checklist','Handoff checklist'),('gaps','Known gaps')]
navhtml = ''.join(f'<a href="#{a}">{b}</a>' for a,b in nav)

page = f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Pathfinder Developer Handoff</title>
<link rel="stylesheet" href="../css/pathfinder.fonts.css">
<link rel="stylesheet" href="../tokens/pathfinder.tokens.css">
<link rel="stylesheet" href="../tokens/pathfinder.figma-additions.css">
<link rel="stylesheet" href="../css/pathfinder.css">
<script>try{{var t=localStorage.getItem('pf-handoff-theme');if(t)document.documentElement.dataset.theme=t;}}catch(e){{}}</script>
<style>
  /* Handoff page chrome. Every color is a token reference. */
  body {{ margin: 0; background: var(--pfBackgroundColor); color: var(--pfTextColor); font-family: var(--pfFontFamily); line-height: 1.55; }}
  .ho {{ display: grid; grid-template-columns: 220px minmax(0, 1fr); max-width: 1320px; margin: 0 auto; }}
  .ho-nav {{ position: sticky; top: 0; align-self: start; height: 100vh; padding: 32px 20px; display: flex; flex-direction: column; gap: 4px; border-right: 1px solid var(--pfGroup_ContentBorderColor); box-sizing: border-box; }}
  .ho-nav a {{ color: var(--pfContent_LabelColor); text-decoration: none; padding: 6px 10px; border-radius: 6px; font-size: var(--pfFontSize); }}
  .ho-nav a:hover {{ color: var(--pfTextColor); background: var(--pfShell_Hover_Background); }}
  .ho-nav .brand {{ font-family: var(--pfFontHeaderFamily); font-size: 20px; letter-spacing: .04em; color: var(--pfTextColor); margin: 0 10px 20px; }}
  .ho-nav .pf-btn {{ margin-top: 20px; }}
  main {{ padding: 48px 48px 96px; min-width: 0; }}
  section {{ margin-top: 64px; scroll-margin-top: 24px; }}
  h1 {{ margin: 8px 0 12px; line-height: 1.1; }}
  h2 {{ margin: 0 0 8px; font-size: var(--pfFontHeader3Size); }}
  .lead {{ color: var(--pfContent_LabelColor); max-width: 760px; margin: 0; }}
  .sub {{ color: var(--pfContent_LabelColor); max-width: 760px; margin: 0 0 20px; }}
  .links {{ display: flex; flex-wrap: wrap; gap: 8px; margin-top: 20px; }}
  a {{ color: var(--pfLinkColor); }}
  a:hover {{ color: var(--pfLinkHoverColor); }}
  .muted {{ color: var(--pfContent_LabelColor); }}
  .node {{ font-size: var(--pfFontSmallSize); }}
  pre {{ margin: 0; padding: 16px; overflow-x: auto; font-family: var(--pfFontMonoFamily); font-size: var(--pfFontSmallSize); }}
  .pf-table td {{ vertical-align: top; }}
  .pf-table ul {{ margin: 0; padding-left: 16px; }}
  .pf-table {{ table-layout: fixed; width: 100%; }}
  .pf-table td, .pf-table th {{ white-space: normal; }}
  .pf-table td code {{ font-size: var(--pfFontSmallSize); overflow-wrap: anywhere; }}
  .map col.c1 {{ width: 15%; }} .map col.c2 {{ width: 11%; }} .map col.c3 {{ width: 26%; }} .map col.c4 {{ width: 26%; }} .map col.c5 {{ width: 22%; }}
  @media (max-width: 900px) {{ .pf-table.map {{ min-width: 860px; }} }}
  .stats {{ display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 16px; margin-top: 28px; }}
  .checklist li {{ margin: 6px 0; }}
  @media (max-width: 900px) {{
    .ho {{ grid-template-columns: 1fr; }}
    .ho-nav {{ position: static; height: auto; flex-direction: row; flex-wrap: wrap; border-right: 0; border-bottom: 1px solid var(--pfGroup_ContentBorderColor); padding: 16px; }}
    .ho-nav .brand {{ width: 100%; margin: 0 0 8px; }}
    .ho-nav .pf-btn {{ margin: 0 0 0 auto; }}
    main {{ padding: 32px 16px 64px; }}
    h1 {{ font-size: var(--pfFontHeader2Size); }}
    .stats {{ grid-template-columns: repeat(2, minmax(0, 1fr)); }}
  }}
</style>
</head>
<body>
<div class="ho">
<nav class="ho-nav" aria-label="Sections">
  <div class="brand">PATHFINDER</div>
  {navhtml}
  <button class="pf-btn pf-btn-secondary pf-btn-sm" id="theme" type="button">Switch to Light</button>
</nav>
<main>
  <span class="pf-overline">Pathfinder 2.0 · Figma library 1.2 · 2026-10-04</span>
  <h1>Developer handoff</h1>
  <p class="lead">Everything a developer needs to build from the Pathfinder Figma file. Figma shows what to build and which tokens it uses. This page covers how: classes, behavior, accessibility and what is not in code yet. It lives next to the code so the two stay in step.</p>
  <div class="links">
    <a class="pf-btn pf-btn-primary pf-btn-sm" href="{FIGMA}">Figma library</a>
    <a class="pf-btn pf-btn-secondary pf-btn-sm" href="{DOCS}">Docs site</a>
    <a class="pf-btn pf-btn-secondary pf-btn-sm" href="../playground/">Playground</a>
    <a class="pf-btn pf-btn-secondary pf-btn-sm" href="../recipes/desktop.html">Recipes</a>
  </div>
  <div class="stats">
    <div class="pf-card pf-stat"><span class="pf-stat-label">Mapped components</span><span class="pf-stat-value">{len(cards)}</span></div>
    <div class="pf-card pf-stat"><span class="pf-stat-label">In pathfinder.css</span><span class="pf-stat-value">{in_code}</span></div>
    <div class="pf-card pf-stat"><span class="pf-stat-label">Figma only</span><span class="pf-stat-value">{figma_only}</span></div>
    <div class="pf-card pf-stat"><span class="pf-stat-label">Contrast checks passing</span><span class="pf-stat-value">126/126</span></div>
  </div>

  <section id="setup">
    <h2>Setup</h2>
    <p class="sub">No build step and no dependencies. Load the files in this order; the additions file must come after the token file.</p>
    <div class="pf-card"><pre><code>{E("""<link rel="stylesheet" href="css/pathfinder.fonts.css">
<link rel="stylesheet" href="tokens/pathfinder.tokens.css">
<link rel="stylesheet" href="tokens/pathfinder.figma-additions.css">
<link rel="stylesheet" href="css/pathfinder.css">
<script src="js/pathfinder.js" defer></script>

<!-- Light mode: one attribute. Dark is the default. -->
<html data-theme="light">""")}</code></pre></div>
  </section>

  <section id="tokens">
    <h2>Tokens</h2>
    <p class="sub">Figma variables carry their CSS name, so Dev Mode shows <code>var(--pfShell_Background)</code> instead of a hex value. Use the Component token when one exists, then the Theme token. Never hardcode a value: <code>./audit.sh</code> fails on any hex, rgb() or non-token font.</p>
    <div class="pf-table-wrap"><table class="pf-table"><thead><tr><th>Figma collection</th><th>Holds</th><th>In code</th></tr></thead><tbody>{trows}</tbody></table></div>
  </section>

  <section id="components">
    <h2>Components</h2>
    <p class="sub">Every Figma component, its code and how its properties map. Each Figma component description links to its row here. React props come from the docs site source: [def] read from the component definition, [use] inferred from usage.</p>
    <div class="pf-table-wrap"><table class="pf-table map"><colgroup><col class="c1"><col class="c2"><col class="c3"><col class="c4"><col class="c5"></colgroup><thead><tr><th>Component</th><th>Status</th><th>HTML</th><th>Figma → code</th><th>React props (docs site)</th></tr></thead><tbody>
{chr(10).join(rows)}
    </tbody></table></div>
  </section>

  <section id="behavior">
    <h2>Behavior</h2>
    <p class="sub"><code>js/pathfinder.js</code> wires all interaction through data attributes and one delegated listener, so markup added at runtime works without setup.</p>
    <div class="pf-table-wrap"><table class="pf-table"><thead><tr><th>Attribute</th><th>On</th><th>Does</th></tr></thead><tbody>{brows}</tbody></table></div>
  </section>

  <section id="a11y">
    <h2>Accessibility</h2>
    <p class="sub">The baseline every screen must keep.</p>
    <div class="pf-card"><ul class="checklist">
      <li><strong>Contrast:</strong> 63 pairings checked in both modes (126 checks), all at WCAG AA or better. Run <code>./contrast.sh</code> after any token change. Disabled text is exempt (WCAG 1.4.3).</li>
      <li><strong>Focus:</strong> every control shows <code>:focus-visible</code> using <code>--pfContent_FocusColor</code> at <code>--pfContent_FocusWidth</code>. Do not remove outlines.</li>
      <li><strong>Modals:</strong> <code>role="dialog"</code> and <code>aria-modal="true"</code>. Focus moves to the first control on open and back to the trigger on close. Escape closes every modal except <code>data-static</code> ones.</li>
      <li><strong>State in ARIA:</strong> sorted column <code>aria-sort</code>, selected rows and tabs <code>aria-selected</code>, current page and nav item <code>aria-current="page"</code>.</li>
      <li><strong>Announcements:</strong> toasts render in a region with <code>aria-live="polite"</code>.</li>
      <li><strong>Labels:</strong> every input has a <code>.pf-label</code> tied by <code>for</code>/<code>id</code>. Required fields are marked in the label, not only by color.</li>
    </ul></div>
  </section>

  <section id="responsive">
    <h2>Responsive</h2>
    <p class="sub">Floorplans are drawn at 1440. Breakpoint tokens (<code>--pfBreakpoint_M_Min</code> 600px, <code>L_Min</code> 1024px, <code>XL_Min</code> 1440px) define the steps; the media queries in <code>pathfinder.css</code> mirror them because CSS cannot read variables inside <code>@media</code>.</p>
    <div class="pf-card"><ul class="checklist">
      <li>Under 1024px the sidenav collapses.</li>
      <li>Under 1024px three- and four-column grids drop to two columns.</li>
      <li>Under 600px every grid restacks to one column.</li>
      <li>Tables scroll inside <code>.pf-table-wrap</code>; the page never scrolls sideways.</li>
    </ul></div>
  </section>

  <section id="floorplans">
    <h2>Floorplans</h2>
    <p class="sub">Each Figma floorplan frame carries a dev note with its shell, recipe and this link. Tables, steppers, modals and toasts inside them carry behavior notes.</p>
    <div class="pf-table-wrap"><table class="pf-table"><thead><tr><th>Floorplan</th><th>Purpose</th><th>Code reference</th></tr></thead><tbody>{frows}</tbody></table></div>
  </section>

  <section id="checklist">
    <h2>Handoff checklist</h2>
    <p class="sub">What a design should meet before it is marked ready for development.</p>
    <div class="pf-card"><ul class="checklist">
      <li>Every fill, stroke, radius, spacing and type value is bound to a variable or style.</li>
      <li>Only library components are used; anything new goes through the contribution flow on the Governance page first.</li>
      <li>Hover, focus, disabled and error states are shown where they apply.</li>
      <li>Empty, loading and error versions exist for every data surface.</li>
      <li>Behavior that the screen cannot show (validation, sorting, what a button does) is written in a Figma note.</li>
      <li>Placeholder content is replaced with real data or clearly marked as invented.</li>
      <li>The screen is checked in Light mode by switching 2. Theme.</li>
    </ul></div>
  </section>

  <section id="gaps">
    <h2>Known gaps</h2>
    <div class="pf-card"><ul class="checklist">
      <li><strong>{figma_only} components are Figma only.</strong> They exist in Figma and the docs site but not in <code>pathfinder.css</code>. Build them from tokens and add them to the library rather than one-off in a product.</li>
      <li><strong>No focus trap yet.</strong> Modals move and restore focus, but Tab can still leave an open modal. Add a trap in <code>openModal</code>.</li>
      <li><strong>Stepper is not in code.</strong> Proposed markup: an ordered list with <code>aria-current="step"</code> on the active step.</li>
      <li><strong>Code Connect is not published.</strong> It needs a Figma Organization or Enterprise plan; the file is on Pro. The mappings above stand in for it.</li>
      <li><strong>Some floorplan content is invented:</strong> chart values, some table rows, file names, audit text and map positions. Do not treat them as real data.</li>
    </ul></div>
  </section>
</main>
</div>
<script>
  (function () {{
    var b = document.getElementById('theme'), r = document.documentElement;
    function label() {{ b.textContent = r.dataset.theme === 'light' ? 'Switch to Dark' : 'Switch to Light'; }}
    label();
    b.addEventListener('click', function () {{
      if (r.dataset.theme === 'light') delete r.dataset.theme; else r.dataset.theme = 'light';
      try {{ localStorage.setItem('pf-handoff-theme', r.dataset.theme || ''); }} catch (e) {{}}
      label();
    }});
  }})();
</script>
</body>
</html>
'''
open(sys.argv[2], 'w').write(page)
print(len(cards), in_code, figma_only)
