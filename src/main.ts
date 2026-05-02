import { route, startRouter } from "./router";
import { initI18n, t, toggleLang } from "./i18n";
import { initTheme, toggleTheme } from "./theme";
import { renderHeader, renderFooter } from "./components/header";
import { clearContentCache } from "./content";
import { hydrateNbSlots, hydrateVideoLoaders } from "./components/notebooklm-slots";

const app = document.getElementById("app")!;

function shell(content: string): string {
  return `${renderHeader()}${content}${renderFooter()}`;
}

function render(content: string): void {
  app.innerHTML = shell(content);
}

function showLoading(): void {
  app.innerHTML = shell(`
    <main class="shell" style="padding-top:6rem;text-align:center" role="status" aria-live="polite">
      <div style="font-family:'Patrick Hand','LXGW WenKai',cursive;font-size:1.4rem;color:var(--ink-soft)">
        ${t("home.hero.title")} · …
      </div>
    </main>
  `);
}

function showError(msg: string): void {
  app.innerHTML = shell(`
    <main class="shell" style="padding-top:3rem" role="alert">
      <h1>${t("err.404.title")}</h1>
      <p>${msg}</p>
      <a class="btn btn--primary" href="#/">${t("mod.back-home")}</a>
    </main>
  `);
}

// expose toggles for inline onclick (so header can be string-rendered)
(window as any).__toggleLang = () => {
  toggleLang();
  clearContentCache();
  // re-render current route
  window.dispatchEvent(new HashChangeEvent("hashchange"));
};
(window as any).__toggleTheme = () => {
  toggleTheme();
  window.dispatchEvent(new HashChangeEvent("hashchange"));
};

// init once
initI18n();
initTheme();

// routes
route("/", async () => {
  showLoading();
  try {
    const { renderHome } = await import("./screens/home");
    render(await renderHome());
    await hydrateNbSlots(app);
    await hydrateVideoLoaders(app);
  } catch (e) {
    console.error(e);
    showError(t("err.load"));
  }
});

route("/lab", async () => {
  showLoading();
  try {
    const { renderLab, wireLab } = await import("./screens/lab");
    render(`
      <main id="main" class="shell">
        <a href="#/" class="btn btn--ghost" style="margin:1.5rem 0 .5rem">${t("mod.back-home")}</a>
        <header style="margin:.5rem 0 1.5rem;position:relative">
          <span class="chip chip--mustard">${t("lab.title")}</span>
          <h1 style="margin:.5rem 0 .25rem"><span class="scribble-under">${t("lab.title")}</span></h1>
          <p style="font-family:'Patrick Hand','LXGW WenKai',cursive;font-size:1.3rem;color:var(--ink-soft);margin:.4rem 0 0">${t("lab.lead")}</p>
        </header>
        ${renderLab()}
      </main>
    `);
    await wireLab();
  } catch (e) {
    console.error(e);
    showError(t("err.load"));
  }
});

route("/m/:id", async (params) => {
  showLoading();
  try {
    const { renderModule } = await import("./screens/module");
    const { html, wire } = await renderModule(params.id);
    render(html);
    if (typeof wire === "function") await wire();
    await hydrateNbSlots(app);
    await hydrateVideoLoaders(app);
  } catch (e) {
    console.error(e);
    showError(t("err.load"));
  }
});

startRouter();
