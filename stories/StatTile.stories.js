import { html } from "./_helpers.js";

export default {
  title: "Display/Stat Tile",
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "Figma node 10:554. `.pf-card.pf-stat` with `.pf-stat-label`, `.pf-stat-value` and a `.pf-stat-delta.up|down`. The delta can be swapped for a Sparkline." } } },
  argTypes: { label: { control: "text" }, value: { control: "text" }, delta: { control: "text" }, trend: { control: "inline-radio", options: ["up", "down", "none"] } },
  args: { label: "Active Partners", value: "1,284", delta: "+6.2% vs last quarter", trend: "up" },
  render: ({ label, value, delta, trend }) => html`
    <div class="pf-card pf-stat" style="width:240px">
      <span class="pf-stat-label">${label}</span>
      <span class="pf-stat-value">${value}</span>
      ${trend !== "none" ? html`<span class="pf-stat-delta ${trend}">${trend === "up" ? "↑" : "↓"} ${delta}</span>` : ""}
    </div>`,
};

export const Up = {};
export const Down = { args: { label: "Open Orders", value: "312", delta: "−3.1% vs last quarter", trend: "down" } };
export const WithSparkline = {
  render: () => html`<div class="pf-card pf-stat" style="width:240px"><span class="pf-stat-label">Pipeline MRR</span><span class="pf-stat-value">$4.1M</span><div class="pf-sparkline good"><i style="--v:52"></i><i style="--v:57"></i><i style="--v:54"></i><i style="--v:72"></i><i style="--v:80"></i><i style="--v:89"></i></div></div>`,
};
export const Row = {
  render: () => html`<div class="pf-grid cols-4">
    <div class="pf-card pf-stat"><span class="pf-stat-label">Active Partners</span><span class="pf-stat-value">1,284</span><span class="pf-stat-delta up">↑ +6.2% vs last quarter</span></div>
    <div class="pf-card pf-stat"><span class="pf-stat-label">Pipeline MRR</span><span class="pf-stat-value">$4.1M</span><span class="pf-stat-delta up">↑ +14% vs last quarter</span></div>
    <div class="pf-card pf-stat"><span class="pf-stat-label">Open Orders</span><span class="pf-stat-value">312</span><span class="pf-stat-delta down">↓ −3.1% vs last quarter</span></div>
    <div class="pf-card pf-stat"><span class="pf-stat-label">Avg. Deal Size</span><span class="pf-stat-value">$21.4K</span><span class="pf-stat-delta up">↑ +2.8% vs last quarter</span></div>
  </div>`,
};
