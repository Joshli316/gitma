# GitMa 吉码

## What This Is
Bilingual (EN/ZH) sketchbook tutorial site that teaches GitHub for people who build with Claude Code — repos, commits, branches, PRs, GitHub × Claude Code workflow. 10 modules + 5 practice games + flashcards.

## Tech Stack
- Vanilla TypeScript + esbuild + Tailwind CSS v4
- Hash-based SPA router, localStorage state, JSON content files
- Cloudflare Pages deployment (gitma.pages.dev)

## Commands
- `npm run dev` — watch mode (esbuild + tailwind + asset copy + serve dist on :5173)
- `npm run build` — production build to dist/
- `npm run deploy` — build + deploy to Cloudflare Pages
- `npm test` — smoke test

## Build
`dist/` contains `app.js`, `styles.css`, `index.html`, `content/*.json`, `_headers`, `_redirects`, plus `public/*` (favicon, og-image, NotebookLM assets).

## Design — sketchbook / cream paper
- Cream paper background, marker headings (Patrick Hand + LXGW WenKai), Nunito body, JetBrains Mono terminal block.
- One asymmetric break + one sharp terminal anchor per page. Rotate the asymmetric device across modules.
- Light + dark themes via CSS custom properties (`:root` + `[data-theme="dark"]`).
- See `plan.md` Design Spec for tokens.

## Bilingual
- All strings keyed identically in `src/content/modules.en.json` / `modules.zh.json` and in `src/i18n.ts`.
- Brand terms (GitHub, Claude Code, README, gh, git, PR) stay in English in both files.
- PR translates as 合并请求.
- Header has `中 / EN` toggle. `document.documentElement.lang` updated on toggle AND init.

## State
- `localStorage` key `gitma`.
- Tracks: `lang`, `theme`, `modulesComplete[]`, `gameScores{}`, `flashcardMastery{}`.
- First-visit `theme` defaults to `prefers-color-scheme: dark` if the OS prefers dark.

## Routes & titles
- `#/` (home), `#/m/:id` (module), `#/lab` (practice lab).
- `document.title` updates per route: `<module-title> · GitMa 吉码`. Home stays at `GitMa 吉码 — GitHub Tutorial for Claude Coders`.
- LXGW WenKai (CJK font, ~3 MB) is **lazy-loaded** only when `lang=zh` — see `src/i18n.ts:5-19`. Subresource Integrity hash pinned.

## NotebookLM assets — manifest-driven
- Single `public/assets/notebooklm/manifest.json` lists which assets exist (`{"available": ["video","audio",...]}`).
- `src/components/notebooklm-slots.ts` fetches manifest once, hydrates only the listed slots (no per-slot HEAD probes — keeps the console clean).
- Currently shipped: `video.json` (YouTube ytId), `what-is-github.mp3` (audio overview, 25 min), `mindmap.svg` (sketchbook-styled), `briefing.pdf`, `study-guide.pdf`, `flashcards.json` (49-card NotebookLM deck).

## Modules (10)
1. The 5Ws + How (五问一答) — Lightning quiz + NotebookLM video/audio/mindmap slots
2. Anatomy of a Repository (仓库解剖) — hover SVG cross-section
3. Finding Repositories (寻宝) — Repo Detective game
4. Reading a README (看懂 README) — Spot the Sections drag-drop
5. Cloning & Using (克隆与使用) — command builder + license cards
6. GitHub × Claude Code (keystone) — pipeline diagram + Commit Translator + gh card
7. Branches & PRs (分支与合并请求) — branch tree + Local vs Remote sorter
8. Issues, Discussions, Projects — issue template builder
9. Pages & Actions intro — GH-vs-CF Pages comparison cards + one toy YAML
10. Practice Lab — flashcards + all 5 games + NotebookLM PDFs

## Tests
- `npm test` runs both `test/smoke.ts` (23 build-output assertions) and `test/commit-score.test.ts` (11 unit tests for the Commit Translator scoring heuristic — `src/games/commit-score.ts`).

## Security headers
`scripts/copy-assets.mjs` writes `dist/_headers` with: CSP (script-src 'self'; frame-src 'self' youtube-nocookie), HSTS, Permissions-Policy, X-Frame-Options DENY, X-Content-Type-Options, Referrer-Policy, plus cache rules for `/assets/notebooklm/*` and the JS/CSS bundles.

## Phase 2 — done
NotebookLM Video Overview, audio overview, mind map, briefing, study guide all live. Generated via `notebooklm-source.md` + `/notebooklm` skill (audio/text) and the NotebookLM web Studio panel (video). Add new assets by dropping the file into `public/assets/notebooklm/` and adding the key to `manifest.json`'s `available` list.
