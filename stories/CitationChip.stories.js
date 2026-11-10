import { html } from "./_helpers.js";

export default {
  title: "AI/Citation Chip",
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "Figma node 97:67. `a.pf-cite` with a numbered `.n` and the source name. Every AI answer that makes a claim shows at least one." } } },
};

export const Default = { render: () => html`<div class="sb-row" style="gap:6px"><a class="pf-cite" href="#"><span class="n">1</span>Quote 4471</a><a class="pf-cite" href="#"><span class="n">2</span>Site survey</a><a class="pf-cite" href="#"><span class="n">3</span>Comment, Oct 6</a></div>` };
