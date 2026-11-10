import { html } from "./_helpers.js";

export default {
  title: "Inputs/Search Field",
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "Figma node 79:204. `.pf-search` with a `.lead` icon, a `.pf-input` and an optional shortcut `.pf-kbd`." } } },
  argTypes: { placeholder: { control: "text" }, value: { control: "text" }, shortcut: { control: "text" } },
  args: { placeholder: "Search Pathfinder", value: "", shortcut: "⌘K" },
  render: ({ placeholder, value, shortcut }) => html`<div class="pf-search" style="width:360px"><span class="lead">⚲</span><input class="pf-input" placeholder="${placeholder}" value="${value}" aria-label="${placeholder}">${shortcut ? html`<span class="pf-kbd">${shortcut}</span>` : ""}</div>`,
};

export const Default = {};
export const WithValue = { args: { value: "lumen", shortcut: "" } };
