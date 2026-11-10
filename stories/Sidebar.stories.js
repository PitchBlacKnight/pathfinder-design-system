import { html, frame } from "./_helpers.js";

export default {
  title: "Navigation/Sidebar",
  tags: ["autodocs"],
  parameters: { layout: "fullscreen", docs: { description: { component: "Figma nodes 16:29 and 16:34. `nav.pf-sidenav` with a `.brand`, `.pf-nav-item` links (`aria-current=page` for the active one) and `.pf-nav-group` kickers. Collapses under 1024px inside `.pf-shell`." } } },
};

const nav = html`
  <nav class="pf-sidenav" style="height:100%">
    <div class="brand">PATHFINDER<span class="sub">AVANT PARTNER PORTAL</span></div>
    <a class="pf-nav-item" aria-current="page">⊞ Dashboard</a>
    <a class="pf-nav-item">◎ Partners</a>
    <a class="pf-nav-item">▣ Orders</a>
    <a class="pf-nav-item">◈ Analytics</a>
    <div class="pf-nav-group pf-overline">System</div>
    <a class="pf-nav-item">◑ Notifications</a>
    <a class="pf-nav-item">⚙ Settings</a>
  </nav>`;

export const Default = { render: () => frame(nav, 520) };
