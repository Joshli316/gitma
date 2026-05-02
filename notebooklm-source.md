# GitMa 吉码 — GitHub Tutorial for Claude Coders (NotebookLM source)

> Consolidated bilingual tutorial content for NotebookLM ingestion.
> Audience: people who already build with Claude Code but never learned GitHub deeply.
> Tone: friendly, conversational, slightly self-deprecating. Every concept paired with what you'll actually do at the terminal.

---

## 1. The 5Ws + How / 五问一答

**GitHub** is a website that holds folders of code — and the history of every change ever made to those folders. When you build something with **Claude Code** and run `git push`, your work lives in one of those folders, in the cloud, with a public link.

Imagine a Google Doc, but for folders of code. Two big differences:

1. **Time travel is built in.** Every saved version is recorded. You can rewind a file (or the whole project) to any point in its history. No `final_v2_FINAL.docx` chaos.
2. **Many people can edit the same project safely.** Two collaborators don't overwrite each other — they each work on a copy, then *propose* their changes. The owner reviews, then merges.

The 5Ws + How:
- **Who** — anyone who writes code, plus more and more people who don't (designers, writers, hobbyists).
- **What** — a website hosting `git` repositories, plus tools (Issues, PRs, Pages, Actions) wrapped around them.
- **Where** — `github.com` (the website) and `~/Desktop/Projects/your-app` (a copy on your laptop).
- **When** — every time you `git push`, GitHub gets the new version.
- **Why** — backup, sharing, history, collaboration, free hosting (Pages).
- **How** — `git` is the engine, GitHub is the website, Claude Code drives `git` for you.

中文：**GitHub** 是一个托管代码文件夹（以及它们完整改动历史）的网站。当你用 Claude Code 写完东西，跑一句 `git push`，你的成果就住进云端的某个文件夹，附带一个公开链接。两个关键差别：时间旅行内建（每次保存都有记录），多人协作不会互相覆盖。

---

## 2. Anatomy of a Repository / 仓库解剖

A **repository (repo)** is a folder. The folder happens to be tracked by `git`, which means it has a hidden `.git/` subfolder full of bookkeeping. Everything else is just files.

The bits worth memorizing:
- **`README.md`** — the front door. The first thing people read on `github.com`.
- **`LICENSE`** — what others are allowed to do with your code. No license means "all rights reserved" by default.
- **`.gitignore`** — files `git` should pretend don't exist. `node_modules/`, `.env`, `dist/` always go here.
- **`.git/`** — the hidden time-machine folder. Don't touch it.

Mental model: repo = a folder + a time machine + a front-door page.

中文：仓库就是一个文件夹，加一台时间机器，再加一张门面页。`README.md`、`LICENSE`、`.gitignore`、`.git/` 是值得记住的几个文件。

---

## 3. Finding Repositories / 寻宝

GitHub hosts ~400 million repos. Most are someone's homework. The good ones share a few tells:

1. **Stars** — like Twitter likes, but slower. 1k+ usually means "this is real". 10k+ means "industry standard". Less than 100 isn't bad — it means "small or new". Stars are a signal, not a verdict.
2. **Last commit date** — top-right of the file list. If the most recent change is from 2019, the project is probably abandoned. "Updated last week" is the green flag.
3. **Issues / PRs activity** — lots of *open* issues with recent comments = active community. Hundreds of *closed* PRs = maintainers who actually merge things.

Don't fall for polished READMEs alone. Slick logos and screenshots can hide unmaintained code. Always check the dates.

Search-bar tricks: `language:python`, `stars:>1000`, `pushed:>2025-01-01`, combinations. `github.com/trending` for what's hot now.

中文：看三件事：星标（信号不是判决）、最近一次 commit 的时间（避免 2019 年的项目）、Issues / PRs 活跃度。漂亮的 README 不能保证项目还活着。

---

## 4. Reading a README / 看懂 README

A good `README.md` answers four questions in the first screenful: **what is this**, **how do I install it**, **how do I use it**, **why should I care**.

Seven sections you'll see again and again:
1. **Title + tagline** — what it is, in one line.
2. **Hero / demo** — animated GIF, screenshot, or live link.
3. **Features** — bullet list of what's included.
4. **Install** — `npm install`, `pip install`, `brew install`. Commands you can copy.
5. **Usage** — minimal example showing the thing actually working.
6. **License** — MIT, Apache, GPL — what you're allowed to do.
7. **Contributing** — how outsiders can help.

Red flag: no `Install` section. If they don't tell you how to run it, the project is probably half-built.

中文：好 README 第一屏回答四个问题：是什么、怎么装、怎么用、为什么我要管。七个常见板块：标题、演示、功能、安装、使用、许可证、贡献指南。没有"安装"那段，多半是半成品。

