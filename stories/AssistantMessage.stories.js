import { html } from "./_helpers.js";

export default {
  title: "AI/Assistant Message",
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "Figma node 98:118. `.pf-msg` for the assistant turn, `.pf-msg.user` for the advisor. States: `.thinking` dots, `aria-busy=true` streaming caret, complete with `.sources`, and `.error`." } } },
  argTypes: { state: { control: "select", options: ["thinking", "streaming", "complete", "error"] } },
  args: { state: "complete" },
  render: ({ state }) => {
    const who = '<div class="who"><span class="bot">✦</span>Assist <span class="pf-ai-label">Generated</span></div>';
    if (state === "thinking") return html`<div class="pf-msg" style="width:420px">${who}<div class="thinking"><i></i><i></i><i></i> Reading 14 events and 2 quotes</div></div>`;
    if (state === "streaming") return html`<div class="pf-msg" aria-busy="true" style="width:420px">${who}<p class="answer">Lumen is waiting on the signed quote, which expires</p></div>`;
    if (state === "error") return html`<div class="pf-msg" style="width:420px"><div class="error">Assist could not finish this answer. <a class="pf-link" href="#">Try again</a></div></div>`;
    return html`<div class="pf-msg" style="width:420px">${who}<p class="answer">Lumen is waiting on the signed quote, which expires Oct 8. Two of three site surveys are still open.</p>
      <div class="sources"><a class="pf-cite" href="#"><span class="n">1</span>Quote 4471</a><a class="pf-cite" href="#"><span class="n">2</span>Site survey</a></div>
      <div class="pf-ai-feedback"><button class="pf-btn pf-btn-ghost pf-btn-icon pf-btn-sm" aria-label="Helpful">👍</button><button class="pf-btn pf-btn-ghost pf-btn-icon pf-btn-sm" aria-label="Not helpful">👎</button><span class="msg">Was this helpful?</span></div></div>`;
  },
};

export const Complete = {};
export const Thinking = { args: { state: "thinking" } };
export const Streaming = { args: { state: "streaming" } };
export const Error = { args: { state: "error" } };
export const UserTurn = { render: () => html`<div class="pf-msg user" style="width:420px"><p>What is blocking the Lumen deal?</p></div>` };
