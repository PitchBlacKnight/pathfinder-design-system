import { html } from "./_helpers.js";

export default {
  title: "Charts/Sparkline",
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "Figma node 99:22. `.pf-sparkline` of `i` bars, each with `--v`; the last bar is full opacity. Tone with `.good` or `.bad`." } } },
  argTypes: { values: { control: "object" }, tone: { control: "inline-radio", options: ["default", "good", "bad"] } },
  args: { values: [40, 52, 48, 61, 70, 83], tone: "good" },
  render: ({ values, tone }) => html`<div class="pf-sparkline${tone === "default" ? "" : " " + tone}" style="width:120px">${values.map((v) => html`<i style="--v:${v}"></i>`).join("")}</div>`,
};

export const Good = {};
export const Bad = { args: { values: [78, 74, 80, 69, 64, 58], tone: "bad" } };
export const Neutral = { args: { tone: "default" } };
