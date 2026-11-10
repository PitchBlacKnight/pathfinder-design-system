import { html } from "./_helpers.js";

export default {
  title: "AI/Approval Step",
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "Figma node 98:350. `section.pf-approval.pending` is the human gate before an agent acts: header, a `dl` of what will happen, a `.note`, then Approve and Edit." } } },
};

export const Pending = {
  render: () => html`<section class="pf-approval pending" style="width:420px"><header>Assist wants to send this quote</header>
    <dl><dt>To</dt><dd>Lumen Technologies</dd><dt>Price</dt><dd>$4,200/mo · 36 months</dd><dt>Expires</dt><dd>Oct 8</dd></dl>
    <span class="note">Nothing is sent until you approve.</span>
    <div class="actions"><button class="pf-btn pf-btn-primary pf-btn-sm">Approve and send</button><button class="pf-btn pf-btn-secondary pf-btn-sm">Edit first</button><button class="pf-btn pf-btn-ghost pf-btn-sm">Cancel</button></div></section>`,
};
