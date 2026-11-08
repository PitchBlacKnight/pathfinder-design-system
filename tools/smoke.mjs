#!/usr/bin/env node
/* Pathfinder smoke test: loads every recipe fragment with the tokens, CSS, pathfinder.js and
   pathfinder.behavior.js in headless Chrome, presses a few keys, and fails on any script error.
   No npm dependencies; needs Chrome (or $CHROME). Exit 2 when it cannot run. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, readdirSync } from "node:fs";
import { spawn, execFileSync } from "node:child_process";
import { dirname, join, extname } from "node:path";
import { fileURLToPath } from "node:url";
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const chrome = [process.env.CHROME, "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"].filter(Boolean).find((p) => existsSync(p)) || (() => { try { return execFileSync("which", ["google-chrome"], { encoding: "utf8" }).trim(); } catch { return null; } })();
if (!chrome) { console.error("smoke test skipped: no Chrome found."); process.exit(2); }
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".woff2": "font/woff2", ".json": "application/json" };
const server = createServer((req, res) => {
  const p = join(ROOT, decodeURIComponent(req.url.split("?")[0]));
  if (!p.startsWith(ROOT) || !existsSync(p) || !statSync(p).isFile()) { res.statusCode = 404; return res.end(); }
  res.setHeader("content-type", TYPES[extname(p)] || "application/octet-stream"); res.end(readFileSync(p));
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const port = server.address().port;
const run = (name) => new Promise((resolve) => {
  const p = spawn(chrome, ["--headless=new", "--disable-gpu", "--no-sandbox", "--window-size=1280,900", "--virtual-time-budget=15000", "--dump-dom", `http://127.0.0.1:${port}/tools/smoke.html?recipe=${name}`], { stdio: ["ignore", "pipe", "ignore"] });
  let out = ""; p.stdout.on("data", (d) => (out += d));
  p.on("close", () => { const m = out.match(/<script type="application\/json" id="pf-smoke">([\s\S]*?)<\/script>/); resolve(m ? JSON.parse(m[1]) : { recipe: name, errors: ["page did not finish"] }); });
});
const recipes = readdirSync(join(ROOT, "recipes")).filter((f) => f.endsWith(".html")).map((f) => f.replace(/\.html$/, ""));
const results = await Promise.all(recipes.map(run));
server.close();
const bad = results.filter((r) => r.errors.length);
console.log(`Pathfinder smoke: ${recipes.length} recipes loaded with both scripts`);
bad.forEach((r) => r.errors.forEach((e) => console.log(`  ${r.recipe}: ${e}`)));
console.log(bad.length ? `${bad.length} recipe(s) threw errors.` : "No script errors.");
process.exit(bad.length ? 1 : 0);
