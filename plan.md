# GitMa 吉码 — GitHub Tutorial for Claude Coders

## Context

Z saves Claude Code projects to GitHub but doesn't deeply understand what's happening — repos, commits, branches, PRs, GitHub × Claude Code workflows. He wants a personal bilingual tutorial site that teaches the essentials + intermediate topics, leans on visual learning (sketchbook diagrams), and includes practice games. NotebookLM-generated audio/video/mind-map slots are designed in now but **filled in a Phase 2 session** so the build stays focused.

This sits in the tutorial family alongside QiMa, MaDao, CodePlay, AgentPath — same stack, same deploy target, sketchbook-aesthetic differentiation.

## Recommended Approach

**Stack:** Vanilla TypeScript + esbuild + Tailwind v4, JSON-driven bilingual content, hash router, localStorage state, Cloudflare Pages. Mirrors AgentPath/CodePlay. No external runtime APIs.

**Design vibe:** Whiteboard sketchbook — cream paper, marker headings (Patrick Hand + LXGW WenKai for CJK), Nunito body, sketchy double-border cards, sticky-note callouts, hand-drawn SVG diagrams with `feTurbulence` wobble filter. Dark "chalkboard" mode via CSS custom properties. One asymmetric break + one sharp anchor (terminal block) per page.

**Project location:** `~/Desktop/Projects/gitma/` → deploys to `gitma.pages.dev`

## Module list (10)

| # | Title (EN / ZH) | What user does |
|---|---|---|
| 1 | The 5Ws + How / 五问一答 | Hotspot diagram of laptop ↔ cloud + 5Ws lightning quiz |
| 2 | Anatomy of a Repository / 仓库解剖 | Hover labelled SVG cross-section, expand sticky-note explanations |
| 3 | Finding Repositories / 寻宝 | Play Repo Detective (curated cards) |
| 4 | Reading a README / 看懂 README | Spot-the-README-sections drag-drop |
| 5 | Cloning & Using / 克隆与使用 | Command builder + license literacy cards |
| 6 | GitHub × Claude Code / GitHub 与 Claude Code | His real workflow — pipeline diagram, Commit Translator game, gh CLI install card |
| 7 | Branches & Pull Requests / 分支与合并请求 | Interactive branch-tree + Local vs Remote sorter |
| 8 | Issues, Discussions, Projects / 议题与协作 | Convert vague complaint → good issue with template |
| 9 | Pages & Actions intro / Pages 与 Actions 简介 | GH Pages vs CF Pages comparison + one toy YAML |
| 10 | Practice Lab / 练习场 | All 5 games + flashcards + downloadable PDFs |

## Games (5)

1. **5Ws Lightning Quiz** (M1) — 6 multiple-choice
2. **Spot the README Sections** (M4) — drag labels onto a real README screenshot
3. **Repo Detective** (M3) — 5–7 hand-picked real repos in JSON, clue card → guess → reveal + link to github.com
4. **Commit Message Translator** (M6) — type message for an intent, scored against verb-first / <72 chars / mentions-the-thing pattern
5. **Local vs Remote Sorter** (M7) — drag actions into Local / Remote / Both buckets

Drag-and-drop helper supports HTML5 DnD + iOS tap-to-select fallback (built once in `src/lib/dnd.ts`, reused).

## NotebookLM slots (Phase 2 fills)

All slots ship with empty-state sticky-notes. `src/components/notebooklm-slots.ts` does HEAD-checks on each asset path on route change and toggles `[data-empty]` for CSS styling. Phase 2 just drops files into `public/assets/notebooklm/`.

