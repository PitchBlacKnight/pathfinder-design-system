import { html, frame } from "./_helpers.js";

export default {
  title: "Feedback/Drawer",
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "Figma node 83:150. `aside.pf-drawer[role=dialog]` fixed to the right edge, 480px (`.lg` 640px), with `header`, `.body` and `footer`." } } },
  argTypes: { size: { control: "inline-radio", options: ["md", "lg"] } },
  args: { size: "md" },
  render: ({ size }) => frame(html`
    <aside class="pf-drawer${size === "lg" ? " lg" : ""}" role="dialog" aria-labelledby="sb-dr-title">
      <header><div style="flex:1"><h4 id="sb-dr-title">Lumen 10G fiber, Chicago</h4><span style="font-size:13px;color:var(--pfContent_LabelColor)">Quote 4471 · Updated 2h ago</span></div><button class="pf-btn pf-btn-ghost pf-btn-icon pf-btn-sm" aria-label="Close">×</button></header>
      <div class="body">
        <div class="pf-row" style="gap:8px"><span class="pf-badge pf-badge-info">In progress</span><span class="pf-dot critical">Expires Oct 8</span></div>
        <div class="pf-field"><label class="pf-label">Monthly price</label><input class="pf-input" value="$4,200"></div>
        <div class="pf-field"><label class="pf-label">Term</label><select class="pf-select"><option>24 months</option><option selected>36 months</option></select></div>
        <div class="pf-accordion"><details open><summary>Sites</summary><div class="body">3 locations.</div></details></div>
      </div>
      <footer><button class="pf-btn">Cancel</button><button class="pf-btn pf-btn-primary">Save</button></footer>
    </aside>`, 560),
};

export const Default = {};
export const Large = { args: { size: "lg" } };
