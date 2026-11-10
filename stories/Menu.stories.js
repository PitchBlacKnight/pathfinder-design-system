import { html } from "./_helpers.js";

export default {
  title: "Actions/Menu",
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "Figma node 82:150. `.pf-menu[role=menu]` with `button[role=menuitem]`, optional `.section` headers, `hr` dividers, `.destructive` and `aria-disabled`." } } },
};

export const Default = {
  render: () => html`
    <div class="pf-menu" role="menu" style="width:240px">
      <div class="section pf-overline">DEAL</div>
      <button role="menuitem"><span class="label">Edit details</span><span class="pf-kbd">⌘E</span></button>
      <button role="menuitem"><span class="label">Duplicate</span></button>
      <button role="menuitem" aria-disabled="true"><span class="label">Archive</span></button>
      <hr>
      <button role="menuitem" class="destructive"><span class="label">Delete deal</span></button>
    </div>`,
};

export const Plain = {
  render: () => html`
    <div class="pf-menu" role="menu" style="width:200px">
      <button role="menuitem"><span class="label">Open</span></button>
      <button role="menuitem"><span class="label">Rename</span></button>
      <button role="menuitem"><span class="label">Move to folder</span></button>
    </div>`,
};