| Slot | Location | Asset path |
|---|---|---|
| Mind map (SVG) | M1 figure | `/assets/notebooklm/mindmap.svg` |
| Audio overview (~10 min mp3) | M1 sidebar | `/assets/notebooklm/what-is-github.mp3` |
| Video overview (YouTube embed) | M1 hero | `/assets/notebooklm/video.json` → `{ "ytId": "..." }`, iframe uses `youtube-nocookie.com` |
| Flashcards (30 terms) | M10 | Already in `src/content/glossary.json`; Phase 2 enriches definitions |
| Briefing PDF | every footer + M10 | `/assets/notebooklm/briefing.pdf` |
| FAQ / Study Guide PDF | M10 | `/assets/notebooklm/study-guide.pdf` |

## Design Spec

**Light "cream paper" tokens (`:root`)**
```
--ink: #1f1b16        --paper: #faf6ec      --paper-2: #f3ecd8
--rule: #2b2620       --coral: #e26d5c      --mustard: #e3a72f
--teal: #2a9d8f       --lavender: #8a7fbf   --sticky: #fff27a
--sticky-shd: rgba(0,0,0,.18)
```

**Dark "chalkboard" tokens (`[data-theme="dark"]`)**
```
--ink: #ece7d7        --paper: #1c2a2a      --paper-2: #243433
--rule: #ece7d7       --coral: #d97a6c      --mustard: #d4a85a
--teal: #5fb3a8       --lavender: #a99fcf   --sticky: #f7e572
```

**Typography**
- Headings: `'Patrick Hand', 'LXGW WenKai', 'Noto Sans SC', cursive` (LXGW WenKai is free open-source brush-style CJK — bilingual sketchbook stays cohesive)
- Body: `'Nunito', system-ui` 400/600/700
- Mono (the ONE precise anchor element): `'JetBrains Mono'` 16px, hard 6px corners, `--ink` background, `--paper` text
- `html { font-size: 18px }`. Module titles `text-5xl`, section headings `text-3xl` minimum.

**Sketch card (default)**
```css
.sketch-card {
  background: var(--paper-2);
  border: 2.5px solid var(--rule);
  border-radius: 14px 18px 12px 20px / 16px 12px 20px 14px;
  box-shadow: 3px 3px 0 var(--rule), 6px 6px 18px rgba(0,0,0,.08);
  position: relative;
}
.sketch-card::after {
  content: ""; position: absolute; inset: 4px;
  border: 1.5px solid var(--rule); border-radius: inherit;
  opacity: .35; pointer-events: none;
}
```

**Sticky-note callout**
```css
.sticky {
  background: var(--sticky); color: #2a2a1a;
  padding: 1rem 1.1rem;
  transform: rotate(-1.4deg);
  box-shadow: 4px 6px 12px var(--sticky-shd);
  font-family: 'Patrick Hand', 'LXGW WenKai', cursive;
  font-size: 1.15rem; max-width: 22rem;
}
.sticky:nth-of-type(even) { transform: rotate(1.1deg); }
```

**SVG wobble filter** (sprite included once in `index.html`, applied to diagrams via `style="filter:url(#wobble)"`):
```html
<svg width="0" height="0"><filter id="wobble">
  <feTurbulence baseFrequency="0.02" numOctaves="2" seed="3"/>
  <feDisplacementMap in="SourceGraphic" scale="1.5"/>
</filter></svg>
```

**Anti-AI rules per page (enforced in review)**
- ONE asymmetric break — rotate the device per module so it doesn't become a new pattern (sticky on M1, hand-drawn arrow across cards on M2, coffee-stain SVG on M3, etc.)
- ONE sharp/precise terminal block to anchor the soft sketchy stuff
- Card rotations alternate `-1.5deg / +1deg / -0.8deg / +1.4deg` — no two adjacent cards lean the same way

**Bilingual**
- Header `中 / EN` toggle, persists to localStorage, syncs `document.documentElement.lang`
- All strings keyed identically in `modules.en.json` / `modules.zh.json`
- Brand terms (GitHub, Claude Code, README, gh, git, PR) stay in English in both files
- PR translates as 合并请求 (clearer than 拉取请求)
- Native-tone Chinese pass during review; no MTL feel

## File structure

