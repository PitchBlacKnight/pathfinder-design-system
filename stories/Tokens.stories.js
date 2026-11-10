import { html } from "./_helpers.js";

export default {
  title: "Foundations/Tokens",
  parameters: { docs: { description: { component: "Every `--pf*` custom property currently resolving on `:root`, read live from the loaded stylesheets. Switch theme, brand or density in the toolbar and the swatches re-resolve. Colors are grouped by the first segment of the token name." } } },
};

function readTokens() {
  const names = new Set();
  for (const sheet of document.styleSheets) {
    let rules;
    try { rules = sheet.cssRules; } catch { continue; }
    for (const rule of rules) {
      if (!rule.selectorText || !rule.selectorText.startsWith(":root")) continue;
      for (const prop of rule.style) if (prop.startsWith("--pf")) names.add(prop);
    }
  }
  const cs = getComputedStyle(document.documentElement);
  return [...names].sort().map((n) => ({ name: n, value: cs.getPropertyValue(n).trim() }));
}

const isColor = (v) => /^(#|rgb|hsl|color|transparent|oklch)/i.test(v) && !/,\s*[a-z-]+\s*$/i.test(v);
const group = (name) => {
  const n = name.replace(/^--pf-?/, "");
  const m = n.match(/^([a-z0-9]+|[A-Z][a-z0-9]*)/);
  return m ? m[1] : "Global";
};

function swatchGrid(tokens) {
  const groups = {};
  tokens.forEach((t) => (groups[group(t.name)] ||= []).push(t));
  return Object.entries(groups)
    .map(([g, list]) => html`
      <section class="sb-stack" style="gap:10px;margin-bottom:28px">
        <span class="pf-overline">${g} · ${list.length}</span>
        <div class="sb-swatches">
          ${list.map((t) => html`<div class="sb-swatch"><i style="background:${t.value}"></i><div style="min-width:0"><b title="${t.name}">${t.name.replace("--pf", "")}</b><span>${t.value}</span></div></div>`).join("")}
        </div>
      </section>`)
    .join("");
}

export const Colors = {
  render: () => {
    const tokens = readTokens().filter((t) => isColor(t.value));
    return html`<p class="sb-label" style="margin:0 0 18px">${tokens.length} color tokens resolving now</p>${swatchGrid(tokens)}`;
  },
};

export const Dimensions = {
  render: () => {
    const tokens = readTokens().filter((t) => /^-?\d+(\.\d+)?(px|rem|em|%)$/.test(t.value));
    return html`
      <p class="sb-label" style="margin:0 0 18px">${tokens.length} size, space and radius tokens</p>
      <table class="pf-table" style="width:100%">
        <thead><tr><th>Token</th><th>Value</th><th>Preview</th></tr></thead>
        <tbody>${tokens.map((t) => html`<tr><td class="mono">${t.name}</td><td class="mono">${t.value}</td><td><span style="display:inline-block;height:10px;border-radius:2px;background:var(--pfHighlightColor);width:${/px$/.test(t.value) ? Math.min(parseFloat(t.value), 320) : 40}px"></span></td></tr>`).join("")}</tbody>
      </table>`;
  },
};

export const Everything = {
  render: () => {
    const tokens = readTokens();
    return html`
      <p class="sb-label" style="margin:0 0 18px">${tokens.length} tokens on :root</p>
      <table class="pf-table" style="width:100%"><thead><tr><th>Token</th><th>Resolved value</th></tr></thead>
      <tbody>${tokens.map((t) => html`<tr><td class="mono">${t.name}</td><td class="mono" style="color:var(--pfContent_LabelColor)">${t.value}</td></tr>`).join("")}</tbody></table>`;
  },
};
