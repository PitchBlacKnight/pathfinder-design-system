/** Identity tag so editors highlight the markup. Stories return HTML strings. */
export const html = (strings, ...vals) =>
  strings.reduce((out, s, i) => out + s + (vals[i] ?? ""), "");

export const cls = (...parts) => parts.filter(Boolean).join(" ");

/** Wrap a story in a bordered frame so fixed overlays (drawer, modal) stay inside. */
export const frame = (inner, height = 480) =>
  `<div class="sb-frame" style="height:${height}px">${inner}</div>`;

export const SEMANTIC = ["positive", "negative", "critical", "info", "neutral"];
