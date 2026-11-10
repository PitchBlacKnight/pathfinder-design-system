import { html, frame } from "./_helpers.js";

export default {
  title: "Feedback/Modal",
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "Figma node 17:146. `.pf-modal-overlay` holding `.pf-modal` with header, body and footer. Sizes `.sm` `.lg` `.fullscreen`; variants `.danger` `.confirmation`. Open with `data-modal-open=\"id\"`, close with `data-modal-close`; `data-static` on the overlay blocks click-away and Escape (used for destructive confirmations). Focus moves in and is restored on close." } } },
};

const editModal = (open) => html`
  <div class="pf-modal-overlay${open ? " open" : ""}" id="sb-edit" style="display:${open ? "flex" : "none"}" role="dialog" aria-modal="true" aria-labelledby="sb-edit-title">
    <div class="pf-modal">
      <div class="pf-modal-header"><span class="title" id="sb-edit-title">Edit Partner</span><button class="pf-modal-close" data-modal-close aria-label="Close">✕</button></div>
      <div class="pf-modal-body"><div class="pf-stack">
        <div class="pf-field"><label class="pf-label" for="sb-m-name">Partner name <span class="req">*</span></label><input class="pf-input" id="sb-m-name" value="Acme Corp"></div>
        <div class="pf-field"><label class="pf-label" for="sb-m-tier">Tier</label><select class="pf-select" id="sb-m-tier"><option>Gold</option><option>Silver</option><option>Platinum</option></select></div>
        <div class="pf-field"><label class="pf-label" for="sb-m-notes">Notes</label><textarea class="pf-textarea" id="sb-m-notes" placeholder="Internal notes…"></textarea></div>
      </div></div>
      <div class="pf-modal-footer"><button class="pf-btn" data-modal-close>Cancel</button><button class="pf-btn pf-btn-primary" data-modal-close data-toast="Partner saved|Acme Corp was updated.|positive">Save Changes</button></div>
    </div>
  </div>`;

const dangerModal = (open) => html`
  <div class="pf-modal-overlay${open ? " open" : ""}" id="sb-danger" style="display:${open ? "flex" : "none"}" data-static role="dialog" aria-modal="true" aria-labelledby="sb-danger-title">
    <div class="pf-modal sm danger">
      <div class="pf-modal-header"><span class="title" id="sb-danger-title">Delete Partner?</span><button class="pf-modal-close" data-modal-close aria-label="Close">✕</button></div>
      <div class="pf-modal-body">This will permanently remove <strong style="color:var(--pfContent_ForegroundTextColor)">Acme Corp</strong> and all associated orders. This action cannot be undone.
        <label class="pf-check" style="margin-top:14px"><input type="checkbox" id="sb-gate"> I understand</label></div>
      <div class="pf-modal-footer"><button class="pf-btn" data-modal-close>Cancel</button><button class="pf-btn pf-btn-danger" data-modal-close data-confirm-gate="sb-gate" data-toast="Partner deleted|Acme Corp was removed.|negative">Delete</button></div>
    </div>
  </div>`;

export const Interactive = {
  render: () => html`<div class="sb-row"><button class="pf-btn pf-btn-primary" data-modal-open="sb-edit">Open modal</button><button class="pf-btn pf-btn-danger" data-modal-open="sb-danger">Delete partner (gated)</button></div>${editModal(false)}${dangerModal(false)}`,
};
export const Default = { render: () => frame(editModal(true), 560) };
export const Danger = { render: () => frame(dangerModal(true), 420) };
export const Confirmation = {
  render: () => frame(html`<div class="pf-modal-overlay open" style="display:flex" role="dialog" aria-modal="true"><div class="pf-modal sm confirmation">
    <div class="pf-modal-header"><span class="title">Send quote to Lumen?</span><button class="pf-modal-close" aria-label="Close">✕</button></div>
    <div class="pf-modal-body">Quote 4471 ($4,200/mo, 36 months) will be emailed to the partner contact.</div>
    <div class="pf-modal-footer"><button class="pf-btn">Not yet</button><button class="pf-btn pf-btn-primary">Send</button></div>
  </div></div>`, 360),
};
