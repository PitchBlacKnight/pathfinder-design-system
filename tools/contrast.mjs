#!/usr/bin/env node
/* ============================================================================
   PATHFINDER — WCAG contrast audit across both resolved modes
   ----------------------------------------------------------------------------
   Two themes doubles the surface area for accessibility failures and halves the
   odds anyone checks by hand. So this is a script, not a review step.

   What it does:
     1. Parses tokens/pathfinder.tokens.css into two resolved maps — the :root
        block (dark) and :root[data-theme="light"] layered on top of it.
     2. Follows var() chains to a literal.
     3. Composites alpha. Most Pathfinder surfaces are 8-digit hex — a badge
        background is a 14%-alpha fill, not a solid — so the effective colour
        depends on every surface beneath it. A naive checker reads #22c55e24 as
        a dark green and passes something that renders as pale mint.
     4. Computes WCAG 2.1 contrast for every pairing the components actually
        produce, in both modes.

   Usage:  ./contrast.sh            report + exit 1 on any failure
           ./contrast.sh --report   report only, always exit 0
           ./contrast.sh --verbose  also print the composited RGB for each side
   ========================================================================== */

import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const TOKENS = join(ROOT, 'tokens', 'pathfinder.tokens.css');
// Figma library additions load after the token file in every page; audit them too.
const ADDITIONS = join(ROOT, 'tokens', 'pathfinder.figma-additions.css');

const argv = process.argv.slice(2);
const REPORT_ONLY = argv.includes('--report');
const VERBOSE = argv.includes('--verbose');

/* ── ANSI ─────────────────────────────────────────────────────────────────── */
const tty = process.stdout.isTTY;
const c = (n, s) => (tty ? `\x1b[${n}m${s}\x1b[0m` : s);
const dim = s => c(2, s), bold = s => c(1, s);
const red = s => c(31, s), green = s => c(32, s), yellow = s => c(33, s);

/* ── 1. Parse the token file into two maps ────────────────────────────────── */
function parseTokens(css) {
  const dark = new Map(), light = new Map();
  // Match a selector followed by a brace block. Token files are flat — no
  // nesting — so a non-greedy body match is safe here.
  const blocks = css.matchAll(/([^{}]+)\{([^{}]*)\}/g);
  for (const [, rawSel, body] of blocks) {
    const sel = rawSel.trim().split('\n').pop().trim();
    let target = null;
    if (sel === ':root') target = dark;
    else if (/^:root\[data-theme=["']?light["']?\]$/.test(sel)) target = light;
    if (!target) continue;
    for (const [, name, value] of body.matchAll(/(--[A-Za-z0-9_-]+)\s*:\s*([^;]+);/g)) {
      target.set(name, value.trim());
    }
  }
  return { dark, light: new Map([...dark, ...light]) };
}

/* ── 2. Resolve var() chains ──────────────────────────────────────────────── */
function resolve(name, map, depth = 0) {
  if (depth > 12) return null;              // cycle guard
  let v = map.get(name);
  if (v === undefined) return null;
  const m = v.match(/^var\(\s*(--[A-Za-z0-9_-]+)\s*(?:,\s*(.+))?\)$/);
  if (m) {
    const via = resolve(m[1], map, depth + 1);
    if (via) return via;
    return m[2] ? m[2].trim() : null;       // fall back to the var() fallback
  }
  return v;
}

/* ── 3. Colour parsing + alpha compositing ────────────────────────────────── */
const NAMED = { white: '#ffffff', black: '#000000', transparent: '#00000000' };

function parseColor(str) {
  if (!str) return null;
  let s = str.trim().toLowerCase();
  if (NAMED[s]) s = NAMED[s];

  if (s.startsWith('#')) {
    const h = s.slice(1);
    const ex = h.length <= 4 ? h.split('').map(ch => ch + ch).join('') : h;
    if (ex.length !== 6 && ex.length !== 8) return null;
    return {
      r: parseInt(ex.slice(0, 2), 16),
      g: parseInt(ex.slice(2, 4), 16),
      b: parseInt(ex.slice(4, 6), 16),
      a: ex.length === 8 ? parseInt(ex.slice(6, 8), 16) / 255 : 1,
    };
  }

  const fn = s.match(/^(rgba?|hsla?)\(([^)]+)\)$/);
  if (fn) {
    const parts = fn[2].split(/[\s,/]+/).filter(Boolean);
    const num = (p, max) => p.endsWith('%') ? parseFloat(p) / 100 * max : parseFloat(p);
    const a = parts[3] !== undefined ? num(parts[3], 1) : 1;
    if (fn[1].startsWith('rgb')) {
      return { r: num(parts[0], 255), g: num(parts[1], 255), b: num(parts[2], 255), a };
    }
    // hsl → rgb
    const H = parseFloat(parts[0]) / 360, S = parseFloat(parts[1]) / 100, L = parseFloat(parts[2]) / 100;
    const k = n => (n + H * 12) % 12;
    const f = n => L - S * Math.min(L, 1 - L) * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));
    return { r: f(0) * 255, g: f(8) * 255, b: f(4) * 255, a };
  }
  return null;
}

