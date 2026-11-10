import { html } from "./_helpers.js";

export default {
  title: "AI/Assist Summary",
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "Figma node 85:310. `section.pf-assist-summary`: header with an AI label, bullet list, footer stating the sources and the check-before-sharing line." } } },
  argTypes: { state: { control: "inline-radio", options: ["ready", "loading"] } },
  args: { state: "ready" },
  render: ({ state }) => state === "loading"
    ? html`<section class="pf-assist-summary" style="width:420px"><header>Deal summary <span class="pf-ai-label">Generated</span></header><div class="pf-msg"><div class="thinking"><i></i><i></i><i></i> Summarizing 14 events</div></div></section>`
    : html`<section class="pf-assist-summary" style="width:420px"><header>Deal summary <span class="pf-ai-label">Generated</span></header>
      <ul><li>Lumen 10G, 36-month term at $4,200/mo; pricing exception approved today.</li><li>Waiting on the partner signature; quote expires Oct 8.</li><li>Two of three site surveys still open.</li></ul>
      <footer><span>From 14 events, 2 quotes · Check before sharing</span></footer></section>`,
};

export const Ready = {};
export const Loading = { args: { state: "loading" } };
