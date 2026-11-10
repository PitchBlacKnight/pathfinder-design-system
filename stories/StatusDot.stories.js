import { html } from "./_helpers.js";

const STATUS = ["positive", "critical", "negative", "info", "neutral"];

export default {
  title: "Display/Status Dot",
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "Figma node 80:496. `.pf-dot` plus a status class; the label is the text content. Neutral is the bare class." } } },
  argTypes: { status: { control: "select", options: STATUS }, label: { control: "text" } },
  args: { status: "positive", label: "Active" },
  render: ({ status, label }) => html`<span class="pf-dot${status === "neutral" ? "" : " " + status}">${label}</span>`,
};

export const Default = {};
export const AllStatuses = {
  render: () => html`<div class="sb-row" style="gap:16px"><span class="pf-dot positive">Active</span><span class="pf-dot critical">At risk</span><span class="pf-dot negative">Down</span><span class="pf-dot info">Provisioning</span><span class="pf-dot">Inactive</span></div>`,
};