```
gitma/
├── index.html
├── package.json  tsconfig.json  tailwind.config.js  wrangler.toml
├── README.md  CLAUDE.md  plan.md
├── styles/main.css
├── public/
│   ├── favicon.svg  og-image.png
│   └── assets/notebooklm/         # Phase 2 drops files here
├── src/
│   ├── main.ts  router.ts  i18n.ts  state.ts  theme.ts  types.ts
│   ├── content/
│   │   ├── modules.en.json  modules.zh.json
│   │   └── glossary.json
│   ├── lib/
│   │   └── dnd.ts                 # HTML5 DnD + iOS tap fallback
│   ├── components/
│   │   ├── header.ts  sticky-note.ts  sketch-card.ts  progress-bar.ts
│   │   ├── notebooklm-slots.ts  flashcards.ts  terminal-block.ts
│   │   └── diagrams/
│   │       ├── local-vs-remote.ts  repo-anatomy.ts
│   │       ├── cc-pipeline.ts      branch-tree.ts
│   ├── screens/
│   │   ├── home.ts  module.ts  lab.ts
│   └── games/
│       ├── lightning-quiz.ts  spot-readme.ts  repo-detective.ts
│       ├── commit-translator.ts  local-remote-sorter.ts
└── dist/                          # build output
```

## Critical files to reuse / reference

- `~/Desktop/Projects/agentpath/package.json` + `tsconfig.json` — copy verbatim, rename
- `~/Desktop/Projects/agentpath/src/router.ts` — hash router pattern
- `~/Desktop/Projects/agentpath/src/i18n.ts` — bilingual JSON loader
- `~/Desktop/Projects/agentpath/src/state.ts` — localStorage progress pattern
- `~/Desktop/Projects/codeplay/src/screens/` — SPA screen module pattern
- `~/Desktop/Projects/codeplay/src/games/` — game mechanics reference (drag-drop, scoring, feedback)
- `~/Desktop/Projects/qima/src/styles/` — Tailwind v4 + custom CSS layering

## Build order — 18 steps

1. Scaffold from AgentPath (package.json, tsconfig, build script, esbuild config). Init `index.html`, `wrangler.toml`, `CLAUDE.md`. Verify `npm run dev` boots.
2. Tailwind v4 + design tokens in `styles/main.css`. Google Fonts (Patrick Hand, Nunito, JetBrains Mono) + LXGW WenKai (CDN: `cdn.jsdelivr.net/npm/lxgw-wenkai-webfont`).
3. Core CSS components: `.sketch-card`, `.sticky`, `.terminal`. SVG wobble filter sprite in `index.html`.
4. Theme + i18n + state modules. Header with both toggles. Persist + verify on stub page.
5. Router + `screens/home.ts`: 10 modules as sketch cards with progress checkmarks.
6. Generic `screens/module.ts`: reads `modules.en/zh.json`, renders sections (heading, prose, sticky callouts, diagram slot, terminal blocks, "next" marks complete).
7. **Module 1** content (EN+ZH) + 5Ws Lightning Quiz + wire NotebookLM mindmap/audio/video slots with empty states.
8. Diagram pipeline: build `diagrams/local-vs-remote.ts` first to prove wobble filter + label injection. Template for M2/M6/M7.
9. **Module 2**: `repo-anatomy.ts` SVG with hover hotspots + content.
10. **Modules 3 + 4** + Repo Detective (curated 5–7 cards in JSON) + Spot README. Build `lib/dnd.ts` here.
11. **Module 5**: command-builder component (copy-to-clipboard) + license cards.
12. **Module 6** (keystone — his actual workflow): CC × GitHub pipeline diagram + Commit Translator + `gh` install card. Spend extra time on copy.
13. **Module 7**: branch-tree diagram + Local vs Remote sorter.
14. **Module 8**: issue-template-builder mini-component.
15. **Module 9**: GH Pages vs CF Pages cards + one annotated YAML in terminal block.
16. **Module 10** (Practice Lab): flashcards reading `glossary.json` + mastery tracking + links to all 5 games + downloadable PDF slots.
17. NotebookLM slot manager polish: HEAD-check on route change, consistent empty-state copy.
18. Review pass + deploy: anti-AI audit, Chinese tone review, Lighthouse, `_headers`/`404.html`/`sitemap.xml`/`robots.txt`, `wrangler pages deploy dist`.

