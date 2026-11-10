import { html } from "./_helpers.js";

export default {
  title: "Display/Tag",
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "Figma node 10:255. `.pf-tag`; `aria-pressed=true` for the selected look, a `.remove` button when dismissable." } } },
  argTypes: { label: { control: "text" }, selected: { control: "boolean" }, dismissable: { control: "boolean" } },
  args: { label: "Platinum", selected: false, dismissable: false },
  render: ({ label, selected, dismissable }) => html`<span class="pf-tag" aria-pressed="${selected}">${label}${dismissable ? html` <button class="remove" aria-label="Remove ${label}">×</button>` : ""}</span>`,
};

export const Default = {};
export const Selected = { args: { selected: true, label: "Gold" } };
export const Dismissable = { args: { dismissable: true, label: "SD-WAN" } };
export const Group = { render: () => html`<div class="sb-row" style="gap:6px"><span class="pf-tag">Platinum</span><span class="pf-tag" aria-pressed="true">Gold</span><span class="pf-tag">Silver</span><span class="pf-tag">Fiber <button class="remove" aria-label="Remove Fiber">×</button></span></div>` };
