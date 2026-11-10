import { html } from "./_helpers.js";

export default {
  title: "Navigation/Pagination",
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "Figma node 16:267. `.pages` holding `button.pf-page`; `aria-current=page` marks the current one and pathfinder.js moves it on click. Lives in `.pf-table-footer`." } } },
  argTypes: { total: { control: "number" }, current: { control: "number" } },
  args: { total: 5, current: 1 },
  render: ({ total, current }) => html`<div class="pf-table-footer" style="width:520px"><span>Showing ${(current - 1) * 25 + 1} to ${Math.min(current * 25, 112)} of 112 orders</span><div class="pages">${Array.from({ length: total }, (_, i) => html`<button class="pf-page"${i + 1 === current ? ' aria-current="page"' : ""}>${i + 1}</button>`).join("")}</div></div>`,
};

export const Default = {};
