import { html } from "./_helpers.js";

export default {
  title: "Navigation/Tabs",
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "Figma nodes 10:614 and 10:618. `.pf-tabs` holding `button.pf-tab`; `aria-selected` marks the active one and pathfinder.js switches it on click." } } },
  argTypes: { tabs: { control: "object" }, active: { control: "number" } },
  args: { tabs: ["Overview", "Orders", "Contacts", "Activity"], active: 0 },
  render: ({ tabs, active }) => html`<div class="pf-tabs" role="tablist">${tabs.map((t, i) => html`<button class="pf-tab" role="tab" aria-selected="${i === active}">${t}</button>`).join("")}</div>`,
};

export const Default = {};
export const WithCounts = {
  render: () => html`<div class="pf-tabs" role="tablist"><button class="pf-tab" role="tab" aria-selected="true">All <span class="pf-badge pf-badge-neutral">312</span></button><button class="pf-tab" role="tab" aria-selected="false">In progress <span class="pf-badge pf-badge-info">48</span></button><button class="pf-tab" role="tab" aria-selected="false">Cancelled <span class="pf-badge pf-badge-negative">6</span></button></div>`,
};
