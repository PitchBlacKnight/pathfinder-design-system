import { html } from "./_helpers.js";

export default {
  title: "Navigation/Tree View",
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "Figma node 84:196. `ul.pf-tree[role=tree]`, `li[role=treeitem]` with `aria-expanded` and `aria-selected`, each row in a `.row` with an optional `.count`." } } },
};

export const Default = {
  render: () => html`<ul class="pf-tree" role="tree" style="width:320px">
    <li role="treeitem" aria-expanded="true"><div class="row">▾ Lumen Technologies <span class="count">3</span></div>
      <ul role="group">
        <li role="treeitem" aria-expanded="true"><div class="row">▾ Chicago, IL <span class="count">2</span></div>
          <ul role="group"><li role="treeitem" aria-selected="true"><div class="row">CHI-10G-0042</div></li><li role="treeitem"><div class="row">CHI-1G-0187</div></li></ul></li>
        <li role="treeitem" aria-expanded="false"><div class="row">▸ Naperville, IL <span class="count">1</span></div></li>
      </ul></li>
    <li role="treeitem" aria-expanded="false"><div class="row">▸ Harbor Logistics <span class="count">5</span></div></li>
  </ul>`,
};