---

## 5. Cloning & Using / 克隆与使用

**Cloning** means downloading a copy of the repo (with full history) onto your machine.

Two ways:
- `git clone <url>` — the original. Works everywhere `git` is installed.
- `gh repo clone <owner>/<repo>` — the modern one. Same result, less typing. Auto-uses your GitHub auth.

Both land you in a new folder named after the repo. From there you `cd` into it and follow the README.

License literacy:
- **MIT** — do anything, just keep the copyright line. Most permissive.
- **Apache 2.0** — like MIT, plus a patent grant.
- **GPL** — copyleft. If you redistribute, your changes must also be open-source.
- **No license** — all rights reserved. You can read it; you can't legally reuse it.

Cloning is read-mostly. To save changes back, either be a collaborator on the original repo, or **fork** it (your own copy on github.com) and push to that. Forks are how almost all open-source contribution starts.

中文：clone 就是把整个 repo（带历史）下载到本地。`git clone` 老路子；`gh repo clone` 新路子，少打字。许可证四档：MIT 最宽松，Apache 2.0 多了专利条款，GPL 是 copyleft，没 license 等于保留所有权利。要回传改动得 fork。

---

## 6. GitHub × Claude Code / GitHub 与 Claude Code (keystone)

When you ask Claude Code to "push it to GitHub", what's actually happening?

The five-step pipeline:
1. **Code lives in your project folder** (`~/Desktop/Projects/my-app`). Claude Code edits files there.
2. **`git` watches the folder.** `git status` shows what changed. `git add .` says "I want to save these changes".
3. **`git commit -m "..."` saves a snapshot.** A commit is a labelled bookmark in time.
4. **`git push` sends new commits to GitHub** over the network.
5. **`gh` is the GitHub CLI** — lets you do GitHub-website-things from the terminal. Create repos, open PRs, view issues, all without leaving Claude Code.

Three tools, one job: `git` = save points (local), `github.com` = the website (cloud), `gh` = the bridge.

What "good commit message" really means:
- **Verb-first.** `Add` `Fix` `Update` `Remove` `Refactor`. Imperative, like an order to the codebase.
- **Under 72 characters.** Long enough to explain, short enough to scan.
- **Mention the thing.** `Fix login` ✓ — `Fix bug` ✗.

中文：问 Claude Code "push 到 GitHub" 时，背后是五步流水线：项目文件夹 → `git status` / `git add` → `git commit -m` → `git push` → `gh` 命令行。三个工具：`git` 是本地存档点，`github.com` 是云端网站，`gh` 是把它们友好连接的桥。好 commit 信息：动词开头、72 字以内、点出对象。

---

## 7. Branches & Pull Requests / 分支与合并请求

A **branch** is a parallel timeline. You start one, make changes, and the main project keeps going untouched. When you're happy, you open a **Pull Request (PR / 合并请求)** — a formal proposal: "please merge my branch into main".

The flow, every time:
1. `git checkout -b feature/login` — make a branch, switch to it.
2. Edit files. `git commit` your changes.
3. `git push -u origin feature/login` — push the branch to GitHub.
4. `gh pr create` — open a PR.
5. Reviewer leaves comments. You push more commits. The PR updates automatically.
6. Approval → "Squash and merge" → branch is folded into `main`. Delete the branch.

Why bother: branches let you *try* something risky without breaking `main`. If it works, merge. If not, throw the branch away. Zero lasting damage.

**Local vs remote** confuses everyone at first. Local = your laptop. Remote = GitHub. `git commit` is local-only until you `git push`.

中文：分支是平行时间线，让你试改动而不动 main。流程：`git checkout -b` → 改 → `git commit` → `git push -u origin <branch>` → `gh pr create` → 审 → 合并 → 删分支。本地（你的电脑） vs 远程（GitHub）：`commit` 在本地，`push` 之后 GitHub 才知道。

---

## 8. Issues, Discussions, Projects / 议题与协作

An **Issue** is a thread for a single bug, feature request, or question. **Discussions** are like a forum. **Projects** are kanban boards. All three live next to your code.

A good issue has:
- **Title** — verb-first, specific. `Fix dark-mode contrast on settings page` beats `Bug`.
- **Steps to reproduce** — numbered, no skipped steps.
- **Expected vs actual** — what you thought would happen, what actually happened.
- **Environment** — OS, browser, Claude Code version.

Labels matter: `bug`, `enhancement`, `good first issue`, `help wanted`. They're how strangers find issues they can help with.

Issues, PRs, and commits can reference each other: write `Closes #12` in a PR description and merging it auto-closes that issue.

