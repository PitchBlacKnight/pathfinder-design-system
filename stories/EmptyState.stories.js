import { html } from "./_helpers.js";

export default {
  title: "Feedback/Empty State",
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "Figma node 27:122. A recipe rather than a class: icon, `h4`, label-colored paragraph and a centered action row, shown inside the surface it belongs to." } } },
  argTypes: { title: { control: "text" }, description: { control: "text" } },
  args: { title: "No cancelled orders", description: "No orders match the current filter. Try widening the date range or clearing the status filter to see all 312 orders." },
  render: ({ title, description }) => html`
    <div class="pf-table-wrap" style="width:720px">
      <div class="pf-table-toolbar"><span class="title">Partner Orders</span><select class="pf-select" style="width:160px" aria-label="Status"><option>Cancelled</option></select><button class="pf-btn pf-btn-ghost">Clear filters</button></div>
      <div style="padding:64px 24px;text-align:center;">
        <div style="font-size:40px;line-height:1;color:var(--pfContent_NonInteractiveIconColor);margin-bottom:18px;">○</div>
        <h4 style="margin-bottom:10px;">${title}</h4>
        <p style="color:var(--pfContent_LabelColor);max-width:380px;margin:0 auto 22px;">${description}</p>
        <div class="pf-row" style="justify-content:center;"><button class="pf-btn pf-btn-ghost">Clear filters</button><button class="pf-btn pf-btn-primary" data-toast="Showing all orders|Filter cleared, 312 orders.|info">Show all orders</button></div>
      </div>
      <div class="pf-table-footer"><span>Showing 0 of 312 orders</span></div>
    </div>`,
};

export const InTable = {};
export const FirstRun = { args: { title: "No partners yet", description: "Create your first partner to start tracking orders and pipeline." } };
