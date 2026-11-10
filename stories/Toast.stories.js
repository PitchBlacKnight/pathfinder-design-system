import { html } from "./_helpers.js";

const TONES = ["info", "positive", "negative"];
const ICON = { info: "ℹ", positive: "✓", negative: "✕" };

export default {
  title: "Feedback/Toast",
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "Figma nodes 10:710 (Notification) and 83:55. `.pf-toast` inside the fixed `.pf-toast-region`. Fire one from any element with `data-toast=\"Title|Detail|tone\"`; pathfinder.js builds the region and removes the toast after 4.2s." } } },
  argTypes: { tone: { control: "inline-radio", options: TONES }, title: { control: "text" }, detail: { control: "text" } },
  args: { tone: "positive", title: "Partner saved", detail: "Acme Corp was updated." },
  render: ({ tone, title, detail }) => html`<div class="sb-inline"><div class="pf-toast-region"><div class="pf-toast ${tone}" role="status"><span class="icon">${ICON[tone]}</span><div><div class="t">${title}</div><div class="d">${detail}</div></div></div></div></div>`,
};

export const Positive = {};
export const Info = { args: { tone: "info", title: "Showing all orders", detail: "Filter cleared, 312 orders." } };
export const Negative = { args: { tone: "negative", title: "Partner deleted", detail: "Acme Corp was removed." } };
export const Live = {
  name: "Live (click to fire)",
  render: () => html`<div class="sb-row">
    <button class="pf-btn" data-toast="Showing all orders|Filter cleared, 312 orders.|info">Info toast</button>
    <button class="pf-btn pf-btn-success" data-toast="Partner saved|Acme Corp was updated.|positive">Positive toast</button>
    <button class="pf-btn pf-btn-danger" data-toast="Partner deleted|Acme Corp was removed.|negative">Negative toast</button>
  </div>`,
};
