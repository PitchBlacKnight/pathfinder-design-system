import { html } from "./_helpers.js";

export default {
  title: "AI/Assistant Panel",
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "Figma node 98:4992. `aside.pf-assist-panel`: header, `.context` line naming the record, a `.thread` of messages, and a footer holding the Prompt Input. Composes every other AI component." } } },
};

export const Default = {
  render: () => html`<aside class="pf-assist-panel" style="height:640px;width:400px" aria-label="Assist">
    <header><h2>Assist</h2><button class="pf-btn pf-btn-ghost pf-btn-icon pf-btn-sm" aria-label="Close Assist">×</button></header>
    <div class="context">Working on: Lumen 10G fiber, Chicago</div>
    <div class="thread">
      <div class="pf-msg user"><p>What is blocking the Lumen deal?</p></div>
      <div class="pf-msg"><div class="who"><span class="bot">✦</span>Assist <span class="pf-ai-label">Generated</span></div>
        <p class="answer">Lumen is waiting on the signed quote, which expires Oct 8. Two of three site surveys are still open.</p>
        <div class="sources"><a class="pf-cite" href="#"><span class="n">1</span>Quote 4471</a><a class="pf-cite" href="#"><span class="n">2</span>Site survey</a></div>
        <div class="pf-ai-feedback"><button class="pf-btn pf-btn-ghost pf-btn-icon pf-btn-sm" aria-label="Helpful">👍</button><button class="pf-btn pf-btn-ghost pf-btn-icon pf-btn-sm" aria-label="Not helpful">👎</button><span class="msg">Was this helpful?</span></div></div>
      <div class="pf-msg user"><p>Draft the follow-up.</p></div>
      <div class="pf-msg"><div class="who"><span class="bot">✦</span>Assist <span class="pf-ai-label">Generated</span></div><div class="thinking"><i></i><i></i><i></i> Reading the Oct 6 thread</div></div>
    </div>
    <footer><div class="pf-prompt"><div class="field"><textarea placeholder="Ask Assist about this deal" aria-label="Ask Assist"></textarea>
      <div class="toolbar"><button class="pf-btn pf-btn-ghost pf-btn-icon pf-btn-sm" aria-label="Mention">@</button><button class="pf-btn pf-btn-primary pf-btn-icon pf-btn-sm" aria-label="Send">➤</button></div></div>
      <span class="disclaimer">Assist can be wrong. Check before you share.</span></div></footer>
  </aside>`,
};
