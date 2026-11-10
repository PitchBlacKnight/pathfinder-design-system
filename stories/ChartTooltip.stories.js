import { html } from "./_helpers.js";

export default {
  title: "Charts/Chart Tooltip",
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "Figma node 99:164. `.pf-chart-tip`: a title span then `.row` lines with an `i` swatch, label and `strong` value." } } },
  argTypes: { title: { control: "text" } },
  args: { title: "May 2026" },
  render: ({ title }) => html`<div class="pf-chart-tip"><span>${title}</span><div class="row"><i></i>Pipeline<strong>$66K</strong></div><div class="row"><i></i>Closed<strong>$41K</strong></div></div>`,
};

export const Default = {};
