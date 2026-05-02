import { loadState, setLang } from "./state";
import type { Lang } from "./types";

/** UI strings (chrome — buttons, nav, footer). Module content lives in modules.{en,zh}.json. */
const ui: Record<string, Record<Lang, string>> = {
  // Header
  "ui.brand.tagline":  { en: "GitHub for Claude coders", zh: "Claude 程序员的 GitHub 入门" },
  "ui.toggle.lang":    { en: "中文", zh: "EN" },
  "ui.toggle.lang.aria": { en: "Switch to Chinese", zh: "切换到英文" },
  "ui.toggle.theme":   { en: "Dark", zh: "暗" },
  "ui.toggle.theme.light": { en: "Light", zh: "亮" },
  "ui.toggle.theme.aria": { en: "Toggle dark mode", zh: "切换深色模式" },
  "ui.skip":           { en: "Skip to content", zh: "跳到正文" },

  // Home
  "home.hero.title":   { en: "GitMa 吉码", zh: "GitMa 吉码" },
  "home.hero.lead": {
    en: "A bilingual sketchbook tutorial for understanding GitHub when you build with Claude Code.",
    zh: "一本用 Claude Code 建造时理解 GitHub 的双语手绘教程。",
  },
  "home.hero.sub": {
    en: "Ten short modules, five hands-on games, one living glossary. No CS degree required.",
    zh: "十节简短模块，五个动手小游戏，一份术语表。零基础也能学懂。",
  },
  "home.cta.start":    { en: "Start with Module 1 →", zh: "从第 1 节开始 →" },
  "home.cta.lab":      { en: "Jump to Practice Lab", zh: "直接进入练习场" },
  "home.modules.title": { en: "The 10 modules", zh: "十节模块" },
  "home.progress":     { en: "Your progress", zh: "你的进度" },
  "home.completed":    { en: "completed", zh: "已完成" },
  "home.module":       { en: "Module", zh: "模块" },
  "home.about":        { en: "Why this exists", zh: "为什么有这站" },
  "home.sticky":       { en: "made for one specific person — me. ~", zh: "给一个人做的——就是我自己。~" },
  "home.about.body": {
    en: "I save my Claude Code projects to GitHub, but I never deeply understood what was happening — repos, commits, branches, PRs. This is the personal companion I wished I had: a friendly hand-drawn explainer that pairs every concept with something I'll actually do at the terminal.",
    zh: "我把 Claude Code 项目保存到 GitHub，但一直没真正搞懂发生了什么——repo、commit、branch、PR 都是什么。这是我希望早点拥有的小伙伴：手绘风的友好解释，每个概念都配一个我真正会在终端里做的动作。",
  },

  // Module shell
  "mod.prev":          { en: "← Previous module", zh: "← 上一节" },
  "mod.next":          { en: "Next module →", zh: "下一节 →" },
  "mod.complete":      { en: "Mark module complete", zh: "标记本节完成" },
  "mod.completed":     { en: "✓ Module complete", zh: "✓ 本节已完成" },
  "mod.back-home":     { en: "← All modules", zh: "← 全部模块" },
  "mod.continue":      { en: "Continue to next module", zh: "继续下一节" },
  "mod.toc":           { en: "On this page", zh: "本页要点" },

  // NotebookLM slots
  "nb.video.title":    { en: "Video overview", zh: "视频简介" },
  "nb.video.empty":    { en: "Video drops here in Phase 2 — a 5-minute 'GitHub in 5 minutes' walkthrough.", zh: "二阶段会放一段五分钟的 GitHub 视频概览。" },
  "nb.audio.title":    { en: "Audio overview (~25 min)", zh: "音频概览（约二十五分钟）" },
  "nb.audio.empty":    { en: "Audio overview goes here in Phase 2.", zh: "音频概览将在二阶段加入。" },
  "nb.mindmap.title":  { en: "Mind map", zh: "思维导图" },
  "nb.mindmap.zoom":   { en: "Click to enlarge", zh: "点击放大" },
  "nb.zoom.close":     { en: "Close", zh: "关闭" },
  "nb.pdf.preview":    { en: "Preview", zh: "预览" },
  "nb.pdf.download":   { en: "Download", zh: "下载" },
  "nb.mindmap.empty":  { en: "Mind map goes here in Phase 2.", zh: "思维导图将在二阶段加入。" },
  "nb.briefing":       { en: "Briefing PDF", zh: "简报 PDF" },
  "nb.briefing.empty": { en: "Briefing PDF coming in Phase 2.", zh: "简报 PDF 将在二阶段加入。" },
  "nb.studyguide":     { en: "Study guide PDF", zh: "学习指南 PDF" },
  "nb.studyguide.empty": { en: "Study guide PDF coming in Phase 2.", zh: "学习指南将在二阶段加入。" },

  // Quiz
  "quiz.start":        { en: "Lightning Quiz: 5Ws", zh: "闪电小测：五问一答" },
  "quiz.score":        { en: "Score", zh: "得分" },
  "quiz.q-of":         { en: "Question {n} of {total}", zh: "第 {n} 题 / 共 {total} 题" },
  "quiz.next":         { en: "Next question →", zh: "下一题 →" },
  "quiz.finish":       { en: "See results", zh: "查看成绩" },
  "quiz.right":        { en: "Right!", zh: "答对了！" },
  "quiz.wrong":        { en: "Not quite.", zh: "不太对。" },
  "quiz.replay":       { en: "Try again", zh: "再来一次" },
  "quiz.your-score":   { en: "You scored {n} of {total}", zh: "你得了 {n} / {total}" },

  // Games
  "game.repo-detective.title": { en: "Repo Detective", zh: "Repo 侦探" },
  "game.repo-detective.lead": { en: "Read the clue, guess what each repo does, then peek at the answer.", zh: "看线索猜猜每个 repo 的用途，然后揭晓答案。" },
  "game.repo-detective.guess": { en: "Reveal answer", zh: "揭晓答案" },
  "game.repo-detective.open":  { en: "Open on GitHub", zh: "在 GitHub 打开" },
  "game.repo-detective.next":  { en: "Next case", zh: "下一案件" },

  "game.spot-readme.title": { en: "Spot the README sections", zh: "找出 README 板块" },
  "game.spot-readme.lead":  { en: "Drag each label onto the README block where it belongs.", zh: "把每个标签拖到 README 中对应的位置。" },
  "game.spot-readme.check": { en: "Check answers", zh: "检查答案" },
  "game.spot-readme.reset": { en: "Reset", zh: "重置" },
  "game.spot-readme.score": { en: "{n} of {total} correct", zh: "{n}/{total} 正确" },

  "game.commit.title": { en: "Commit Message Translator", zh: "Commit 信息翻译" },
  "game.commit.lead":  { en: "Write a commit message for the change. Good messages: verb-first, under 72 chars, mention the thing.", zh: "为这个改动写一句 commit 信息。好信息：动词开头，72 字以内，要点明对象。" },
  "game.commit.input.label": { en: "Your commit message", zh: "你的 commit 信息" },
  "game.commit.score": { en: "Score this", zh: "评分" },
  "game.commit.next":  { en: "Next change", zh: "下一个改动" },
  "game.commit.feedback.verb": { en: "Start with a verb (Add / Fix / Update / Remove…)", zh: "用动词开头（Add / Fix / Update / Remove…）" },
  "game.commit.feedback.length": { en: "Keep it under 72 characters", zh: "控制在 72 个字符以内" },
  "game.commit.feedback.thing": { en: "Mention the thing you changed (file, feature, area)", zh: "要点出你改的东西（文件、功能、区域）" },
  "game.commit.feedback.imperative": { en: "Use imperative mood — 'Add x', not 'Added x' or 'Adds x'", zh: "用祈使语气——'Add x'，不要 'Added x' 或 'Adds x'" },

  "game.lvr.title": { en: "Local vs Remote", zh: "本地 vs 远程" },
  "game.lvr.lead":  { en: "Drag each action into the bucket where it actually happens.", zh: "把每个动作拖到它真正发生的桶里。" },
  "game.lvr.local":  { en: "Local (your laptop)", zh: "本地（你的电脑）" },
  "game.lvr.remote": { en: "Remote (GitHub)", zh: "远程（GitHub）" },
  "game.lvr.both":   { en: "Both", zh: "两边都有" },
  "game.lvr.check":  { en: "Check", zh: "检查" },
  "game.lvr.reset":  { en: "Reset", zh: "重置" },

  // Lab
  "lab.title": { en: "Practice Lab", zh: "练习场" },
  "lab.lead":  { en: "Five games, thirty flashcards, downloadable PDFs. Come back here whenever a concept feels fuzzy.", zh: "五个游戏、三十张卡片、可下载的 PDF。哪个概念模糊就回来翻一翻。" },
  "lab.flashcards.title": { en: "Flashcards", zh: "速记卡" },
  "lab.flashcards.flip": { en: "Flip", zh: "翻面" },
  "lab.flashcards.known": { en: "Known", zh: "已掌握" },
  "lab.flashcards.learning": { en: "Learning", zh: "学习中" },
  "lab.flashcards.new": { en: "New", zh: "新卡" },
  "lab.flashcards.next": { en: "Next →", zh: "下一张 →" },
  "lab.flashcards.prev": { en: "← Prev", zh: "← 上一张" },
  "lab.flashcards.shuffle": { en: "Shuffle", zh: "打乱" },
  "lab.flashcards.empty": { en: "All caught up — well done.", zh: "全部学完，太棒了。" },
  "lab.games.title": { en: "Games", zh: "游戏" },
  "lab.pdfs.title": { en: "Downloads", zh: "下载" },
  "lab.best": { en: "Best", zh: "最佳" },
  "lab.plays": { en: "plays", zh: "次" },

  // Footer
  "ftr.copy":          { en: "GitMa 吉码 · made for personal use · open-source", zh: "GitMa 吉码 · 个人项目 · 开源" },
  "ftr.repo":          { en: "Source on GitHub", zh: "GitHub 源代码" },

  // Errors
  "err.load":          { en: "Couldn't load the content. Refresh and try again.", zh: "内容加载失败，请刷新重试。" },
  "err.404.title":     { en: "Lost the page!", zh: "页面找不到了" },
  "err.404.body":      { en: "That route doesn't exist. Head back to the modules.", zh: "这个路径不存在，请回到模块列表。" },
};

