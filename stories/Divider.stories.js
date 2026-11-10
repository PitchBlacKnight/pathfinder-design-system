import { html } from "./_helpers.js";

export default {
  title: "Display/Divider",
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "Figma node 17:410. `hr.pf-divider`." } } },
};

export const Default = {
  render: () => html`<div style="width:420px"><p style="margin:0 0 12px">Above the rule.</p><hr class="pf-divider"><p style="margin:12px 0 0">Below the rule.</p></div>`,
};