/* src-over: fg (with alpha) painted onto an opaque bg. */
function over(fg, bg) {
  return {
    r: fg.r * fg.a + bg.r * (1 - fg.a),
    g: fg.g * fg.a + bg.g * (1 - fg.a),
    b: fg.b * fg.a + bg.b * (1 - fg.a),
    a: 1,
  };
}

/* Fold a surface stack (bottom-first) into one opaque colour. */
function flatten(stack, map) {
  let acc = null;
  for (const token of stack) {
    const col = parseColor(resolve(token, map));
    if (!col) return { color: null, missing: token };
    acc = acc === null ? over(col, { r: 255, g: 255, b: 255, a: 1 }) : over(col, acc);
  }
  return { color: acc, missing: null };
}

/* ── 4. WCAG 2.1 ──────────────────────────────────────────────────────────── */
function luminance({ r, g, b }) {
  const ch = v => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * ch(r) + 0.7152 * ch(g) + 0.0722 * ch(b);
}
function ratio(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/* ── 5. The pairings the components actually produce ──────────────────────── */
/* Derived by reading css/pathfinder.css — not the cross product of 866 tokens,
   which would be noise. `on` is a surface stack, bottom-first, so alpha fills
   composite correctly. `min` is the AA floor: 4.5 body text, 3.0 large text
   (>=18.66px bold or >=24px) and non-text UI per WCAG 1.4.11.               */
const PAGE  = ['--pfBackgroundColor'];
const TILE  = ['--pfBackgroundColor', '--pfTile_Background'];
const FIELD = [...TILE, '--pfField_Background'];
const LIST  = [...TILE, '--pfList_Background'];
const NAV   = ['--pfShell_Navigation_Background'];

const PAIRINGS = [
  { group: 'Foundation' },
  { what: 'Body text on page',          fg: '--pfTextColor',                    on: PAGE,  min: 4.5 },
  { what: 'Heading on page',            fg: '--pfTitleColor',                   on: PAGE,  min: 3.0 },
  { what: 'Foreground text on page',    fg: '--pfContent_ForegroundTextColor',  on: PAGE,  min: 4.5 },
  { what: 'Label / caption on page',    fg: '--pfContent_LabelColor',           on: PAGE,  min: 4.5 },
  { what: 'Icon on page',               fg: '--pfContent_IconColor',            on: PAGE,  min: 3.0 },
  { what: 'Link on page',               fg: '--pfLinkColor',                    on: PAGE,  min: 4.5 },
  { what: 'Focus ring on page',         fg: '--pfContent_FocusColor',           on: PAGE,  min: 3.0 },

  { group: 'Card surface' },
  { what: 'Stat value on card',         fg: '--pfTitleColor',                   on: TILE,  min: 3.0 },
  { what: 'Stat label on card',         fg: '--pfContent_LabelColor',           on: TILE,  min: 4.5 },
  { what: 'Body text on card',          fg: '--pfTextColor',                    on: TILE,  min: 4.5 },
  { what: 'Delta up on card',           fg: '--pfPositiveElementColor',         on: TILE,  min: 4.5 },
  { what: 'Delta down on card',         fg: '--pfNegativeElementColor',         on: TILE,  min: 4.5 },
  { what: 'Card border on page',        fg: '--pfTile_BorderColor',             on: PAGE,  min: 3.0, nonText: true,
    exempt: 'decorative — not a control boundary' },

  { group: 'Buttons' },
  { what: 'Default button',             fg: '--pfButton_TextColor',             on: [...TILE, '--pfButton_Background'],           min: 4.5 },
  { what: 'Primary button',             fg: '--pfButton_Emphasized_TextColor',  on: [...TILE, '--pfButton_Emphasized_Background'], min: 4.5 },
  { what: 'Ghost button',               fg: '--pfButton_Ghost_TextColor',       on: [...TILE, '--pfButton_Ghost_Background'],     min: 4.5 },
  { what: 'Lite button',                fg: '--pfButton_Lite_TextColor',        on: [...TILE, '--pfButton_Lite_Background'],      min: 4.5 },
  { what: 'Danger button',              fg: '--pfButton_Negative_TextColor',    on: [...TILE, '--pfButton_Negative_Background'],  min: 4.5 },
  { what: 'Success button',             fg: '--pfButton_Success_TextColor',     on: [...TILE, '--pfButton_Success_Background'],   min: 4.5 },
  { what: 'Button border on card',      fg: '--pfButton_BorderColor',           on: TILE,  min: 3.0, nonText: true },

  { group: 'Chart' },
  { what: 'Chart total on card',        fg: '--pfTitleColor',                   on: TILE,  min: 3.0 },
  { what: 'Chart value label on card',  fg: '--pfChart_Data_TextColor',         on: TILE,  min: 4.5 },
  { what: 'Chart axis label on card',   fg: '--pfContent_LabelColor',           on: TILE,  min: 4.5 },
  { what: 'Chart series 1 on card',     fg: '--pfChart_OrderedColor_1',         on: TILE,  min: 3.0, nonText: true },
  { what: 'Chart series 2 on card',     fg: '--pfChart_OrderedColor_2',         on: TILE,  min: 3.0, nonText: true },
  { what: 'Chart good series on card',  fg: '--pfChart_Good',                   on: TILE,  min: 3.0, nonText: true },
  { what: 'Chart bad series on card',   fg: '--pfChart_Bad',                    on: TILE,  min: 3.0, nonText: true },
  { what: 'Chart prior-year series',    fg: '--pfChart_IBCS_Previous',          on: TILE,  min: 3.0, nonText: true },
  { what: 'Chart gridline on card',     fg: '--pfChart_LineColor_2',            on: TILE,  min: 3.0, nonText: true,
    exempt: 'decorative — gridlines are not a control boundary' },

  { group: 'Status badges' },
  { what: 'Neutral badge',              fg: '--pfNeutralTextColor',             on: [...TILE, '--pfNeutralBackground'],     min: 4.5 },
  { what: 'Positive badge',             fg: '--pfPositiveTextColor',            on: [...TILE, '--pfSuccessBackground'],     min: 4.5 },
  { what: 'Informative badge',          fg: '--pfInformativeTextColor',         on: [...TILE, '--pfInformationBackground'], min: 4.5 },
  { what: 'Warning badge',              fg: '--pfCriticalTextColor',            on: [...TILE, '--pfWarningBackground'],     min: 4.5 },
  { what: 'Negative badge',             fg: '--pfNegativeTextColor',            on: [...TILE, '--pfErrorBackground'],       min: 4.5 },
  { what: 'Gold badge',                 fg: '--pfAccent_Gold_TextColor',        on: [...TILE, '--pfAccent_Gold_Background'], min: 4.5 },

  { group: 'Fields' },
  { what: 'Field text',                 fg: '--pfField_TextColor',              on: FIELD, min: 4.5 },
  { what: 'Placeholder',                fg: '--pfField_PlaceholderTextColor',   on: FIELD, min: 4.5 },
  { what: 'Field border on card',       fg: '--pfField_BorderColor',            on: TILE,  min: 3.0, nonText: true },
  { what: 'Required marker',            fg: '--pfField_RequiredColor',          on: TILE,  min: 4.5 },
  { what: 'Invalid help text',          fg: '--pfNegativeTextColor',            on: TILE,  min: 4.5 },

  { group: 'Table / list' },
  { what: 'Row text',                   fg: '--pfTextColor',                    on: LIST,  min: 4.5 },
  { what: 'Header text',                fg: '--pfContent_LabelColor',           on: LIST,  min: 4.5 },
  { what: 'Footer text',                fg: '--pfList_FooterTextColor',         on: LIST,  min: 4.5 },
  { what: 'Text on hovered row',        fg: '--pfTextColor',                    on: [...LIST, '--pfList_Hover_Background'],        min: 4.5 },
  { what: 'Text on selected row',       fg: '--pfTextColor',                    on: [...LIST, '--pfList_SelectionBackgroundColor'], min: 4.5 },
  { what: 'Text on striped row',        fg: '--pfTextColor',                    on: [...LIST, '--pfList_AlternatingBackground'],   min: 4.5 },

  { group: 'Navigation' },
  { what: 'Nav item',                   fg: '--pfShell_Navigation_TextColor',           on: NAV, min: 4.5 },
  { what: 'Nav item selected',          fg: '--pfShell_Navigation_Selected_TextColor',  on: [...NAV, '--pfShell_Navigation_Active_Background'], min: 4.5 },
  { what: 'Nav group title',            fg: '--pfShell_GroupTitleTextColor',            on: NAV, min: 4.5 },
  { what: 'Tab (rest)',                 fg: '--pfTab_TextColor',                        on: [...TILE, '--pfTab_Background'], min: 4.5 },
  { what: 'Tab (selected)',             fg: '--pfTab_Selected_TextColor',               on: [...TILE, '--pfTab_Background'], min: 4.5 },

  { group: 'Avatars' },
  ...[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => ({
    what: `Avatar ${n}`,
    fg: `--pfAvatar_${n}_TextColor`,
    on: [...TILE, `--pfAvatar_${n}_Background`],
    min: 4.5,
  })),

  { group: 'Non-text UI' },
  { what: 'Progress fill on track',     fg: '--pfProgress_Value_Background',            on: [...TILE, '--pfProgress_Background'], min: 3.0, nonText: true },
  { what: 'Progress positive on track', fg: '--pfProgress_Value_PositiveBackground',    on: [...TILE, '--pfProgress_Background'], min: 3.0, nonText: true },
  { what: 'Progress negative on track', fg: '--pfProgress_Value_NegativeBackground',    on: [...TILE, '--pfProgress_Background'], min: 3.0, nonText: true },
  { group: 'Library 1.3 - 1.7' },
  { what: 'Menu item text',             fg: '--pfList_TextColor',               on: TILE, min: 4.5 },
  { what: 'Menu destructive text',      fg: '--pfNegativeTextColor',            on: TILE, min: 4.5 },
  { what: 'Link on page',               fg: '--pfLinkColor',                    on: PAGE, min: 4.5 },
  { what: 'Kbd text',                   fg: '--pfContent_LabelColor',           on: [...TILE, '--pfContent_InsetBackground'], min: 4.5 },
  { what: 'AI label text',              fg: '--pfContent_Selected_TextColor',               on: [...TILE, '--pfGlobal_HighlightSoftBackground'], min: 4.5 },
  { what: 'Selected list text',         fg: '--pfContent_Selected_TextColor',   on: [...TILE, '--pfContent_ListSelectionBackground'], min: 4.5 },
  { what: 'Unread notification',        fg: '--pfContent_ForegroundColor',      on: [...TILE, '--pfGlobal_HighlightHoverBackground'], min: 4.5 },
  { what: 'Diff removed text',          fg: '--pfNegativeTextColor',            on: [...TILE, '--pfErrorBackground'], min: 4.5 },
  { what: 'Diff added text',            fg: '--pfPositiveTextColor',            on: [...TILE, '--pfSuccessBackground'], min: 4.5 },
  { what: 'Segment selected text',      fg: '--pfContent_ForegroundColor',      on: [...TILE, '--pfControl_Track_Background', '--pfGroup_ContentBackground'], min: 4.5 },
  { what: 'Status dot (positive)',      fg: '--pfPositiveElementColor',         on: TILE, min: 3.0, nonText: true },
  { what: 'Focus ring',                 fg: '--pfContent_FocusColor',           on: PAGE, min: 3.0, nonText: true },
  { what: 'Toggle track (on)',          fg: '--pfButton_Track_Selected_Background',     on: TILE, min: 3.0, nonText: true },
  { what: 'Disabled text',              fg: '--pfContent_DisabledTextColor',            on: TILE, min: 3.0, nonText: true,
    exempt: 'WCAG 1.4.3 — inactive components exempt' },
];

/* ── 6. Evaluate ──────────────────────────────────────────────────────────── */
function evaluate(pair, map) {
  const bg = flatten(pair.on, map);
  if (!bg.color) return { missing: bg.missing };
  const fgRaw = parseColor(resolve(pair.fg, map));
  if (!fgRaw) return { missing: pair.fg };
  const fg = over(fgRaw, bg.color);           // text alpha composites onto its surface
  return { ratio: ratio(fg, bg.color), fg, bg: bg.color };
}

function grade(r, pair) {
  if (r === undefined) return { label: '   —  ', ok: true };
  const pass = r >= pair.min;
  const aaa = !pair.nonText && r >= 7;
  const label = aaa ? 'AAA' : pass ? 'AA ' : 'FAIL';
  return { label, ok: pass, aaa };
}

const css = readFileSync(TOKENS, 'utf8') + (existsSync(ADDITIONS) ? '\n' + readFileSync(ADDITIONS, 'utf8') : '');
const { dark, light } = parseTokens(css);

const rows = [];
const missing = new Set();
let failures = 0, checked = 0;

for (const pair of PAIRINGS) {
  if (pair.group) { rows.push({ group: pair.group }); continue; }
  const d = evaluate(pair, dark);
  const l = evaluate(pair, light);
  if (d.missing) missing.add(d.missing);
  if (l.missing) missing.add(l.missing);
  if (d.missing || l.missing) { rows.push({ pair, unresolved: true }); continue; }
  const gd = grade(d.ratio, pair), gl = grade(l.ratio, pair);
  const row = { pair, d, l, gd, gl };
  if (!pair.exempt) {
    checked++;
    if (!gd.ok || !gl.ok) { failures++; row.failed = true; }
  }
  rows.push(row);
}

/* ── 6b. Triage: mechanical vs. palette ───────────────────────────────────────
   A failure that only appears in light mode, on a token the light block never
   overrides, is a gap in the theme — a mechanical fix, one line each. A failure
   present in BOTH modes is a palette decision and needs a human. Separating
   these is the difference between a report and a work order.                  */
const lightBlock = new Set();
{
  const m = css.match(/:root\[data-theme=["']?light["']?\]\s*\{([^}]*)\}/);
  if (m) for (const [, n] of m[1].matchAll(/(--[A-Za-z0-9_-]+)\s*:/g)) lightBlock.add(n);
}
const mechanical = [], tuning = [], palette = [];
for (const row of rows) {
  if (!row.failed) continue;
  const onlyLight = row.gd.ok && !row.gl.ok;
  // A fully-transparent token is mode-agnostic — it contributes nothing to the
  // composite, so its absence from the light block is correct, not an omission.
  const culprits = [row.pair.fg, ...row.pair.on].filter(t => {
    if (lightBlock.has(t)) return false;
    const col = parseColor(resolve(t, dark));
    return !(col && col.a === 0);
  });
  if (!onlyLight) palette.push(row);          // broken in dark too — the pair itself
  else if (culprits.length) mechanical.push({ row, culprits });
  else tuning.push(row);                      // override exists, just isn't dark enough
}

/* ── 7. Report ────────────────────────────────────────────────────────────── */
const W = 30;
const pad = (s, n) => (s + ' '.repeat(n)).slice(0, n);
const fmt = r => (r >= 10 ? r.toFixed(1) : r.toFixed(2)).padStart(5) + ':1';
const paint = (g, s) => (g.label === 'FAIL' ? red(s) : g.aaa ? green(s) : s);
const rgbOf = col => `rgb(${[col.r, col.g, col.b].map(v => Math.round(v)).join(' ')})`;

console.log('');
console.log(`  ${bold('PATHFINDER CONTRAST AUDIT')} — WCAG 2.1, both resolved modes`);
console.log('  ' + '─'.repeat(64));
console.log('  ' + dim(pad('PAIRING', W) + pad('DARK', 15) + pad('LIGHT', 15) + 'FLOOR'));

for (const row of rows) {
  if (row.group) { console.log('  ' + dim('· ' + row.group)); continue; }
  if (row.unresolved) {
    console.log('  ' + pad(row.pair.what, W) + yellow('unresolved token'));
    continue;
  }
  const floor = row.pair.exempt ? 'exempt'
    : row.pair.nonText ? '3.0 ui' : row.pair.min === 3 ? '3.0 lg' : '4.5';
  const cell = (g, r) => row.pair.exempt
    ? dim(`${fmt(r)} —  `)
    : paint(g, `${fmt(r)} ${g.label}`);
  console.log(
    '  ' + pad(row.pair.what, W) +
    pad(cell(row.gd, row.d.ratio), 15 + (tty ? 9 : 0)) +
    pad(cell(row.gl, row.l.ratio), 15 + (tty ? 9 : 0)) +
    dim(floor)
  );
  if (row.pair.exempt) console.log('    ' + dim('↳ ' + row.pair.exempt));
  if (VERBOSE) {
    console.log('    ' + dim(`dark  ${rgbOf(row.d.fg)} on ${rgbOf(row.d.bg)}`));
    console.log('    ' + dim(`light ${rgbOf(row.l.fg)} on ${rgbOf(row.l.bg)}`));
  }
}

console.log('  ' + '─'.repeat(64));
if (missing.size) {
  console.log('  ' + yellow(`UNRESOLVED (${missing.size}) — pairing list is out of date with the tokens`));
  for (const m of [...missing].sort()) console.log('    ' + dim(m));
  console.log('  ' + '─'.repeat(64));
}
if (mechanical.length) {
  console.log('  ' + bold('MECHANICAL') + dim(` (${mechanical.length}) — passes in dark, fails in light because the`));
  console.log('  ' + dim('light block never overrides these. One line each:'));
  const seen = new Set();
  for (const { row, culprits } of mechanical) {
    for (const t of culprits) {
      if (seen.has(t)) continue;
      seen.add(t);
      console.log('    ' + yellow(t) + dim(` = ${resolve(t, dark)}`) + dim(`   · ${row.pair.what}`));
    }
  }
  console.log('  ' + '─'.repeat(64));
}
if (tuning.length) {
  console.log('  ' + bold('LIGHT TUNING') + dim(` (${tuning.length}) — the light override exists, it just isn't`));
  console.log('  ' + dim('dark enough against a light surface. Adjust the value:'));
  for (const row of tuning) {
    console.log('    ' + yellow(pad(row.pair.what, 26)) +
      dim(`${fmt(row.l.ratio)} light   ${row.pair.fg} = ${resolve(row.pair.fg, light)}`));
  }
  console.log('  ' + '─'.repeat(64));
}
if (palette.length) {
  console.log('  ' + bold('PALETTE') + dim(` (${palette.length}) — fails in BOTH modes. Not a theming gap;`));
  console.log('  ' + dim('the colour pair itself is the problem. Needs a human decision.'));
  for (const row of palette) {
    console.log('    ' + red(pad(row.pair.what, 26)) +
      dim(`${fmt(row.d.ratio)} dark / ${fmt(row.l.ratio)} light   ${row.pair.fg}`));
  }
  console.log('  ' + '─'.repeat(64));
}
/* ── 6c. Extra modes (Figma library 1.5) ───────────────────────────────────
   High contrast and the Northbeam demo brand are layered on Dark or Light the
   same way the browser cascades them. Same pairings, same floors.            */
function blockMap(sel) {
  const m = new Map();
  for (const [, rawSel, body] of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    if (rawSel.trim().split('\n').pop().trim() !== sel) continue;
    for (const [, n, v] of body.matchAll(/(--[A-Za-z0-9_-]+)\s*:\s*([^;]+);/g)) m.set(n, v.trim());
  }
  return m;
}
const layer = (...maps) => new Map(maps.flatMap(m => [...m]));
const HC = layer(dark, blockMap(':root[data-theme="high-contrast"]'));
const NB = blockMap(':root[data-brand="northbeam"]');
const EXTRA = [
  ['High contrast', HC],
  ['Northbeam dark', layer(dark, NB, blockMap(':root[data-brand="northbeam"]:not([data-theme="light"]):not([data-theme="high-contrast"])'))],
  ['Northbeam light', layer(light, NB, blockMap(':root[data-brand="northbeam"][data-theme="light"]'))],
  ['Northbeam high contrast', layer(HC, NB, blockMap(':root[data-brand="northbeam"][data-theme="high-contrast"]'))],
];
let extraChecked = 0, extraFailures = 0;
console.log('  ' + bold('EXTRA MODES'));
for (const [label, map] of EXTRA) {
  const fails = [];
  for (const pair of PAIRINGS) {
    if (pair.group || pair.exempt) continue;
    const r = evaluate(pair, map);
    if (r.missing) { missing.add(r.missing); continue; }
    extraChecked++;
    if (r.ratio < pair.min) fails.push(`${pad(pair.what, 26)}${fmt(r.ratio)}  ${pair.fg} = ${resolve(pair.fg, map)}`);
  }
  extraFailures += fails.length;
  console.log('    ' + pad(label, 26) + (fails.length ? red(`${fails.length} below AA`) : green('pass')));
  for (const f of fails) console.log('      ' + dim(f));
}
failures += extraFailures;
console.log('  ' + '─'.repeat(64));
console.log(`  ${checked} enforced pairings × 2 modes + ${extraChecked} in extra modes = ${checked * 2 + extraChecked} contrast checks`);
if (failures === 0) {
  console.log('  ' + green('RESULT: PASS') + ' — every pairing clears its WCAG AA floor in both modes');
} else {
  console.log('  ' + red(`RESULT: FAIL — ${failures} pairing${failures === 1 ? '' : 's'} below the AA floor`) +
    dim(`  (${mechanical.length} mechanical, ${tuning.length} tuning, ${palette.length} palette)`));
}
console.log('');

process.exit(REPORT_ONLY ? 0 : failures > 0 || missing.size > 0 ? 1 : 0);
