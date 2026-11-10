import { html } from "./_helpers.js";

export default {
  title: "AI/Suggested Edit",
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "Figma node 98:243. `section.pf-suggest.pending`: a header with the field name, `del` and `ins` rows, a `.why` line with a citation, then Accept and Reject." } } },
  argTypes: { field: { control: "text" }, from: { control: "text" }, to: { control: "text" }, reason: { control: "text" } },
  args: { field: "Contract term", from: "24 months", to: "36 months", reason: "Partner asked for 36 months in the Oct 6 thread." },
  render: ({ field, from, to, reason }) => html`<section class="pf-suggest pending" style="width:420px"><header>${field} <span class="pf-ai-label suggested">Suggested</span></header>
    <del><b>−</b><span>${from}</span></del><ins><b>+</b><span>${to}</span></ins>
    <div class="why">${reason} <a class="pf-cite" href="#"><span class="n">1</span>Comment</a></div>
    <div class="actions"><button class="pf-btn pf-btn-success pf-btn-sm">Accept</button><button class="pf-btn pf-btn-secondary pf-btn-sm">Reject</button></div></section>`,
};

export const Pending = {};
