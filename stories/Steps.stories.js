import { html } from "./_helpers.js";

export default {
  title: "Navigation/Steps",
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "Figma node 16:105 (Nav / Stepper). `ol.pf-steps`; done steps get `.done`, the current one `aria-current=step`." } } },
  argTypes: { steps: { control: "object" }, current: { control: "number" } },
  args: { steps: ["Company", "Contact", "Review"], current: 1 },
  render: ({ steps, current }) => html`<ol class="pf-steps">${steps.map((s, i) => html`<li${i < current ? ' class="done"' : ""}${i === current ? ' aria-current="step"' : ""}><span class="n">${i < current ? "✓" : i + 1}</span>${s}</li>`).join("")}</ol>`,
};

export const Default = {};
export const AllDone = { args: { steps: ["Company", "Contact", "Review", "Submit"], current: 3 } };
