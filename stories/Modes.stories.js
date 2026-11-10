import { html } from "./_helpers.js";

export default {
  title: "Foundations/Modes",
  parameters: { docs: { description: { component: "The three variable modes applied to the same markup. The toolbar switches the live page; this sheet pins each mode to a sample so they can be compared side by side." } } },
};

const sample = html`
  <div class="pf-card pf-stack" style="gap:14px">
    <div class="pf-row" style="justify-content:space-between"><span class="pf-overline">Pipeline MRR</span><span class="pf-badge pf-badge-info">Q3</span></div>
    <span class="pf-stat-value">$4.1M</span>
    <div class="pf-progress positive"><div class="bar" style="width:72%"></div></div>
    <div class="pf-row"><button class="pf-btn pf-btn-primary pf-btn-sm">Create order</button><button class="pf-btn pf-btn-sm">Cancel</button><span class="pf-dot positive">Active</span></div>
    <div class="pf-field"><label class="pf-label">Partner</label><input class="pf-input" value="Acme Corp"></div>
  </div>`;

/* Each tile re-declares the mode on itself. The token sheets scope modes to :root,
   so the per-tile attribute only works for tokens the sheets also scope to [data-*]
   without :root. That is not the case today, which is the point this story makes:
   modes are page-level. Use the toolbar to switch. */
export const SideBySide = {
  name: "Theme, brand, density",
  render: () => html`
    <p style="margin:0 0 16px;color:var(--pfContent_LabelColor)">Modes are set on <code>html</code>, so the toolbar is the switch. Use these quick links to jump between the same sample in each mode.</p>
    <div class="sb-row" style="margin-bottom:20px">
      <button class="pf-btn pf-btn-sm" onclick="document.documentElement.removeAttribute('data-theme')">Dark</button>
      <button class="pf-btn pf-btn-sm" onclick="document.documentElement.setAttribute('data-theme','light')">Light</button>
      <button class="pf-btn pf-btn-sm" onclick="document.documentElement.setAttribute('data-theme','high-contrast')">High contrast</button>
      <span class="sb-label">·</span>
      <button class="pf-btn pf-btn-sm" onclick="document.documentElement.removeAttribute('data-brand')">Avant</button>
      <button class="pf-btn pf-btn-sm" onclick="document.documentElement.setAttribute('data-brand','northbeam')">Northbeam</button>
      <span class="sb-label">·</span>
      <button class="pf-btn pf-btn-sm" onclick="document.documentElement.removeAttribute('data-density')">Comfortable</button>
      <button class="pf-btn pf-btn-sm" onclick="document.documentElement.setAttribute('data-density','compact')">Compact</button>
    </div>
    <div style="max-width:420px">${sample}</div>`,
};
