import { html } from "./_helpers.js";

export default {
  title: "Charts/Chart Legend",
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "Figma node 99:102. `.pf-chart-legend` of `.pf-chart-key` spans; the swatch is a `::before` colored by `series-2`, `series-3`, `good`, `bad` or `muted`." } } },
};

export const Default = {
  render: () => html`<div class="pf-chart-legend"><span class="pf-chart-key">Closed MRR</span><span class="pf-chart-key series-2">Pipeline</span><span class="pf-chart-key series-3">Target</span><span class="pf-chart-key good">On target</span><span class="pf-chart-key bad">Below threshold</span><span class="pf-chart-key muted">Previous year</span></div>`,
};
