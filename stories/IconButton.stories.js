import { html, cls } from "./_helpers.js";

export default {
  title: "Actions/Icon Button",
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "Figma node 80:15. A `.pf-btn` with `.pf-btn-icon`; the width locks to the element height. `aria-label` is required." } } },
  argTypes: {
    variant: { control: "select", options: ["secondary", "primary", "ghost", "danger"] },
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    icon: { control: "text" },
    label: { control: "text", description: "aria-label" },
    disabled: { control: "boolean" },
  },
  args: { variant: "ghost", size: "md", icon: "⋯", label: "More actions", disabled: false },
  render: ({ variant, size, icon, label, disabled }) =>
    html`<button class="${cls("pf-btn", `pf-btn-${variant}`, "pf-btn-icon", size !== "md" && `pf-btn-${size}`)}" aria-label="${label}"${disabled ? " disabled" : ""}>${icon}</button>`,
};

export const Ghost = {};
export const Primary = { args: { variant: "primary", icon: "➤", label: "Send" } };
export const Sizes = {
  render: () => html`<div class="sb-row">
    <button class="pf-btn pf-btn-secondary pf-btn-icon pf-btn-sm" aria-label="Edit">✎</button>
    <button class="pf-btn pf-btn-secondary pf-btn-icon" aria-label="Edit">✎</button>
    <button class="pf-btn pf-btn-secondary pf-btn-icon pf-btn-lg" aria-label="Edit">✎</button>
  </div>`,
};