中文：Issue = 一个 bug / 功能 / 问题的讨论串。Discussions 是论坛，Projects 是看板。好 issue 有：动词开头标题、可重现步骤、预期 vs 实际、环境信息。标签让陌生人找到能帮的事。`Closes #12` 自动关 issue。

---

## 9. Pages & Actions intro / Pages 与 Actions 简介

**GitHub Pages** turns a repo into a public website at `username.github.io/repo-name`. Free, fast, no servers.

**GitHub Actions** are tiny robots that run on events ("on push", "on PR opened") — they can lint your code, run tests, deploy your site, send a notification. Both are free for personal projects.

GitHub Pages vs Cloudflare Pages — both are free static hosting; both deploy on push.
- **GitHub Pages** is simplest if your project already lives on GitHub. Limits: 1 GB/site, ~100 GB/month bandwidth.
- **Cloudflare Pages** has unlimited bandwidth, faster global CDN, native Workers integration, and previews-per-PR.

Most projects in this tutorial family deploy to Cloudflare Pages — `wrangler pages deploy dist`.

Actions live in `.github/workflows/<name>.yml`. Recognize the shape: **name → on → jobs → steps**. When something fails on push, a red ✗ appears next to the commit on github.com — click it for the full log.

中文：GitHub Pages = 免费把 repo 当网站发布，URL 是 `username.github.io/repo-name`。GitHub Actions = 监听事件（push、PR）跑小机器人，能 lint、测试、部署。Pages 适合内部小工具，Cloudflare Pages 适合公开项目。Actions 文件在 `.github/workflows/`，记住 `name → on → jobs → steps` 这个结构就够了。

---

## 10. Glossary / 术语表

**repo / 仓库** — a folder tracked by git, with full history of every change.
**commit / 提交** — a labelled snapshot in time. `git commit -m "..."`
**branch / 分支** — a parallel timeline. Lets you try changes without touching main.
**merge / 合并** — folding one branch's commits into another.
**Pull Request (PR / 合并请求)** — formal proposal to merge a branch — gets reviewed and discussed.
**fork / 派生** — your own copy of someone else's repo on GitHub.
**clone / 克隆** — download a repo (with history) onto your laptop.
**remote / 远程** — a linked copy of your repo on a server (origin = GitHub).
**origin** — the default name for your main remote — usually GitHub.
**main / 主分支** — the default branch name. (Used to be `master`.)
**HEAD** — pointer to the commit you're currently on.
**stage / 暂存** — mark files for the next commit (`git add`).
**push** — send your local commits to the remote.
**pull** — fetch remote commits and merge them locally.
**.gitignore** — list of files git should ignore (`node_modules`, `.env`, `dist`).
**README** — the front-door file shown on github.com — what + how + why.
**LICENSE** — what others are allowed to do with your code.
**MIT** — most permissive license. "Use it for anything; keep my name in."
**Apache 2.0** — like MIT, plus a patent grant.
**GPL** — copyleft. If you redistribute, your changes must also be open-source.
**Issue / 议题** — a thread for one bug, feature, or question.
**label / 标签** — tags on issues/PRs — bug, enhancement, good first issue.
**GitHub Pages** — free static hosting that serves your repo as a website.
**Actions** — tiny robots that run on push, PR, or schedule. Free for personal use.
**workflow / 工作流** — a YAML file in `.github/workflows/` that tells Actions what to do.
**gh** — the GitHub CLI. GitHub-website-things from the terminal.
**diff / 差异** — the line-by-line difference between two versions.
**merge conflict / 合并冲突** — when git can't auto-merge two branches and asks you to choose.
**squash / 压缩** — collapse multiple commits into one before merging.
**tag / release** — a named, frozen point in history — usually a version (`v1.0.0`).

---

## 11. The single mental model

Repo = folder + time machine + front-door page.
Three tools, one job: `git` (local save points), `github.com` (the cloud website), `gh` (the bridge).
Five-step pipeline: edit → `git add` → `git commit` → `git push` → it's on GitHub.
Branch = parallel timeline; PR = formal merge proposal.
Issues / Discussions / Projects = where the work gets organized, all next to the code.
Pages = free hosting; Actions = robots-on-event.

If you can sketch that on a napkin, you understand GitHub. The rest is muscle memory.

中文：把所有东西画在餐巾纸上：repo = 文件夹 + 时间机器 + 门面页。三个工具：`git` 本地存档、`github.com` 云端网站、`gh` 桥梁。五步流水线：改 → add → commit → push → 上 GitHub。分支 = 平行时间线，PR = 正式合并申请。Issues / Discussions / Projects 把工作组织在代码旁边。Pages 免费托管，Actions 事件触发的小机器人。能画出这张餐巾纸图，你就懂 GitHub 了，剩下的全是肌肉记忆。
