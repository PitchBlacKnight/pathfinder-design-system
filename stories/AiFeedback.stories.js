import { html } from "./_helpers.js";

export default {
  title: "AI/AI Feedback",
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "Figma node 97:183. `.pf-ai-feedback`: thumbs up and down as ghost icon buttons, then a `.msg` prompt." } } },
};

export const Default = { render: () => html`<div class="pf-ai-feedback"><button class="pf-btn pf-btn-ghost pf-btn-icon pf-btn-sm" aria-label="Helpful">👍</button><button class="pf-btn pf-btn-ghost pf-btn-icon pf-btn-sm" aria-label="Not helpful">👎</button><span class="msg">Was this helpful?</span></div>` };
export const Rated = { render: () => html`<div class="pf-ai-feedback"><button class="pf-btn pf-btn-primary pf-btn-icon pf-btn-sm" aria-label="Helpful" aria-pressed="true">👍</button><button class="pf-btn pf-btn-ghost pf-btn-icon pf-btn-sm" aria-label="Not helpful">👎</button><span class="msg">Thanks for the feedback.</span></div>` };
