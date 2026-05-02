import { loadState, setTheme as persistTheme } from "./state";
import type { Theme } from "./types";

export function initTheme(): void {
  const t = loadState().theme;
  applyTheme(t);
}

export function getTheme(): Theme {
  return loadState().theme;
}

export function applyTheme(theme: Theme): void {
  if (theme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
  } else {
    document.documentElement.removeAttribute("data-theme");
  }
}

export function toggleTheme(): Theme {
  const next = getTheme() === "dark" ? "light" : "dark";
  persistTheme(next);
  applyTheme(next);
  return next;
}
