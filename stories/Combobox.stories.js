import { html } from "./_helpers.js";

export default {
  title: "Inputs/Combobox",
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "Figma node 101:92. Multi-select `.pf-combobox > .control` holding `.pf-tag` chips with `.remove` buttons and a free text input." } } },
  argTypes: { selected: { control: "object" }, placeholder: { control: "text" } },
  args: { selected: ["SD-WAN", "Fiber"], placeholder: "Add technology" },
  render: ({ selected, placeholder }) => html`
    <div class="pf-field" style="width:400px"><label class="pf-label">Technology</label>
      <div class="pf-combobox"><div class="control">
        ${selected.map((s) => html`<span class="pf-tag">${s} <button class="remove" aria-label="Remove ${s}">×</button></span>`).join("")}
        <input placeholder="${placeholder}" aria-label="${placeholder}">
      </div></div>
    </div>`,
};

export const Default = {};
export const Empty = { args: { selected: [] } };
