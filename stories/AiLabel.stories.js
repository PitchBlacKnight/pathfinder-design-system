import { html } from "./_helpers.js";

export default {
  title: "AI/AI Label",
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "Figma node 97:27. `.pf-ai-label` marks machine-made content. Default is Generated; `.suggested` is dashed, `.edited` is neutral with a pen glyph." } } },
  argTypes: { type: { control: "inline-radio", options: ["generated", "suggested", "edited"] } },
  args: { type: "generated" },
  render: ({ type }) => html`<span class="pf-ai-label${type === "generated" ? "" : " " + type}">${{ generated: "Generated", suggested: "Suggested", edited: "Edited by you" }[type]}</span>`,
};

export const Generated = {};
export const Suggested = { args: { type: "suggested" } };
export const Edited = { args: { type: "edited" } };
export const All = { render: () => html`<div class="sb-row" style="gap:8px"><span class="pf-ai-label">Generated</span><span class="pf-ai-label suggested">Suggested</span><span class="pf-ai-label edited">Edited by you</span></div>` };
