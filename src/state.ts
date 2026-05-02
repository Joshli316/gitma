import type { AppState, Lang, Theme } from "./types";

const STORAGE_KEY = "gitma";

function detectInitialTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  try {
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) return "dark";
  } catch { /* SSR or unsupported */ }
  return "light";
}

const DEFAULT_STATE: AppState = {
  lang: "en",
  theme: "light",
  modulesComplete: {},
  gameScores: {},
  flashcardMastery: {},
};

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_STATE, theme: detectInitialTheme() };
    const parsed = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) throw new Error("bad");
    const merged: AppState = { ...DEFAULT_STATE, ...parsed };
    if (merged.lang !== "en" && merged.lang !== "zh") merged.lang = "en";
    if (merged.theme !== "light" && merged.theme !== "dark") merged.theme = "light";
    if (typeof merged.modulesComplete !== "object" || merged.modulesComplete === null) merged.modulesComplete = {};
    if (typeof merged.gameScores !== "object" || merged.gameScores === null) merged.gameScores = {};
    if (typeof merged.flashcardMastery !== "object" || merged.flashcardMastery === null) merged.flashcardMastery = {};
    return merged;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return { ...DEFAULT_STATE };
  }
}

export function saveState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    console.warn("GitMa: localStorage unavailable, progress will not persist");
  }
}

export function setLang(lang: Lang): AppState {
  const s = loadState();
  s.lang = lang;
  saveState(s);
  return s;
}

export function setTheme(theme: Theme): AppState {
  const s = loadState();
  s.theme = theme;
  saveState(s);
  return s;
}

export function markModuleComplete(id: string): AppState {
  const s = loadState();
  s.modulesComplete[id] = true;
  saveState(s);
  return s;
}

export function recordGameScore(id: string, score: number): AppState {
  const s = loadState();
  const existing = s.gameScores[id] ?? { best: 0, plays: 0 };
  s.gameScores[id] = {
    best: Math.max(existing.best, score),
    plays: existing.plays + 1,
  };
  saveState(s);
  return s;
}

export function setFlashcardMastery(id: string, level: "new" | "learning" | "known"): AppState {
  const s = loadState();
  s.flashcardMastery[id] = level;
  saveState(s);
  return s;
}

export function progressPct(): number {
  const s = loadState();
  const total = 10;
  const done = Object.values(s.modulesComplete).filter(Boolean).length;
  return Math.round((done / total) * 100);
}
