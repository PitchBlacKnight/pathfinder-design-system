import { html } from "./_helpers.js";

export default {
  title: "Display/Tooltip",
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "Figma node 17:240. `.pf-tooltip[role=tooltip]`, max width 240px. Placement is handled by the consumer." } } },
  argTypes: { label: { control: "text" } },
  args: { label: "Export as CSV" },
  render: ({ label }) => html`<span class="pf-tooltip" role="tooltip">${label}</span>`,
};

export const Default = {};
export const LongText = { args: { label: "Exports the filtered rows only. Clear the filter first to export every order." } };
