import { t, getLang, toggleLang } from "../i18n";
import { getTheme, toggleTheme } from "../theme";
import { progressPct } from "../state";

export function renderHeader(): string {
  const langBtn = t("ui.toggle.lang");
  const langAria = t("ui.toggle.lang.aria");
  const themeBtn = getTheme() === "dark" ? t("ui.toggle.theme.light") : t("ui.toggle.theme");
  const themeAria = t("ui.toggle.theme.aria");
  return `
    <a href="#main" class="skip-link">${t("ui.skip")}</a>
    <header class="site-header" role="banner">
      <a class="brand-mark" href="#/">
        <span>GitMa</span><span class="zh">吉码</span>
      </a>
      <div class="controls">
        <button class="btn btn--ghost" onclick="window.__toggleTheme()" aria-label="${themeAria}" title="${themeAria}">${themeBtn}</button>
        <button class="btn btn--ghost" onclick="window.__toggleLang()" aria-label="${langAria}" title="${langAria}" lang="${getLang() === "en" ? "zh" : "en"}">${langBtn}</button>
      </div>
    </header>
  `;
}

export function renderFooter(): string {
  return `
    <footer class="site-footer" role="contentinfo">
      <p>${t("ftr.copy")} · ${progressPct()}% ${t("home.completed")}</p>
    </footer>
  `;
}
