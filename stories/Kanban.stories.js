import { html } from "./_helpers.js";

export default {
  title: "Data/Kanban",
  tags: ["autodocs"],
  parameters: { layout: "fullscreen", docs: { description: { component: "Figma node 102:96. `.pf-kanban` of `.pf-kanban-col` (header with `.meta` count and `.meta.total`) holding `.pf-kanban-card` articles; `.dragging` is the lifted state." } } },
};

const card = (title, account, dot, foot, extra = "") => html`<div class="pf-kanban-card${extra}"><span class="title">${title}</span><span class="account">${account}</span>${dot}<footer>${foot}</footer></div>`;

export const Board = {
  render: () => html`<div style="padding:24px;overflow:auto"><div class="pf-kanban">
    <div class="pf-kanban-col"><header>Proposal <span class="meta">3</span><span class="meta total">$243K</span></header>
      ${card("Lumen 10G fiber", "Lumen Technologies · Chicago, IL", '<span class="pf-dot critical">Expires Oct 8</span>', "Sam Patel · 3 comments")}
      ${card("Harbor UCaaS", "Harbor Logistics · 320 seats", "", "Avery Chen", " dragging")}
      ${card("Thornwood SD-WAN", "Thornwood Dental · 4 sites", '<span class="pf-dot info">Survey booked</span>', "Jordan Lee")}</div>
    <div class="pf-kanban-col"><header>Negotiation <span class="meta">2</span><span class="meta total">$118K</span></header>
      ${card("Northbeam fiber", "Northbeam Retail · 12 sites", '<span class="pf-dot positive">On track</span>', "Sam Patel")}
      ${card("Vistro security", "Vistro · 1 site", "", "Avery Chen · 1 comment")}</div>
    <div class="pf-kanban-col"><header>Closed won <span class="meta">1</span><span class="meta total">$47K</span></header>
      ${card("8×8 contact center", "8×8 · 90 seats", '<span class="pf-dot positive">Signed</span>', "Jordan Lee")}</div>
  </div></div>`,
};