## Phase 2 (separate session, after build)

After site is live with empty NotebookLM slots:
1. Write `notebooklm-source.md` (consolidated tutorial content, ~3K words EN+ZH)
2. Run `/notebooklm` to generate: mind map, briefing doc, audio overview (~10 min), study guide, FAQ, flashcard deck
3. Run `/ytr` (or NotebookLM Video Overview) for ~5 min "GitHub in 5 minutes" video
4. Drop files into `public/assets/notebooklm/`, set `video.json` ytId
5. Enrich `glossary.json` definitions from NotebookLM flashcard output
6. Rebuild + redeploy

## Verification

After build (before saying DONE):
- `npm run build` succeeds, `dist/` contains `index.html` + bundled JS/CSS
- `npm run dev` opens, all 10 modules navigate via hash router
- Bilingual toggle swaps every visible string (no English leaks in ZH mode and vice versa); `html[lang]` updates
- Theme toggle works; dark mode has sufficient contrast (no gray-on-dark-gray)
- Responsive at 375 / 768 / 1024 px — sticky notes + sketch cards don't break grids
- All 5 games playable; localStorage persists progress across reloads
- iOS Safari: drag-drop fallback works (manual test on phone, or browser DevTools touch emulation)
- NotebookLM slots show empty-state sticky-notes when assets missing (don't 404 visibly)
- Open localhost preview in browser (per `feedback_preview_before_deploy.md`) — visual confirm before deploy
- After deploy: `curl -I https://gitma.pages.dev` returns 200; spot-check on phone

## Design Doc

A short design rationale lives in this plan's Context + Design Spec sections. No separate doc needed — this is a personal tool, not a team project, and the "why" fits comfortably here.

---

## Build Prompt (paste into a fresh session)

```
This is a BUILD session. Working directory: ~/Desktop/Projects/gitma/

Read /Users/zhihuang/.claude/plans/assume-you-are-an-prancy-codd.md
(or copy plan.md into the project root from there first).

Implement all 18 steps in order. Don't ask questions — make reasonable
decisions and keep moving.

Key rules:
- Use /frontend-design judgment on every UI surface. Follow the Design
  Spec in plan.md exactly — cream paper, Patrick Hand + LXGW WenKai,
  sketch cards, sticky notes, terminal anchor element. Do not default
  to generic Tailwind styles.
- Bilingual EN+ZH from day one. All strings in modules.en.json /
  modules.zh.json. html[lang] updated on toggle AND init.
- One asymmetric break + one sharp terminal block per module page.
  Rotate the asymmetric device so it doesn't become a new pattern.
- Reuse from ~/Desktop/Projects/agentpath (router, i18n, state) and
  ~/Desktop/Projects/codeplay (screens, games). Copy verbatim, then
  adapt — don't rewrite from scratch.
- Drag-and-drop: build src/lib/dnd.ts ONCE with HTML5 DnD + iOS tap
  fallback. Reuse in Spot README and Local vs Remote Sorter.
- NotebookLM slots SHIP EMPTY with sticky-note placeholders. Do not
  generate any audio/video/PDF in this session — that's Phase 2.
- After every module, run a quick visual check at 375/768/1024px.
- Run /verify when all steps are complete. Do not say DONE until /verify
  passes.
- Open localhost preview before deploying so I can confirm visually.
- Deploy: wrangler pages deploy dist/ to gitma.pages.dev. Set up GitHub
  remote and push as part of deploy. Run `git remote set-head origin --auto`
  after first push.
- Use parallel agents where independent (e.g., translate ZH content
  while building games).
```
