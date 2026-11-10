import { html } from "./_helpers.js";

export default {
  title: "Display/Avatar",
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "Figma node 10:368. `.pf-avatar.color-N` (1 to 10) maps to the avatar tokens and the React `colorIndex`. The older `.c1` to `.c4` classes still work. `.pf-avatar-group` overlaps a row of them." } } },
  argTypes: { initials: { control: "text" }, color: { control: { type: "range", min: 1, max: 10 } } },
  args: { initials: "MR", color: 1 },
  render: ({ initials, color }) => html`<span class="pf-avatar color-${color}">${initials}</span>`,
};

export const Default = {};
export const AllColors = {
  render: () => html`<div class="sb-row">${Array.from({ length: 10 }, (_, i) => html`<span class="pf-avatar color-${i + 1}" title="color-${i + 1}">${i + 1}</span>`).join("")}</div>`,
};
export const Group = {
  render: () => html`<span class="pf-avatar-group"><span class="pf-avatar color-1">JD</span><span class="pf-avatar color-3">DS</span><span class="pf-avatar color-7">BG</span><span class="pf-avatar color-6">+4</span></span>`,
};
export const LegacyClasses = {
  render: () => html`<div class="sb-row"><span class="pf-avatar c1">c1</span><span class="pf-avatar c2">c2</span><span class="pf-avatar c3">c3</span><span class="pf-avatar c4">c4</span></div>`,
};
