import { html } from "./_helpers.js";

export default {
  title: "Inputs/Number Stepper",
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "Figma node 101:195. `.pf-number` with two ghost icon buttons around a native number input." } } },
  argTypes: { value: { control: "number" }, label: { control: "text" } },
  args: { value: 3, label: "Sites" },
  render: ({ value, label }) => html`
    <div class="pf-field"><label class="pf-label">${label}</label>
      <div class="pf-number"><button class="pf-btn pf-btn-ghost pf-btn-icon pf-btn-sm" aria-label="Decrease">−</button><input type="number" value="${value}" aria-label="${label}"><button class="pf-btn pf-btn-ghost pf-btn-icon pf-btn-sm" aria-label="Increase">+</button></div>
    </div>`,
};

export const Default = {};
