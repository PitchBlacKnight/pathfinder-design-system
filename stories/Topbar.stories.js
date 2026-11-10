import { html } from "./_helpers.js";

export default {
  title: "Navigation/Topbar",
  tags: ["autodocs"],
  parameters: { layout: "fullscreen", docs: { description: { component: "Figma node 16:69 (Nav / Header bar). `header.pf-topbar`: title, optional badge, `.spacer`, then search, actions and the user avatar." } } },
};

export const Default = {
  render: () => html`<header class="pf-topbar"><h4 style="font-size:18px">Dashboard</h4><span class="pf-badge pf-badge-info">v2.1</span><span class="spacer"></span><input class="pf-input" style="width:220px" placeholder="Search partners…" aria-label="Search partners"><button class="pf-btn pf-btn-primary">+ New Partner</button><span class="pf-avatar color-4">MR</span></header>`,
};
