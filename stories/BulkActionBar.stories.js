import { html } from "./_helpers.js";

export default {
  title: "Feedback/Bulk Action Bar",
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "Figma node 83:183. `.pf-bulkbar`: select-all check, `.count`, `.sep` dividers and ghost or danger small buttons." } } },
  argTypes: { count: { control: "number" } },
  args: { count: 3 },
  render: ({ count }) => html`<div class="pf-bulkbar"><label class="pf-check"><input type="checkbox" checked aria-label="Select all"></label><span class="count">${count} selected</span><span class="sep"></span><button class="pf-btn pf-btn-ghost pf-btn-sm">Approve</button><button class="pf-btn pf-btn-ghost pf-btn-sm">Export</button><button class="pf-btn pf-btn-danger pf-btn-sm">Reject</button><span class="sep"></span><button class="pf-btn pf-btn-ghost pf-btn-sm">Clear</button></div>`,
};

export const Default = {};
