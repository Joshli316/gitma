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

## Modules (10)
1. The 5Ws + How (五问一答) — Lightning quiz
2. Anatomy of a Repository (仓库解剖) — hover SVG cross-section
3. Finding Repositories (寻宝) — Repo Detective game
4. Reading a README (看懂 README) — Spot the Sections drag-drop
5. Cloning & Using (克隆与使用) — command builder + license cards
6. GitHub × Claude Code (keystone) — pipeline diagram + Commit Translator + gh card
7. Branches & PRs (分支与合并请求) — branch tree + Local vs Remote sorter
8. Issues, Discussions, Projects — issue template builder
9. Pages & Actions intro — comparison cards + one toy YAML
10. Practice Lab — flashcards + all 5 games + NotebookLM PDFs

## Phase 2
NotebookLM slots ship empty with sticky-note placeholders. Phase 2 drops files into `public/assets/notebooklm/` (mindmap.svg, what-is-github.mp3, video.json, briefing.pdf, study-guide.pdf) and enriches `glossary.json`.
