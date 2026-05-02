import { existsSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

let passed = 0; let failed = 0;
function ok(cond: unknown, label: string): void {
  if (cond) { passed++; console.log("  ✓ " + label); }
  else      { failed++; console.log("  ✗ " + label); }
}

const root = process.cwd();
const dist = join(root, "dist");

console.log("\n[gitma smoke test]\n");

// dist exists and has the right files
ok(existsSync(join(dist, "index.html")),  "dist/index.html exists");
ok(existsSync(join(dist, "app.js")),      "dist/app.js exists");
ok(existsSync(join(dist, "styles.css")),  "dist/styles.css exists");
ok(existsSync(join(dist, "favicon.svg")), "dist/favicon.svg exists");
ok(existsSync(join(dist, "_redirects")),  "dist/_redirects exists");
ok(existsSync(join(dist, "_headers")),    "dist/_headers exists");
ok(existsSync(join(dist, "404.html")),    "dist/404.html exists");

// content json
ok(existsSync(join(dist, "content/modules.en.json")), "dist/content/modules.en.json exists");
ok(existsSync(join(dist, "content/modules.zh.json")), "dist/content/modules.zh.json exists");
ok(existsSync(join(dist, "content/glossary.json")),   "dist/content/glossary.json exists");
ok(existsSync(join(dist, "content/games.json")),      "dist/content/games.json exists");

// json validates and has 10 modules each
for (const lang of ["en", "zh"]) {
  try {
    const data = JSON.parse(readFileSync(join(dist, `content/modules.${lang}.json`), "utf8"));
    ok(Array.isArray(data.modules) && data.modules.length === 10, `${lang} has 10 modules`);
    const ids = data.modules.map((m: any) => m.id);
    ok(JSON.stringify(ids) === JSON.stringify(["m1","m2","m3","m4","m5","m6","m7","m8","m9","m10"]), `${lang} module ids m1..m10`);
  } catch (e) {
    ok(false, `${lang} modules JSON parses: ${(e as Error).message}`);
  }
}

// glossary 30 cards
const gloss = JSON.parse(readFileSync(join(dist, "content/glossary.json"), "utf8"));
ok(Array.isArray(gloss.cards) && gloss.cards.length >= 30, "glossary has 30+ cards");

// games json content
const games = JSON.parse(readFileSync(join(dist, "content/games.json"), "utf8"));
ok(Array.isArray(games.lightningQuiz)  && games.lightningQuiz.length  === 6,  "lightningQuiz has 6 questions");
ok(Array.isArray(games.repoDetective) && games.repoDetective.length >= 5,    "repoDetective has 5+ cards");
ok(Array.isArray(games.commitTranslator) && games.commitTranslator.length >= 4, "commitTranslator has 4+ tasks");
ok(Array.isArray(games.localVsRemote) && games.localVsRemote.length >= 8,    "localVsRemote has 8+ actions");
ok(games.spotReadme && games.spotReadme.labels.length === games.spotReadme.blocks.length, "spotReadme labels and blocks match");

// bundle size sanity
const appSize = statSync(join(dist, "app.js")).size;
ok(appSize < 200_000, `app.js < 200KB (got ${(appSize/1024).toFixed(1)}KB)`);
const cssSize = statSync(join(dist, "styles.css")).size;
ok(cssSize < 100_000, `styles.css < 100KB (got ${(cssSize/1024).toFixed(1)}KB)`);

console.log(`\n${passed} passed, ${failed} failed\n`);
process.exit(failed ? 1 : 0);
