import { html } from "./_helpers.js";

export default {
  title: "Feedback/Skeleton",
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "Figma node 26:257. `.pf-skeleton` with a shape class: `.line`, `.circle`, `.block`. Width is inline or `.full`. Wrap a loading region in `aria-busy=true` with a label. Reduced motion removes the shimmer." } } },
  argTypes: { shape: { control: "inline-radio", options: ["line", "circle", "block"] } },
  args: { shape: "line" },
  render: ({ shape }) => html`<span class="pf-skeleton ${shape}"></span>`,
};

export const Line = {};
export const Circle = { args: { shape: "circle" } };
export const Block = { args: { shape: "block" } };
export const CommentPlaceholder = {
  render: () => html`<div class="pf-row" style="gap:12px;align-items:flex-start;width:420px" aria-busy="true" aria-label="Loading comment"><span class="pf-skeleton circle"></span><div class="pf-stack" style="gap:8px;flex:1"><span class="pf-skeleton line" style="width:40%"></span><span class="pf-skeleton line full"></span><span class="pf-skeleton line" style="width:70%"></span></div></div>`,
};
export const StatTiles = {
  render: () => html`<div class="pf-grid cols-4" aria-busy="true" aria-label="Loading metrics">${[1, 2, 3, 4].map(() => html`<div class="pf-card pf-stat" style="gap:10px"><span class="pf-skeleton line" style="width:50%"></span><span class="pf-skeleton block" style="width:60%;height:34px"></span><span class="pf-skeleton line" style="width:80%"></span></div>`).join("")}</div>`,
};
