import { html } from "./_helpers.js";

export default {
  title: "Feedback/Error Card",
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "Figma node 27:320. `.pf-error-card`: a `.message` row (`.icon`, `.title`, `.desc`) then `.actions` with a small primary and secondary button. Use inside the surface that failed; use Error Page when the whole route failed." } } },
  argTypes: { title: { control: "text" }, description: { control: "text" }, primary: { control: "text" }, secondary: { control: "text" } },
  args: { title: "Failed to load partner data", description: "This issue has been logged. Our team has been notified.", primary: "Try again", secondary: "Contact support" },
  render: ({ title, description, primary, secondary }) => html`
    <div class="pf-error-card" style="width:480px">
      <div class="message"><span class="icon">✕</span><div><span class="title">${title}</span><span class="desc">${description}</span></div></div>
      <div class="actions"><button class="pf-btn pf-btn-primary pf-btn-sm">${primary}</button>${secondary ? html`<button class="pf-btn pf-btn-secondary pf-btn-sm">${secondary}</button>` : ""}</div>
    </div>`,
};

export const Default = {};
export const SingleAction = { args: { secondary: "", title: "Export failed", description: "The CSV could not be generated. Try again in a moment." } };