let currentLang: Lang = "en";

/** LXGW WenKai (~3MB CJK brush font) lazy-loaded only when Chinese is active. */
const LXGW_HREF = "https://cdn.jsdelivr.net/npm/lxgw-wenkai-webfont@1.7.0/style.css";
const LXGW_SRI = "sha384-KiXbx4H8g5WzsoWp+1s62zOzXEJNjRp/obm1oFBhyBn4T5IJFF+a3p+Oa3hzsZeI";

function ensureLxgwLoaded(): void {
  if (document.querySelector(`link[href="${LXGW_HREF}"]`)) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = LXGW_HREF;
  link.integrity = LXGW_SRI;
  link.crossOrigin = "anonymous";
  document.head.appendChild(link);
}

export function initI18n(): void {
  currentLang = loadState().lang;
  document.documentElement.lang = currentLang;
  if (currentLang === "zh") ensureLxgwLoaded();
}

export function t(key: string, replacements?: Record<string, string | number>): string {
  const entry = ui[key];
  if (!entry) return key;
  let text = entry[currentLang] || entry.en || key;
  if (replacements) {
    for (const [k, v] of Object.entries(replacements)) {
      text = text.replaceAll(`{${k}}`, String(v));
    }
  }
  return text;
}

export function getLang(): Lang { return currentLang; }

export function setLanguage(lang: Lang): void {
  currentLang = lang;
  document.documentElement.lang = lang;
  setLang(lang);
  if (lang === "zh") ensureLxgwLoaded();
}

export function toggleLang(): Lang {
  const next: Lang = currentLang === "en" ? "zh" : "en";
  setLanguage(next);
  return next;
}
