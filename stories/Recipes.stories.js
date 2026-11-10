/* Each recipe is the real file in ../recipes, imported as raw text, so the
   stories can never drift from what the live stage renders. */
import desktop from "../recipes/desktop.html?raw";
import orders from "../recipes/orders-page.html?raw";
import detail from "../recipes/detail.html?raw";
import form from "../recipes/form.html?raw";
import table from "../recipes/data-table.html?raw";
import modal from "../recipes/modal.html?raw";
import chart from "../recipes/metric-chart.html?raw";
import empty from "../recipes/empty-state.html?raw";
import welcome from "../recipes/welcome.html?raw";
import library from "../recipes/library-1-7.html?raw";
import states from "../recipes/states.html?raw";

export default {
  title: "Recipes/Pages",
  parameters: { layout: "fullscreen", docs: { description: { component: "The eleven recipe fragments from `recipes/`, rendered as is. These are the pages the Live Stage assembles; every behavior (sort, filter, select, modal, toast) is live here too." } } },
};

const pad = (s) => `<div style="padding:24px">${s}</div>`;

export const Desktop = { name: "Assemble a desktop", render: () => desktop };
export const OrdersPage = { render: () => orders };
export const DetailPage = { render: () => detail };
export const Form = { render: () => form };
export const DataTable = { render: () => pad(table) };
export const Modal = { render: () => pad(modal) };
export const MetricChart = { render: () => chart };
export const EmptyState = { render: () => empty };
export const Welcome = { render: () => pad(welcome) };
export const Library17 = { name: "Figma library 1.3 to 1.7 sheet", render: () => library };
export const States = { name: "Loading and error states", render: () => states, play: () => document.querySelectorAll(".pf-calendar[data-month]").forEach((c) => { if (!c.children.length) window.Pathfinder.renderCalendar(c); }) };
