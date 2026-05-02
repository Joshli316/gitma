import { loadModules } from "../content";
import { loadState } from "../state";
import { t } from "../i18n";
import { progressBar } from "../components/progress-bar";
import { escapeHtml, leanFor } from "../utils";

export async function renderHome(): Promise<string> {
  const data = await loadModules();
  const state = loadState();

  const cards = data.modules.map((m, i) => {
    const done = !!state.modulesComplete[m.id];
    const lean = leanFor(i);
    return `
      <a href="#/m/${m.id}" class="sketch-card ${lean}" style="text-decoration:none;color:inherit;display:block;position:relative">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:.75rem;margin-bottom:.5rem">
          <span style="font-family:'Patrick Hand',cursive;font-size:1.4rem;color:var(--coral)">${t("home.module")} ${m.num}</span>
          <span class="checkmark ${done ? "checkmark--done" : ""}" aria-hidden="true">${done ? "✓" : ""}</span>
        </div>
        <h3 style="margin:0 0 .35rem">${escapeHtml(m.title)}</h3>
        <p style="margin:0;color:var(--ink-soft)">${escapeHtml(m.subtitle)}</p>
      </a>
    `;
  }).join("");

  return `
    <main id="main" class="shell">
      <section style="position:relative;margin:2rem 0 2.5rem">
        <h1 style="margin:.25rem 0 0">
          <span class="scribble-under">GitMa</span> 吉码
        </h1>
        <p style="font-family:'Patrick Hand','LXGW WenKai',cursive;font-size:1.5rem;color:var(--ink-soft);margin:.6rem 0 0">
          ${escapeHtml(t("home.hero.lead"))}
        </p>
        <p style="margin:.4rem 0 0;color:var(--ink-soft)">
          ${escapeHtml(t("home.hero.sub"))}
        </p>
        <div style="display:flex;flex-wrap:wrap;gap:.6rem;margin-top:1.5rem">
          <a class="btn btn--primary" href="#/m/m1">${t("home.cta.start")}</a>
          <a class="btn" href="#/lab">${t("home.cta.lab")}</a>
        </div>

        <!-- ASYMMETRIC BREAK on home: one sticky-note in the corner -->
        <aside class="sticky" style="position:absolute;right:-.75rem;top:1.25rem;transform:rotate(4deg);max-width:13rem;font-size:1.05rem">
          <span aria-hidden="true">↘</span> ${escapeHtml(t("home.sticky"))}
        </aside>
      </section>

      ${progressBar()}

      <section aria-labelledby="modules-heading" style="margin:2rem 0">
        <h2 id="modules-heading">${t("home.modules.title")}</h2>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,18rem),1fr));gap:1.25rem;margin-top:1.25rem">
          ${cards}
        </div>
      </section>

      <section aria-labelledby="about-heading" style="margin:3rem 0 2rem">
        <h2 id="about-heading">${t("home.about")}</h2>
        <div class="sketch-card lean-3" style="max-width:42rem">
          <p style="margin:0;font-size:1.05rem">${escapeHtml(t("home.about.body"))}</p>
        </div>
      </section>
    </main>
  `;
}
