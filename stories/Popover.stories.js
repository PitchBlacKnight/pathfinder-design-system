import { html } from "./_helpers.js";

export default {
  title: "Display/Popover",
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "Figma node 17:345. `.pf-popover` shares its surface with Menu: popover radius, 16px padding, Shadow3." } } },
};

export const Default = {
  render: () => html`<div class="pf-popover" style="width:280px"><strong style="display:block;margin-bottom:6px">Pricing exception</strong><span style="color:var(--pfContent_LabelColor);font-size:13px">Approved by Jordan Lee on Oct 6. Valid until the quote expires.</span></div>`,
};
