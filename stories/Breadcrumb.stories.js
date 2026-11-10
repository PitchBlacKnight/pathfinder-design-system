import { html } from "./_helpers.js";

export default {
  title: "Navigation/Breadcrumb",
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "Figma nodes 16:175 and 45:9. `nav.pf-breadcrumb > ol`, last item carries `aria-current=page`." } } },
  argTypes: { items: { control: "object" } },
  args: { items: ["Floorplans", "Partners", "Acme Corp"] },
  render: ({ items }) => html`<nav class="pf-breadcrumb" aria-label="Breadcrumb"><ol>${items.map((it, i) => (i === items.length - 1 ? html`<li aria-current="page">${it}</li>` : html`<li><a href="#">${it}</a></li>`)).join("")}</ol></nav>`,
};

export const Default = {};
export const Deep = { args: { items: ["Partners", "Lumen Technologies", "Chicago, IL", "CHI-10G-0042", "Quote 4471"] } };
