import { html, cls } from "./_helpers.js";

export default {
  title: "Display/Card",
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "Figma node 10:461. `.pf-card` is the surface; add `.pf-card-interactive` when the whole card is clickable. Header and footer are slots, usually a `.pf-row`." } } },
  argTypes: { interactive: { control: "boolean" }, header: { control: "boolean" }, footer: { control: "boolean" } },
  args: { interactive: false, header: true, footer: true },
  render: ({ interactive, header, footer }) => html`
    <div class="${cls("pf-card", interactive && "pf-card-interactive")}" style="width:380px">
      ${header ? html`<div class="pf-row" style="justify-content:space-between;margin-bottom:12px"><span class="pf-overline">Lumen Technologies</span><span class="pf-badge pf-badge-gold">Platinum</span></div>` : ""}
      <h4 style="margin-bottom:6px">10G fiber, Chicago</h4>
      <p style="margin:0;color:var(--pfContent_LabelColor);font-size:13.5px">36-month term at $4,200/mo. Pricing exception approved today; waiting on the partner signature.</p>
      ${footer ? html`<div class="pf-row" style="justify-content:flex-end;margin-top:16px"><button class="pf-btn pf-btn-sm">Details</button><button class="pf-btn pf-btn-primary pf-btn-sm">Open quote</button></div>` : ""}
    </div>`,
};

export const Default = {};
export const Interactive = { args: { interactive: true, footer: false } };
export const BodyOnly = { args: { header: false, footer: false } };
