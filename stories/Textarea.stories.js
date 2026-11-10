import { html, cls } from "./_helpers.js";

export default {
  title: "Inputs/Textarea",
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "Figma node 79:16. `.pf-textarea` inside a `.pf-field`; min height 88px, vertical resize." } } },
  argTypes: { label: { control: "text" }, value: { control: "text" }, help: { control: "text" }, state: { control: "select", options: ["default", "error", "disabled", "readonly"] } },
  args: { label: "Account notes", value: "Migrating from a legacy reseller agreement. Primary contact prefers email over calls.", help: "Visible to the partner team only.", state: "default" },
  render: ({ label, value, help, state }) => html`
    <div class="${cls("pf-field", state === "error" && "invalid")}" style="width:420px">
      <label class="pf-label" for="sb-ta">${label}</label>
      <textarea class="pf-textarea" id="sb-ta"${state === "error" ? ' aria-invalid="true"' : ""}${state === "disabled" ? " disabled" : ""}${state === "readonly" ? " readonly" : ""}>${value}</textarea>
      ${help ? html`<span class="pf-help">${help}</span>` : ""}
    </div>`,
};

export const Default = {};
export const Error = { args: { state: "error", help: "Notes are required for Platinum accounts." } };
export const Empty = { args: { value: "", help: "" } };
