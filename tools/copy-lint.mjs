#!/usr/bin/env node
/* Pathfinder copy lint: em dashes, retired SAP/Fiori/Horizon names and banned claims in shipped files.
     node tools/copy-lint.mjs [files...]   default: css, js, recipes, handoff, playground, stage, index.html
   tokens/_site-raw.css is the one permitted trace of the old names and is skipped. */
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const walk = (d) => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : [p]; });
const args = process.argv.slice(2);
const files = args.length ? args.map((f) => join(process.cwd(), f)) : ["css", "js", "recipes", "handoff", "playground", "stage"].filter((d) => existsSync(join(ROOT, d))).flatMap((d) => walk(join(ROOT, d))).concat(join(ROOT, "index.html"));
const RULES = [["em dash", /—/], ["retired name", /\b(SAP|Fiori|sap[A-Z_]\w*)\b|\bHorizon\b/], ["banned claim", /11 to 4 days|71% adoption|2\.5 years/i]];
let n = 0;
for (const f of files.filter((f) => /\.(html|css|js|json|md)$/.test(f) && !/_site-raw\.css$/.test(f))) {
  readFileSync(f, "utf8").split("\n").forEach((line, i) => RULES.forEach(([k, re]) => { if (re.test(line)) { n++; console.log(`${relative(ROOT, f)}:${i + 1} ${k}: ${line.trim().slice(0, 100)}`); } }));
}
console.log(n ? `Copy lint: ${n} issue(s).` : `Copy lint: ${files.length} file(s) clean.`);
process.exit(n ? 1 : 0);
