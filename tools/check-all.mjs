#!/usr/bin/env node
/* Runs every Pathfinder check in parallel and prints one summary: token lint, copy lint, the purity audit
   (audit.sh), the WCAG contrast audit (contrast.sh) and the recipe smoke test. The pre-commit hook runs the same set.
     node tools/check-all.mjs [token copy purity contrast] */
import { spawn } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const CHECKS = { token: ["Token lint", "node", ["tools/token-lint.mjs"]], copy: ["Copy lint", "node", ["tools/copy-lint.mjs"]], purity: ["Purity audit (stage)", "sh", ["audit.sh"]], contrast: ["Contrast (450 pairs, all modes)", "sh", ["contrast.sh"]], smoke: ["Smoke (recipes + scripts, no errors)", "node", ["tools/smoke.mjs"]] };
const pick = process.argv.slice(2).filter((a) => CHECKS[a]);
const names = pick.length ? pick : Object.keys(CHECKS);
const run = (k) => new Promise((res) => { const [label, cmd, args] = CHECKS[k]; const p = spawn(cmd, args, { cwd: ROOT }); let out = ""; p.stdout.on("data", (d) => (out += d)); p.stderr.on("data", (d) => (out += d)); p.on("close", (code) => res({ label, code, out })); });
const results = await Promise.all(names.map(run));
let failed = 0;
for (const r of results) { console.log(`${r.code === 0 ? "pass" : "FAIL"}  ${r.label}`); if (r.code) { failed++; console.log(r.out.trim().split("\n").slice(-12).map((l) => "      " + l).join("\n")); } }
console.log(failed ? `\n${failed} check(s) failed.` : "\nAll checks passed.");
process.exit(failed ? 1 : 0);
