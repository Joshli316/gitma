import { getLang } from "./i18n";

const escapeMap: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };

export function escapeHtml(str: string): string {
  return String(str).replace(/[&<>"']/g, (ch) => escapeMap[ch]);
}

/** Pull a localized field. Looks up `field` (en) or `${field}Zh` (zh). */
export function localize<T extends Record<string, unknown>>(obj: T, field: string): string {
  const lang = getLang();
  const zhKey = `${field}Zh`;
  if (lang === "zh" && zhKey in obj) return String(obj[zhKey] ?? "");
  return String(obj[field] ?? "");
}

/** Render markdown-like emphasis: **bold** and `code`. Escapes HTML first. */
export function rich(str: string): string {
  let out = escapeHtml(str);
  out = out.replace(/`([^`]+)`/g, '<code>$1</code>');
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  return out;
}

/** Split a paragraph string by blank lines. */
export function paragraphs(str: string): string[] {
  return String(str).split(/\n{2,}/).map((s) => s.trim()).filter(Boolean);
}

/** Pick a card-rotation class so adjacent cards lean opposite ways. */
export function leanFor(i: number): string {
  return ["lean-1", "lean-2", "lean-3", "lean-4"][i % 4];
}

/** Fisher-Yates shuffle (in place). */
export function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/** Robust HTML element lookup (or throw). */
export function $(sel: string, root: ParentNode = document): HTMLElement {
  const el = root.querySelector(sel);
  if (!el) throw new Error(`No element for ${sel}`);
  return el as HTMLElement;
}

export function $$(sel: string, root: ParentNode = document): HTMLElement[] {
  return Array.from(root.querySelectorAll(sel)) as HTMLElement[];
}
