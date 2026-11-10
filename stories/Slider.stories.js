import { html } from "./_helpers.js";

export default {
  title: "Inputs/Slider",
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "Figma node 15:292. Native `input[type=range].pf-slider`." } } },
  argTypes: { value: { control: { type: "range", min: 0, max: 100 } }, disabled: { control: "boolean" } },
  args: { value: 60, disabled: false },
  render: ({ value, disabled }) => html`<div class="pf-field" style="width:320px"><label class="pf-label" for="sb-sl">Discount · ${value}%</label><input class="pf-slider" id="sb-sl" type="range" value="${value}"${disabled ? " disabled" : ""}></div>`,
};

export const Default = {};
export const Disabled = { args: { disabled: true } };
