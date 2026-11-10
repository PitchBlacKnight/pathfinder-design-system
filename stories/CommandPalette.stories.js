import { html } from "./_helpers.js";

export default {
  title: "Navigation/Command Palette",
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "Figma node 84:33. `.pf-cmdk[role=dialog]` with a `.query` row, a `.results[role=listbox]` of grouped `[role=option]` rows (matches in `mark`) and a `footer` of key hints." } } },
};

export const Default = {
  render: () => html`<div class="pf-cmdk" role="dialog" aria-label="Command palette" style="width:560px">
    <div class="query"><span>⚲</span><input value="lumen" aria-label="Search"><span class="pf-kbd">Esc</span></div>
    <div class="results" role="listbox">
      <div class="group pf-overline">DEALS</div>
      <div role="option" aria-selected="true"><mark>Lumen</mark> 10G fiber, Chicago <span class="meta">Deal</span></div>
      <div role="option"><mark>Lumen</mark> SD-WAN, 14 sites <span class="meta">Deal</span></div>
      <div class="group pf-overline">ACTIONS</div>
      <div role="option">Create quote for <mark>Lumen</mark> <span class="meta">Action</span></div>
    </div>
    <footer><span><span class="pf-kbd">↑↓</span> Navigate</span><span><span class="pf-kbd">⏎</span> Open</span></footer>
  </div>`,
};
