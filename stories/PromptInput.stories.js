import { html } from "./_helpers.js";

export default {
  title: "AI/Prompt Input",
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "Figma node 97:338. `.pf-prompt > .field` wraps a textarea and a `.toolbar`; the `.disclaimer` sits below. Busy state swaps Send for Stop." } } },
  argTypes: { busy: { control: "boolean" }, value: { control: "text" } },
  args: { busy: false, value: "" },
  render: ({ busy, value }) => html`<div class="pf-prompt" style="width:420px"><div class="field"><textarea placeholder="Ask Assist about this deal" aria-label="Ask Assist">${value}</textarea>
    <div class="toolbar"><button class="pf-btn pf-btn-ghost pf-btn-icon pf-btn-sm" aria-label="Mention">@</button>${busy ? '<button class="pf-btn pf-btn-secondary pf-btn-icon pf-btn-sm" aria-label="Stop">■</button>' : '<button class="pf-btn pf-btn-primary pf-btn-icon pf-btn-sm" aria-label="Send">➤</button>'}</div></div>
    <span class="disclaimer">Assist can be wrong. Check before you share.</span></div>`,
};

export const Default = {};
export const Busy = { args: { busy: true, value: "What is blocking the Lumen deal?" } };
