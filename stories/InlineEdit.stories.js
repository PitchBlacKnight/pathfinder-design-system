import { html } from "./_helpers.js";

export default {
  title: "Inputs/Inline Edit",
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "Figma node 101:267. `.pf-inline-edit[tabindex=0]` reads as text until focused, then takes the field look." } } },
  argTypes: { value: { control: "text" }, label: { control: "text" } },
  args: { value: "Sara Kim", label: "Account manager" },
  render: ({ value, label }) => html`<div class="pf-field" style="width:280px"><label class="pf-label">${label}</label><div class="pf-inline-edit" tabindex="0">${value}</div></div>`,
};

export const Default = {};
