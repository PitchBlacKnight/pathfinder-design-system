import { html } from "./_helpers.js";

export default {
  title: "Data/Comment",
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "Figma node 85:151. `.pf-comment` (avatar, `.author`, `time`, body with `.mention`, `.actions`) and `.pf-composer` (textarea plus `.toolbar`)." } } },
};

export const Thread = {
  render: () => html`<div class="sb-stack" style="width:460px">
    <div class="pf-comment"><span class="pf-avatar color-3">SP</span><div><span class="author">Sam Patel</span><time>2h ago</time><p><span class="mention">@Jordan</span> can we hold the 36-month price through Friday?</p><div class="actions"><span>Reply</span><span>Resolve</span></div></div></div>
    <div class="pf-comment"><span class="pf-avatar color-5">JL</span><div><span class="author">Jordan Lee</span><time>1h ago</time><p>Yes. Approved the exception, it is on the timeline.</p><div class="actions"><span>Reply</span><span>Resolve</span></div></div></div>
    <div class="pf-row" style="gap:12px;align-items:flex-start;"><span class="pf-avatar color-1">MR</span><div class="pf-composer" style="flex:1"><textarea placeholder="Add a comment, @ to mention" aria-label="Add a comment"></textarea><div class="toolbar"><button class="pf-btn pf-btn-ghost pf-btn-icon pf-btn-sm" aria-label="Mention">@</button><button class="pf-btn pf-btn-primary pf-btn-icon pf-btn-sm" aria-label="Send">➤</button></div></div></div>
  </div>`,
};
export const ComposerOnly = {
  render: () => html`<div class="pf-composer" style="width:460px"><textarea placeholder="Add a comment, @ to mention" aria-label="Add a comment"></textarea><div class="toolbar"><button class="pf-btn pf-btn-ghost pf-btn-icon pf-btn-sm" aria-label="Mention">@</button><button class="pf-btn pf-btn-primary pf-btn-icon pf-btn-sm" aria-label="Send">➤</button></div></div>`,
};
