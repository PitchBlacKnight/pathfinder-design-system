import map from "../handoff/components.json";
import { html } from "./_helpers.js";

export default {
  title: "Handoff/Figma map",
  parameters: { layout: "fullscreen", docs: { description: { component: "Read from `handoff/components.json`: every Figma component, its node id in the Pathfinder library file, the canonical markup, the React prop surface from the docs site, and how each Figma property maps to a class or attribute." } } },
};

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
const FILE = "https://www.figma.com/design/ysLgPqCzELzxKw6KVZdKjE?node-id=";

export const Components = {
  render: () => html`<div style="padding:24px"><p class="sb-label" style="margin:0 0 14px">${map.length} components · ${map.filter((r) => !r[2]).length} without code yet</p>
    <table class="pf-table" style="width:100%">
      <thead><tr><th>Component</th><th>Figma node</th><th>Markup</th><th>Props (docs site)</th><th>Property mapping</th></tr></thead>
      <tbody>${map.map(([name, node, markup, props, notes]) => html`<tr${markup ? "" : ' style="opacity:.55"'}>
        <td class="primary">${esc(name)}</td>
        <td class="mono"><a class="pf-link" href="${FILE}${node.replace(":", "-")}" target="_blank" rel="noopener">${node}</a></td>
        <td class="mono" style="font-size:11.5px;max-width:320px;word-break:break-all">${markup ? esc(markup) : '<span class="pf-badge pf-badge-critical">no class yet</span>'}</td>
        <td style="font-size:12px;color:var(--pfContent_LabelColor);max-width:280px">${esc(props)}</td>
        <td style="font-size:12px;max-width:360px"><ul style="margin:0;padding-left:16px">${(notes || []).map((n) => html`<li>${esc(n)}</li>`).join("")}</ul></td>
      </tr>`).join("")}</tbody>
    </table></div>`,
};
