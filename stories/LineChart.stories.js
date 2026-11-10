import { html } from "./_helpers.js";

export default {
  title: "Charts/Line Chart",
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "Figma node 100:142. `svg.pf-line-chart` with a `.grid` group and up to three `polyline.series.s1|s2|s3` (s3 is dashed). Give it `role=img` and an `aria-label` that states the trend." } } },
};

export const Default = {
  render: () => html`<div class="pf-card" style="width:460px"><span class="pf-overline" style="display:block;margin-bottom:12px">Pipeline vs closed · Jan to Jun</span>
    <svg class="pf-line-chart" viewBox="0 0 320 160" role="img" aria-label="Pipeline, Jan to Jun, rising from 30K to 61K">
      <g class="grid"><line x1="0" x2="320" y1="20" y2="20"/><line x1="0" x2="320" y1="70" y2="70"/><line x1="0" x2="320" y1="120" y2="120"/></g>
      <polyline class="series s1" points="10,110 70,98 130,102 190,80 250,66 310,48"/>
      <polyline class="series s2" points="10,130 70,124 130,118 190,104 250,96 310,84"/>
      <polyline class="series s3" points="10,70 70,66 130,60 190,56 250,50 310,46"/>
    </svg>
    <div class="pf-chart-legend" style="margin-top:12px"><span class="pf-chart-key">Pipeline</span><span class="pf-chart-key series-2">Closed</span><span class="pf-chart-key series-3">Target</span></div>
  </div>`,
};
