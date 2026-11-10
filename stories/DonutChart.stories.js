import { html } from "./_helpers.js";

export default {
  title: "Charts/Donut Chart",
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "Figma node 100:174. `.pf-donut > .wrap > .ring` draws segments with a conic gradient from `--a` to `--e` (max 5 segments); `.center` holds the headline. Pair with Chart Legend." } } },
  argTypes: { a: { control: "number" }, b: { control: "number" }, c: { control: "number" }, d: { control: "number" }, headline: { control: "text" } },
  args: { a: 42, b: 28, c: 18, d: 12, headline: "$3.6M" },
  render: ({ a, b, c, d, headline }) => html`<div class="pf-card" style="width:420px"><div class="pf-donut">
    <div class="wrap"><div class="ring" style="--a:${a};--b:${b};--c:${c};--d:${d}" role="img" aria-label="SD-WAN ${a}%, Fiber ${b}%, UCaaS ${c}%, Security ${d}%"></div><div class="center"><strong>${headline}</strong><span>Pipeline</span></div></div>
    <div class="pf-chart-legend" style="flex-direction:column;gap:8px"><span class="pf-chart-key">SD-WAN · ${a}%</span><span class="pf-chart-key series-2">Fiber · ${b}%</span><span class="pf-chart-key series-3">UCaaS · ${c}%</span><span class="pf-chart-key muted">Security · ${d}%</span></div>
  </div></div>`,
};

export const Default = {};
