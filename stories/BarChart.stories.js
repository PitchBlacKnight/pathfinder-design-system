import { html } from "./_helpers.js";

const col = (label, v, val = "", extra = "", tone = "") => html`<div class="pf-chart-col${extra}">${val ? html`<span class="pf-chart-val">${val}</span>` : ""}<div class="pf-chart-track"><div class="pf-chart-bar${tone}" style="--v:${v}"></div></div><span class="pf-chart-x">${label}</span></div>`;

export default {
  title: "Charts/Bar Chart",
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "Figma node 100:67. CSS only. `.pf-chart` with `.pf-chart-head`, `.pf-chart-plot` of `.pf-chart-col` columns; `--v` on `.pf-chart-bar` is the value as a percent of the axis max and resolves against `.pf-chart-track`. `.current` highlights a period; `.pf-chart-group` stacks series side by side. Tone classes: `good`, `bad`, `critical`, `muted`, `series-2`, `series-3`." } } },
  argTypes: { showValues: { control: "boolean" } },
  args: { showValues: true },
  render: ({ showValues }) => {
    const d = [["Jan", 52, "$2.4M"], ["Feb", 57, "$2.6M"], ["Mar", 54, "$2.5M"], ["Apr", 65, "$3.0M"], ["May", 72, "$3.3M"], ["Jun", 70, "$3.2M"], ["Jul", 80, "$3.7M"], ["Aug", 89, "$4.1M"]];
    return html`<div class="pf-card" style="width:620px"><div class="pf-chart">
      <div class="pf-chart-head"><div class="pf-stack" style="gap:4px;"><span class="pf-overline pf-chart-title">Pipeline MRR · trailing 8 months</span><span class="pf-chart-total">$4.1M</span></div><span class="pf-badge pf-badge-positive">↑ +14% vs last quarter</span></div>
      <div class="pf-chart-plot">${d.map(([l, v, val], i) => col(l, v, showValues ? val : "", i === d.length - 1 ? " current" : "")).join("")}</div>
      <div class="pf-chart-legend"><span class="pf-chart-key">Closed MRR</span></div>
    </div></div>`;
  },
};

export const Default = {};
export const Grouped = {
  render: () => html`<div class="pf-card" style="width:460px"><div class="pf-chart">
    <div class="pf-chart-head"><div class="pf-stack" style="gap:4px;"><span class="pf-overline pf-chart-title">Orders by quarter</span><span class="pf-chart-total">312</span></div></div>
    <div class="pf-chart-plot">
      ${[["Q1", 48, 62], ["Q2", 55, 71], ["Q3", 70, 66], ["Q4", 74, 92]].map(([l, a, b], i) => html`<div class="pf-chart-col${i === 3 ? " current" : ""}"><div class="pf-chart-track"><div class="pf-chart-group"><div class="pf-chart-bar muted" style="--v:${a}"></div><div class="pf-chart-bar" style="--v:${b}"></div></div></div><span class="pf-chart-x">${l}</span></div>`).join("")}
    </div>
    <div class="pf-chart-legend"><span class="pf-chart-key muted">FY25</span><span class="pf-chart-key">FY26</span></div>
  </div></div>`,
};
export const Thresholds = {
  render: () => html`<div class="pf-card" style="width:460px"><div class="pf-chart">
    <div class="pf-chart-head"><div class="pf-stack" style="gap:4px;"><span class="pf-overline pf-chart-title">Renewal rate · last 6 months</span><span class="pf-chart-total">94%</span></div></div>
    <div class="pf-chart-plot">
      ${[["Mar", 88, " good"], ["Apr", 91, " good"], ["May", 73, " critical"], ["Jun", 86, " good"], ["Jul", 61, " bad"], ["Aug", 94, " good"]].map(([l, v, t], i) => col(l, v, "", i === 5 ? " current" : "", t)).join("")}
    </div>
    <div class="pf-chart-legend"><span class="pf-chart-key good">On target</span><span class="pf-chart-key bad">Below threshold</span></div>
  </div></div>`,
};
