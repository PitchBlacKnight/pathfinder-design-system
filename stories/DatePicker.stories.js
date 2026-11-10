import { html } from "./_helpers.js";

export default {
  title: "Inputs/Date Picker",
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "Figma node 15:570. `.pf-datepicker` wraps a `.pf-search` input with `data-datepicker` and a `.pf-calendar` that renders itself from `data-month` and `data-selected`. Clicking the input opens it; picking a day fills the input as MM/DD/YYYY. `.pf-calendar` also works standalone. Day states: `.today`, `[aria-selected]`, `.muted`, `.in-range`." } } },
};

const render = (cal) => { document.querySelectorAll(".pf-calendar[data-month]").forEach((c) => { if (!c.children.length) window.Pathfinder.renderCalendar(c); }); };

export const Closed = {
  render: () => html`<div class="pf-field" style="width:280px"><label class="pf-label" for="sb-dp">Start date</label>
    <div class="pf-datepicker"><div class="pf-search"><span class="lead">▦</span><input class="pf-input" id="sb-dp" data-datepicker placeholder="MM/DD/YYYY"></div>
    <div class="pf-calendar" data-month="2026-10" data-today="2026-10-04"></div></div></div>`,
  play: render,
};

export const Open = {
  render: () => html`<div class="pf-field" style="width:280px;height:420px"><label class="pf-label" for="sb-dp2">Start date</label>
    <div class="pf-datepicker open"><div class="pf-search"><span class="lead">▦</span><input class="pf-input" id="sb-dp2" data-datepicker value="10/14/2026"></div>
    <div class="pf-calendar" data-month="2026-10" data-selected="2026-10-14" data-today="2026-10-04"></div></div></div>`,
  play: render,
};

export const CalendarOnly = {
  render: () => html`<div class="pf-calendar" data-month="2026-10" data-selected="2026-10-14" data-today="2026-10-04"></div>`,
  play: render,
};

export const Range = {
  name: "Range (static markup)",
  render: () => html`<div class="pf-calendar"><header><button class="pf-btn pf-btn-ghost pf-btn-icon pf-btn-sm" aria-label="Previous month">‹</button><span class="month">October 2026</span><button class="pf-btn pf-btn-ghost pf-btn-icon pf-btn-sm" aria-label="Next month">›</button></header>
    <div class="grid" role="grid">${"SMTWTFS".split("").map((d) => html`<span class="dow">${d}</span>`).join("")}
    ${[27, 28, 29, 30].map((d) => html`<button class="day muted" disabled>${d}</button>`).join("")}
    ${Array.from({ length: 31 }, (_, i) => i + 1).map((d) => html`<button class="day${d === 4 ? " today" : ""}${d > 6 && d < 14 ? " in-range" : ""}"${d === 6 || d === 14 ? ' aria-selected="true"' : ""}>${d}</button>`).join("")}
    </div></div>`,
};
