import { html } from "./_helpers.js";

const PRESET = {
  404: { tone: "", title: "Page not found", desc: "The page you're looking for doesn't exist or was moved.", actions: ["Back to home"] },
  500: { tone: "negative", title: "Something went wrong", desc: "We're having trouble on our end. This has been reported to our team.", actions: ["Try again", "Status page"] },
  403: { tone: "critical", title: "Access denied", desc: "You don't have permission to view this page. Contact your administrator.", actions: ["Request access"] },
};

export default {
  title: "Feedback/Error Page",
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "Figma node 27:384. `.pf-error-page`: `.code` in the header face, an `h2`, a `p` and `.actions`. The code color follows the variant: 404 informative (default), 500 `.negative`, 403 `.critical`." } } },
  argTypes: { code: { control: "inline-radio", options: ["404", "500", "403"] } },
  args: { code: "404" },
  render: ({ code }) => {
    const p = PRESET[code];
    return html`<div class="pf-error-page${p.tone ? " " + p.tone : ""}"><span class="code">${code}</span><h2>${p.title}</h2><p>${p.desc}</p><div class="actions">${p.actions.map((a, i) => html`<button class="pf-btn ${i ? "pf-btn-secondary" : "pf-btn-primary"} pf-btn-sm">${a}</button>`).join("")}</div></div>`;
  },
};

export const NotFound = { args: { code: "404" } };
export const ServerError = { args: { code: "500" } };
export const Forbidden = { args: { code: "403" } };
