#!/usr/bin/env node
/* Pathfinder token lint: raw values in css/pathfinder.css that should be --pf* tokens. No dependencies.

     node tools/token-lint.mjs            report; fail if any count rises above the baseline
     node tools/token-lint.mjs --list     print every hit
     node tools/token-lint.mjs --baseline write the current counts to tools/token-lint-baseline.json

   Counts: hex or rgb color literals, padding/margin/gap in px that are not 0 or 1px hairlines, font-size in px.
   The baseline lets old debt pass while new raw values fail. Lower it after each cleanup. */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const BASE = join(ROOT, "tools/token-lint-baseline.json");
const css = readFileSync(join(ROOT, "css/pathfinder.css"), "utf8").replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "));
const hits = { color: [], space: [], "font-size": [] };
css.split("\n").forEach((line, i) => {
  if (/#[0-9a-fA-F]{3,8}\b|\brgba?\(/.test(line)) hits.color.push([i + 1, line.trim()]);
  const sp = line.match(/(?<![\w-])(?:padding|margin|gap|row-gap|column-gap)[\w-]*\s*:\s*([^;}]+)/);
  if (sp && /(^|[\s(,-])([2-9]|\d{2,})px\b/.test(sp[1])) hits.space.push([i + 1, line.trim()]);
  if (/font-size\s*:\s*\d+px/.test(line)) hits["font-size"].push([i + 1, line.trim()]);
});
const counts = Object.fromEntries(Object.entries(hits).map(([k, v]) => [k, v.length]));
if (process.argv.includes("--baseline")) { writeFileSync(BASE, JSON.stringify(counts, null, 1) + "\n"); console.log("baseline written", counts); process.exit(0); }
if (process.argv.includes("--list")) for (const [k, v] of Object.entries(hits)) v.forEach(([n, l]) => console.log(`${k} ${n}: ${l.slice(0, 120)}`));
const base = existsSync(BASE) ? JSON.parse(readFileSync(BASE, "utf8")) : counts;
const over = Object.keys(counts).filter((k) => counts[k] > (base[k] ?? 0));
console.log(`Pathfinder token lint: color ${counts.color}, space ${counts.space}, font-size ${counts["font-size"]} (baseline ${base.color}/${base.space}/${base["font-size"]})`);
if (over.length) { console.log(`New raw values in: ${over.join(", ")}. Use --pf* tokens (node tools/token-lint.mjs --list).`); process.exit(1); }
