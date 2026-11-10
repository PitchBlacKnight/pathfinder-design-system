import { html } from "./_helpers.js";

export default {
  title: "Feedback/Spinner",
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "Figma node 26:250. `.pf-spinner` with `role=status` and an `aria-label`. Sizes `.sm` 16px, default 24px, `.lg` 40px; `.inverse` on filled buttons. Reduced motion slows it rather than stopping it." } } },
  argTypes: { size: { control: "inline-radio", options: ["sm", "md", "lg"] }, label: { control: "text" } },
  args: { size: "md", label: "Loading" },
  render: ({ size, label }) => html`<span class="pf-spinner${size === "md" ? "" : " " + size}" role="status" aria-label="${label}"></span>`,
};

export const Default = {};
export const Sizes = { render: () => html`<div class="sb-row" style="gap:24px"><span class="pf-spinner sm" role="status" aria-label="Loading"></span><span class="pf-spinner" role="status" aria-label="Loading"></span><span class="pf-spinner lg" role="status" aria-label="Loading"></span></div>` };
export const InButton = { render: () => html`<button class="pf-btn pf-btn-primary" disabled><span class="pf-spinner sm inverse" aria-hidden="true"></span> Saving</button>` };
export const InCard = { render: () => html`<div class="pf-card" style="width:320px;display:grid;place-items:center;gap:12px;padding:40px"><span class="pf-spinner lg" role="status" aria-label="Loading partners"></span><span style="color:var(--pfContent_LabelColor);font-size:13px">Loading partners</span></div>` };
