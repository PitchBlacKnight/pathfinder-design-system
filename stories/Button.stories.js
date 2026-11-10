import { html, cls } from "./_helpers.js";

const VARIANT = { primary: "pf-btn-primary", secondary: "pf-btn-secondary", ghost: "pf-btn-ghost", lite: "pf-btn-lite", danger: "pf-btn-danger", success: "pf-btn-success" };

export default {
  title: "Actions/Button",
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "Figma node 8:464. Variant is the class, size is a second class, state is the native attribute. Emphasized maps to `.pf-btn-primary`, Default to `.pf-btn-secondary`, Reject to `.pf-btn-danger`, Accept to `.pf-btn-success`." } } },
  argTypes: {
    variant: { control: "select", options: Object.keys(VARIANT) },
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    label: { control: "text" },
    icon: { control: "select", options: ["", "＋", "▶", "✓", "→"] },
    disabled: { control: "boolean" },
  },
  args: { variant: "primary", size: "md", label: "Create order", icon: "＋", disabled: false },
  render: ({ variant, size, label, icon, disabled }) =>
    html`<button class="${cls("pf-btn", VARIANT[variant], size !== "md" && `pf-btn-${size}`)}"${disabled ? " disabled" : ""}>${icon ? icon + " " : ""}${label}</button>`,
};

export const Primary = {};
export const Secondary = { args: { variant: "secondary", icon: "" } };
export const Ghost = { args: { variant: "ghost", icon: "" } };
export const Lite = { args: { variant: "lite", icon: "" } };
export const Danger = { args: { variant: "danger", label: "Delete partner", icon: "" } };
export const Success = { args: { variant: "success", label: "Approve", icon: "✓" } };
export const Disabled = { args: { disabled: true } };

export const AllVariants = {
  render: () => html`
    <div class="sb-stack">
      ${["sm", "md", "lg"].map((s) => html`<div class="sb-row"><span class="sb-label" style="width:40px">${s}</span>${Object.entries(VARIANT).map(([k, c]) => html`<button class="${cls("pf-btn", c, s !== "md" && `pf-btn-${s}`)}">${k}</button>`).join("")}</div>`).join("")}
      <div class="sb-row"><span class="sb-label" style="width:40px">off</span>${Object.values(VARIANT).map((c) => html`<button class="pf-btn ${c}" disabled>disabled</button>`).join("")}</div>
    </div>`,
};
