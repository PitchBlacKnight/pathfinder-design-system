import { html, cls } from "./_helpers.js";

export default {
  title: "Inputs/Input",
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "Figma node 9:190. `.pf-field` wraps `.pf-label`, `.pf-input` and `.pf-help`. Error is `.pf-field.invalid` plus `aria-invalid`; disabled and readonly are the native attributes." } } },
  argTypes: {
    label: { control: "text" },
    value: { control: "text" },
    placeholder: { control: "text" },
    help: { control: "text" },
    required: { control: "boolean" },
    state: { control: "select", options: ["default", "error", "disabled", "readonly"] },
    type: { control: "select", options: ["text", "email", "date", "number", "password"] },
  },
  args: { label: "Partner name", value: "Rackspace Technology", placeholder: "", help: "Legal entity name as it appears on the contract.", required: true, state: "default", type: "text" },
  render: ({ label, value, placeholder, help, required, state, type }) => html`
    <div class="${cls("pf-field", state === "error" && "invalid")}" style="width:360px">
      <label class="pf-label" for="sb-input">${label}${required ? ' <span class="req">*</span>' : ""}</label>
      <input class="pf-input" id="sb-input" type="${type}" value="${value}" placeholder="${placeholder}"${state === "error" ? ' aria-invalid="true"' : ""}${state === "disabled" ? " disabled" : ""}${state === "readonly" ? " readonly" : ""}>
      ${help ? html`<span class="pf-help">${help}</span>` : ""}
    </div>`,
};

export const Default = {};
export const Error = { args: { label: "Tax ID / EIN", value: "12-345", help: "Must be 9 digits in the format 00-0000000.", state: "error" } };
export const Disabled = { args: { state: "disabled", help: "" } };
export const ReadOnly = { args: { state: "readonly", help: "" } };
export const Placeholder = { args: { value: "", placeholder: "e.g. Acme Corp", help: "", required: false } };
export const Date = { args: { label: "Contract start", type: "date", value: "2026-09-01", help: "", required: false } };
