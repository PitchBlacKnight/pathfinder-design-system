import { html } from "./_helpers.js";

export default {
  title: "Inputs/Toggle",
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "Figma node 10:129. `label.pf-toggle` wrapping a hidden checkbox, a `.track` and a `.pf-toggle-label`. The track moves with `:checked`." } } },
  argTypes: { label: { control: "text" }, on: { control: "boolean" }, disabled: { control: "boolean" } },
  args: { label: "Weekly pipeline digest", on: true, disabled: false },
  render: ({ label, on, disabled }) => html`<label class="pf-toggle"><input type="checkbox"${on ? " checked" : ""}${disabled ? " disabled" : ""}><span class="track"></span><span class="pf-toggle-label">${label}</span></label>`,
};

export const On = {};
export const Off = { args: { on: false } };
export const NoLabel = { args: { label: "" } };
export const Group = {
  render: () => html`<div class="sb-stack" style="gap:12px">
    <span class="pf-overline">Notifications</span>
    <label class="pf-toggle"><input type="checkbox" checked><span class="track"></span><span class="pf-toggle-label">Email me when an order changes status</span></label>
    <label class="pf-toggle"><input type="checkbox"><span class="track"></span><span class="pf-toggle-label">Weekly pipeline digest</span></label>
    <label class="pf-toggle"><input type="checkbox" checked><span class="track"></span><span class="pf-toggle-label">Alert on churn-risk threshold breach</span></label>
  </div>`,
};
