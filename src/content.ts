import { getLang } from "./i18n";
import type { ModulesContent } from "./types";

let cache: Record<string, ModulesContent> = {};

export async function loadModules(): Promise<ModulesContent> {
  const lang = getLang();
  if (cache[lang]) return cache[lang];
  const res = await fetch(`content/modules.${lang}.json`);
  if (!res.ok) throw new Error("Failed to load modules");
  const data: ModulesContent = await res.json();
  cache[lang] = data;
  return data;
}

export function clearContentCache(): void {
  cache = {};
}

let glossaryCache: any = null;
export async function loadGlossary(): Promise<any> {
  if (glossaryCache) return glossaryCache;
  const res = await fetch(`content/glossary.json`);
  if (!res.ok) throw new Error("Failed to load glossary");
  glossaryCache = await res.json();
  return glossaryCache;
}
