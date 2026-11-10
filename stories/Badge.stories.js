import { html } from "./_helpers.js";

const VARIANTS = ["neutral", "info", "positive", "critical", "negative", "gold"];

export default {
  title: "Display/Badge",
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "Figma node 10:194. `.pf-badge` plus one status class. Critical is orange; `.pf-badge-warning` and `.pf-badge-active` remain as aliases of critical and positive." } } },
  argTypes: { variant: { control: "select", options: VARIANTS }, label: { control: "text" } },
  args: { variant: "info", label: "▶ In Progress" },
  render: ({ variant, label }) => html`<span class="pf-badge pf-badge-${variant}">${label}</span>`,
};

export const Info = {};
export const Positive = { args: { variant: "positive", label: "✓ Complete" } };
export const Critical = { args: { variant: "critical", label: "⚠ At risk" } };
export const Negative = { args: { variant: "negative", label: "✕ Cancelled" } };
export const Gold = { args: { variant: "gold", label: "★ Platinum" } };
export const Neutral = { args: { variant: "neutral", label: "Draft" } };
export const AllVariants = { render: () => html`<div class="sb-row">${VARIANTS.map((v) => html`<span class="pf-badge pf-badge-${v}">${v}</span>`).join("")}</div>` };
