import { html } from "./_helpers.js";

export default {
  title: "Display/Accordion",
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "Figma nodes 15:767 and 15:771. Native `details`/`summary` inside `.pf-accordion`, so it needs no JS." } } },
};

export const Default = {
  render: () => html`<div class="pf-accordion" style="width:420px">
    <details open><summary>Contract terms</summary><div class="body">36 months, auto renew off. Pricing exception approved Oct 6.</div></details>
    <details><summary>Sites</summary><div class="body">3 locations: Chicago, Naperville, Schaumburg.</div></details>
    <details><summary>Billing</summary><div class="body">Monthly, net 30.</div></details>
  </div>`,
};
