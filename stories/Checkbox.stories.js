import { html } from "./_helpers.js";

export default {
  title: "Inputs/Checkbox",
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "Figma node 10:62. `label.pf-check > input[type=checkbox]`. Indeterminate is set from JS with the `indeterminate` property." } } },
  argTypes: { label: { control: "text" }, checked: { control: "boolean" }, disabled: { control: "boolean" } },
  args: { label: "Email me when an order changes status", checked: true, disabled: false },
  render: ({ label, checked, disabled }) => html`<label class="pf-check"><input type="checkbox"${checked ? " checked" : ""}${disabled ? " disabled" : ""}> ${label}</label>`,
};

export const Checked = {};
export const Unchecked = { args: { checked: false } };
export const Disabled = { args: { disabled: true } };
export const Indeterminate = {
  render: () => html`<label class="pf-check"><input type="checkbox" id="sb-ind"> Select all (2 of 5)</label><script>document.getElementById('sb-ind').indeterminate = true;</script>`,
  play: async () => { const el = document.getElementById("sb-ind"); if (el) el.indeterminate = true; },
};
export const Group = {
  render: () => html`<div class="sb-stack" style="gap:8px">
    <label class="pf-check"><input type="checkbox" checked> SD-WAN</label>
    <label class="pf-check"><input type="checkbox" checked> Fiber</label>
    <label class="pf-check"><input type="checkbox"> UCaaS</label>
    <label class="pf-check"><input type="checkbox" disabled> Security (unavailable)</label>
  </div>`,
};
