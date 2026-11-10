import { html, cls } from "./_helpers.js";

const ROWS = [
  ["PF-001", "8×8", "07/28/2021", "$47,439", "complete", "c1", "JD"],
  ["PF-002", "Fuze", "08/18/2021", "$12,763", "progress", "c2", "BG"],
  ["PF-003", "Vistro", "08/22/2021", "$4,334", "cancelled", "c3", "DS"],
  ["PF-004", "TierPoint", "10/18/2021", "$31,574", "complete", "c1", "JD"],
  ["PF-005", "Rackspace", "11/02/2021", "$8,200", "progress", "c2", "BG"],
];
const BADGE = { complete: '<span class="pf-badge pf-badge-positive">✓ Complete</span>', progress: '<span class="pf-badge pf-badge-info">▶ In Progress</span>', cancelled: '<span class="pf-badge pf-badge-negative">✕ Cancelled</span>' };

export default {
  title: "Data/Data Table",
  tags: ["autodocs"],
  parameters: { layout: "fullscreen", docs: { description: { component: "Figma nodes 11:38, 11:78 and 11:82. `.pf-table-wrap` (`.striped`, `.compact`) around a toolbar, `table.pf-table` and a footer. Behaviors by attribute: `th[data-sort]` sorts, `[data-select-all]` and `[data-select-row]` drive selection, `select[data-filter-table=\"#id\"]` filters rows by `data-status`." } } },
  argTypes: { striped: { control: "boolean" }, compact: { control: "boolean" }, selectable: { control: "boolean" } },
  args: { striped: false, compact: false, selectable: true },
  render: ({ striped, compact, selectable }) => html`
    <div style="padding:24px">
    <div class="${cls("pf-table-wrap", striped && "striped", compact && "compact")}">
      <div class="pf-table-toolbar"><span class="title">Projects</span>
        <select class="pf-select" style="width:160px" data-filter-table="#sb-table" aria-label="Filter by status"><option value="all">All statuses</option><option value="complete">Complete</option><option value="progress">In Progress</option><option value="cancelled">Cancelled</option></select>
        <button class="pf-btn pf-btn-primary">+ New Project</button></div>
      <table class="pf-table" id="sb-table">
        <thead><tr>${selectable ? '<th style="width:36px"><input type="checkbox" data-select-all aria-label="Select all"></th>' : ""}<th data-sort>ID</th><th data-sort>Client</th><th data-sort>Started</th><th data-sort>Value</th><th data-sort>Status</th><th>Assigned</th><th>Action</th></tr></thead>
        <tbody>${ROWS.map((r) => html`<tr data-status="${r[4]}">${selectable ? '<td><input type="checkbox" data-select-row aria-label="Select row"></td>' : ""}<td class="mono">${r[0]}</td><td class="primary">${r[1]}</td><td class="mono">${r[2]}</td><td class="mono">${r[3]}</td><td>${BADGE[r[4]]}</td><td><span class="pf-avatar ${r[5]}">${r[6]}</span></td><td><button class="pf-btn pf-btn-sm pf-btn-ghost">View →</button></td></tr>`).join("")}</tbody>
      </table>
      <div class="pf-table-footer"><span>Showing 5 of 312 projects</span><div class="pages"><button class="pf-page" aria-current="page">1</button><button class="pf-page">2</button><button class="pf-page">3</button></div></div>
    </div></div>`,
};

export const Default = {};
export const Striped = { args: { striped: true } };
export const Compact = { args: { compact: true, striped: true } };
export const NotSelectable = { args: { selectable: false } };
