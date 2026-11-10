import { html } from "./_helpers.js";

export default {
  title: "Foundations/Typography",
  parameters: { docs: { description: { component: "Header family (Barlow Condensed), body family (Schibsted Grotesk) and mono (JetBrains Mono), every size driven by a `--pfFont*` token." } } },
};

export const Scale = {
  render: () => html`
    <div class="sb-stack" style="gap:24px">
      <div class="sb-type">
        <span class="sb-label">h1 · pfFontHeader1Size</span><h1>Partner portal</h1>
        <span class="sb-label">h2 · pfFontHeader2Size</span><h2>Pipeline review</h2>
        <span class="sb-label">h3 · pfFontHeader3Size</span><h3>Open orders this quarter</h3>
        <span class="sb-label">h4 · pfFontHeader4Size</span><h4>Account details</h4>
        <span class="sb-label">h5 · pfFontHeader5Size</span><h5>Section heading</h5>
        <span class="sb-label">body · pfFontMediumSize</span><p style="margin:0">Lumen is waiting on the signed quote, which expires Oct 8. Two of three site surveys are still open.</p>
        <span class="sb-label">small · pfFontSmallSize</span><p style="margin:0;font-size:var(--pfFontSmallSize);color:var(--pfContent_LabelColor)">Updated 2 hours ago by Sam Patel</p>
        <span class="sb-label">overline · .pf-overline</span><span class="pf-overline">Partners · Onboarding</span>
        <span class="sb-label">mono · .pf-mono</span><span class="pf-mono">PF-001 · $47,439 · 07/28/2021</span>
        <span class="sb-label">link · .pf-link</span><a class="pf-link" href="#">View contract</a>
      </div>
    </div>`,
};
