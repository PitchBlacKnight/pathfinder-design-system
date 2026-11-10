import { html, cls } from "./_helpers.js";

export default {
  title: "Inputs/Select",
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "Figma node 15:112. Native `select.pf-select` with a CSS chevron. Shares field states with Input." } } },
  argTypes: { label: { control: "text" }, state: { control: "select", options: ["default", "error", "disabled"] } },
  args: { label: "Tier", state: "default" },
  render: ({ label, state }) => html`
    <div class="${cls("pf-field", state === "error" && "invalid")}" style="width:240px">
      <label class="pf-label" for="sb-sel">${label}</label>
      <select class="pf-select" id="sb-sel"${state === "disabled" ? " disabled" : ""}${state === "error" ? ' aria-invalid="true"' : ""}>
        <option>Platinum</option><option selected>Gold</option><option>Silver</option>
      </select>
    </div>`,
};

export const Default = {};
export const Error = { args: { state: "error" } };
export const Disabled = { args: { state: "disabled" } };
export const InToolbar = {
  render: () => html`<select class="pf-select" style="width:160px" aria-label="Filter by status"><option value="all">All statuses</option><option>Complete</option><option>In Progress</option><option>Cancelled</option></select>`,
};
