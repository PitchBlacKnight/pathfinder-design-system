import { html } from "./_helpers.js";

export default {
  title: "Inputs/Radio",
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "Figma node 78:468. `fieldset.pf-radio-group` with a `legend`, each option a `label.pf-radio`." } } },
  argTypes: { legend: { control: "text" }, selected: { control: "inline-radio", options: ["12", "24", "36"] } },
  args: { legend: "Contract term", selected: "24" },
  render: ({ legend, selected }) => html`
    <fieldset class="pf-radio-group"><legend>${legend}</legend>
      ${["12", "24", "36"].map((m) => html`<label class="pf-radio"><input type="radio" name="sb-term"${m === selected ? " checked" : ""}> ${m} months</label>`).join("")}
    </fieldset>`,
};

export const Default = {};
export const WithDisabled = {
  render: () => html`<fieldset class="pf-radio-group"><legend>Billing</legend>
    <label class="pf-radio"><input type="radio" name="sb-bill" checked> Monthly</label>
    <label class="pf-radio"><input type="radio" name="sb-bill"> Annual</label>
    <label class="pf-radio"><input type="radio" name="sb-bill" disabled> Prepaid (Platinum only)</label>
  </fieldset>`,
};
