import { html } from "./_helpers.js";

export default {
  title: "Display/List Item",
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "Figma node 82:276. `a.pf-list-item` with `.lead`, `.text` (`.title`, `.desc`) and `.meta`. `aria-selected` marks the active row." } } },
};

export const Default = {
  render: () => html`<div class="sb-stack" style="gap:8px;width:420px">
    <a class="pf-list-item" href="#"><span class="lead">▦</span><span class="text"><span class="title">Lumen 10G fiber, Chicago</span><br><span class="desc">Quote 4471 · Updated 2h ago</span></span><span class="meta">$4,200/mo</span></a>
    <a class="pf-list-item" href="#" aria-selected="true"><span class="lead">▦</span><span class="text"><span class="title">Thornwood SD-WAN</span></span><span class="meta">$9,800/mo</span></a>
    <a class="pf-list-item" href="#"><span class="lead">▦</span><span class="text"><span class="title">Harbor UCaaS</span><br><span class="desc">320 seats · Avery Chen</span></span><span class="meta">$6,100/mo</span></a>
  </div>`,
};
