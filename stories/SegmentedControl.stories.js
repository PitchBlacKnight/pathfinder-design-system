import { html } from "./_helpers.js";

export default {
  title: "Inputs/Segmented Control",
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "Figma node 82:80. `.pf-segmented[role=radiogroup]` with `button[role=radio]`; `aria-checked` marks the selection." } } },
  argTypes: { options: { control: "object" }, selected: { control: "number" } },
  args: { options: ["Table", "Board", "Map"], selected: 0 },
  render: ({ options, selected }) => html`<div class="pf-segmented" role="radiogroup" aria-label="View">${options.map((o, i) => html`<button role="radio" aria-checked="${i === selected}">${o}</button>`).join("")}</div>`,
};

export const Default = {};
export const TwoOptions = { args: { options: ["Monthly", "Annual"], selected: 1 } };
