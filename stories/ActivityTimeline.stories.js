import { html } from "./_helpers.js";

export default {
  title: "Data/Activity Timeline",
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "Figma node 85:70. `ol.pf-timeline`; each `li` has a `.marker`, a `.title`, a `time` and an optional `.detail`. Event type classes: `.approval`, `.created`." } } },
};

export const Default = {
  render: () => html`<ol class="pf-timeline" style="width:420px">
    <li class="approval"><span class="marker">✓</span><div><div class="title">Jordan Lee approved the pricing exception</div><time>Today · 10:42 AM</time></div></li>
    <li><span class="marker">✉</span><div><div class="title">Sam Patel commented</div><time>Today · 9:15 AM</time><div class="detail">Partner asked for a 36-month term.</div></div></li>
    <li><span class="marker">✎</span><div><div class="title">Avery Chen edited the quote</div><time>Oct 5 · 4:02 PM</time></div></li>
    <li class="created"><span class="marker">+</span><div><div class="title">Avery Chen created Quote 4471</div><time>Oct 4 · 11:20 AM</time></div></li>
  </ol>`,
};
