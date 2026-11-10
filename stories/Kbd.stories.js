import { html } from "./_helpers.js";

export default {
  title: "Actions/Kbd",
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "Figma node 80:430. Keyboard key label, used inline in menus, search fields and the command palette footer." } } },
  argTypes: { keys: { control: "text" } },
  args: { keys: "⌘ K" },
  render: ({ keys }) => html`<span class="sb-row" style="gap:6px">${keys.split(" ").map((k) => html`<span class="pf-kbd">${k}</span>`).join("")}</span>`,
};

export const Shortcut = {};
export const Single = { args: { keys: "Esc" } };
