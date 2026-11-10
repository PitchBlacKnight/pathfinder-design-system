import { html } from "./_helpers.js";

export default {
  title: "Display/Progress",
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "Figma node 10:795. `.pf-progress` with an inner `.bar` whose width is the value. Variant classes: `positive`, `critical`, `negative`." } } },
  argTypes: { value: { control: { type: "range", min: 0, max: 100 } }, variant: { control: "select", options: ["default", "positive", "critical", "negative"] }, label: { control: "text" } },
  args: { value: 64, variant: "default", label: "Site surveys" },
  render: ({ value, variant, label }) => html`
    <div style="width:320px">
      ${label ? html`<div class="pf-row" style="justify-content:space-between;margin-bottom:6px"><span style="font-size:13px">${label}</span><span class="pf-mono" style="font-size:12px">${value}%</span></div>` : ""}
      <div class="pf-progress${variant === "default" ? "" : " " + variant}"><div class="bar" style="width:${value}%"></div></div>
    </div>`,
};

export const Default = {};
export const Positive = { args: { variant: "positive", value: 91, label: "Support satisfaction" } };
export const Critical = { args: { variant: "critical", value: 37, label: "Churn risk" } };
export const Negative = { args: { variant: "negative", value: 18, label: "Invoice timeliness" } };
