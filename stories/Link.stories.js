import { html } from "./_helpers.js";

export default {
  title: "Actions/Link",
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "Figma node 80:380. `.pf-link`, add `.external` for an outbound marker." } } },
  argTypes: { label: { control: "text" }, external: { control: "boolean" } },
  args: { label: "View contract", external: false },
  render: ({ label, external }) => html`<a class="pf-link${external ? " external" : ""}" href="#">${label}</a>`,
};

export const Default = {};
export const External = { args: { label: "Supplier portal", external: true } };
export const InBodyText = {
  render: () => html`<p style="max-width:460px;margin:0">Pricing follows the <a class="pf-link" href="#">partner agreement</a> signed in March. Open the <a class="pf-link external" href="#">supplier portal</a> to confirm the term.</p>`,
};
