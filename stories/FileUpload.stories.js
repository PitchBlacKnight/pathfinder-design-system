import { html } from "./_helpers.js";

export default {
  title: "Inputs/File Upload",
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "Figma nodes 15:618 and 15:660. `.pf-dropzone` with a `strong` title and a `span` hint. Upload progress uses Progress." } } },
  argTypes: { title: { control: "text" }, hint: { control: "text" } },
  args: { title: "Drag and drop files", hint: "PDF, CSV or XLSX up to 25 MB" },
  render: ({ title, hint }) => html`<div class="pf-dropzone" style="width:420px"><strong>${title}</strong><span>${hint}</span></div>`,
};

export const Dropzone = {};
export const Uploading = {
  render: () => html`<div class="sb-stack" style="width:420px">
    <div class="pf-dropzone"><strong>Drag and drop files</strong><span>PDF, CSV or XLSX up to 25 MB</span></div>
    <div class="pf-card pf-stack" style="gap:8px"><div class="pf-row" style="justify-content:space-between"><span class="pf-mono" style="font-size:12px">lumen-quote-4471.pdf</span><span class="sb-label">64%</span></div><div class="pf-progress"><div class="bar" style="width:64%"></div></div></div>
    <div class="pf-card pf-stack" style="gap:8px"><div class="pf-row" style="justify-content:space-between"><span class="pf-mono" style="font-size:12px">site-survey.csv</span><span class="pf-dot positive">Complete</span></div><div class="pf-progress positive"><div class="bar" style="width:100%"></div></div></div>
    <div class="pf-card pf-stack" style="gap:8px"><div class="pf-row" style="justify-content:space-between"><span class="pf-mono" style="font-size:12px">contract.docx</span><span class="pf-dot negative">Unsupported type</span></div><div class="pf-progress negative"><div class="bar" style="width:100%"></div></div></div>
  </div>`,
};
