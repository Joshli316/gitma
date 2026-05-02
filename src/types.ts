export type Lang = "en" | "zh";
export type Theme = "light" | "dark";

export interface AppState {
  lang: Lang;
  theme: Theme;
  modulesComplete: Record<string, boolean>;
  gameScores: Record<string, { best: number; plays: number }>;
  flashcardMastery: Record<string, "new" | "learning" | "known">;
}

export interface ModuleSection {
  type: "prose" | "sticky" | "diagram" | "terminal" | "list" | "callout" | "embed" | "scribble";
  /** prose: html-safe paragraphs separated by \n\n */
  body?: string;
  /** sticky title */
  title?: string;
  /** diagram component id */
  diagramId?: string;
  /** terminal lines */
  lines?: string[];
  /** for "list" */
  items?: string[];
  /** for "callout" lean direction */
  lean?: "l" | "r";
  /** generic id for hash anchors */
  id?: string;
}

export interface ModuleContent {
  id: string;          // e.g. "m1"
  num: number;         // 1..10
  emoji: string;       // sketch icon hint
  title: string;       // e.g. "The 5Ws + How"
  subtitle: string;
  intro: string;       // first paragraph above sections
  sections: ModuleSection[];
  /** if a game lives here */
  game?: string;
  /** asymmetric device key for this page */
  asymmetric: "sticky" | "arrow" | "stain" | "scribble" | "tape" | "doodle";
  /** notebookLM slot keys to render at top */
  notebooklm?: ("video" | "audio" | "mindmap")[];
}

export interface ModulesContent {
  modules: ModuleContent[];
  glossary?: never;
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  options: string[];
  answer: number; // index
  rationale: string;
}

export interface RepoCard {
  id: string;
  name: string;     // e.g. "anthropics/claude-code"
  clue: string;     // hint user reads
  language: string;
  stars: string;    // "55k"
  commits: string;  // "freq"
  hint: string;     // for "what does this repo do?"
  url: string;
  reveal: string;   // explanation
}

export interface CommitTask {
  id: string;
  intent: string;
  good: string[]; // example acceptable answers
  hints: string[];
}

export interface SortableAction {
  id: string;
  label: string;
  bin: "local" | "remote" | "both";
}

export interface ReadmeSection {
  id: string;
  label: string; // section name to drag onto target
  hint: string;
}
