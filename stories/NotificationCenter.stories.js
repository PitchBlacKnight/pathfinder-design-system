import { html } from "./_helpers.js";

export default {
  title: "Feedback/Notification Center",
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "Figma node 102:206. `.pf-notifs` with a `header` and a `ul` of items; `.unread` marks the new ones." } } },
};

export const Default = {
  render: () => html`<div class="pf-notifs" style="width:380px"><header>Notifications <a class="pf-link" href="#">Mark all as read</a></header>
    <ul>
      <li class="unread"><div>Jordan Lee approved the pricing exception<time>12m ago</time></div></li>
      <li class="unread"><div>Sam Patel mentioned you in Quote 4471<time>1h ago</time></div></li>
      <li><div>Partner data refreshed overnight<time>Yesterday</time></div></li>
      <li><div>Harbor Logistics signed the UCaaS order<time>Oct 3</time></div></li>
    </ul></div>`,
};
export const AllRead = {
  render: () => html`<div class="pf-notifs" style="width:380px"><header>Notifications</header><ul><li><div>Partner data refreshed overnight<time>Yesterday</time></div></li></ul></div>`,
};
