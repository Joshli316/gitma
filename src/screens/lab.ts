import { t, getLang } from "../i18n";
import { loadState, setFlashcardMastery } from "../state";
import { escapeHtml, shuffle } from "../utils";
import { renderPdfSlots, hydratePdfSlots } from "../components/notebooklm-slots";
import glossary from "../content/glossary.json";
import { TOP_REPOS, formatStars } from "../content/repos";

const GAMES = [
  { id: "lightning-quiz",   url: "#/m/m1",  key: "quiz.start" },
  { id: "repo-detective",   url: "#/m/m3",  key: "game.repo-detective.title" },
  { id: "spot-readme",      url: "#/m/m4",  key: "game.spot-readme.title" },
  { id: "commit-translator", url: "#/m/m6", key: "game.commit.title" },
  { id: "local-vs-remote",  url: "#/m/m7",  key: "game.lvr.title" },
];

export function renderLab(): string {
  const lang = getLang();
  const state = loadState();
  return `
    <section id="lab" style="margin:2rem 0">
      <h2 style="margin:.5rem 0">${t("lab.flashcards.title")}</h2>
      <div id="lab-flashcards" style="margin-bottom:2rem"></div>

      <h2 style="margin:1.5rem 0 .5rem">${t("lab.games.title")}</h2>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,14rem),1fr));gap:1rem;margin-bottom:2rem">
        ${GAMES.map((g, i) => {
          const sc = state.gameScores[g.id];
          const lean = `lean-${(i % 4) + 1}`;
          return `
            <a class="sketch-card ${lean}" href="${g.url}" style="text-decoration:none;color:inherit;display:block">
              <h3 style="margin:0 0 .35rem">${t(g.key)}</h3>
              <p style="margin:0;color:var(--ink-soft);font-size:.95rem">
                ${sc ? `${t("lab.best")}: ${sc.best} · ${sc.plays} ${t("lab.plays")}` : "—"}
              </p>
            </a>
          `;
        }).join("")}
      </div>

      <h2 style="margin:1.5rem 0 .75rem">${t("lab.pdfs.title")}</h2>
      <div>
        ${renderPdfSlots()}
      </div>

      <h2 style="margin:2rem 0 .25rem">${t("lab.repos.title")}</h2>
      <p style="margin:0 0 .9rem;color:var(--ink-soft);font-size:.95rem">${t("lab.repos.lead")}</p>
      <ol style="list-style:none;padding:0;margin:0;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,18rem),1fr));gap:1rem">
        ${TOP_REPOS.map((r, i) => {
          const lean = `lean-${(i % 4) + 1}`;
          const blurb = lang === "zh" ? r.blurbZh : r.blurbEn;
          return `
            <li>
              <a class="sketch-card ${lean}" href="${r.url}" target="_blank" rel="noopener noreferrer"
                 style="text-decoration:none;color:inherit;display:block;height:100%">
                <div style="display:flex;align-items:baseline;gap:.5rem;margin-bottom:.4rem">
                  <span class="chip chip--mustard" style="font-size:.85rem">#${i + 1}</span>
                  <span style="margin-left:auto;color:var(--ink-soft);font-family:'JetBrains Mono',monospace;font-size:.85rem">★ ${formatStars(r.stars)}</span>
                </div>
                <h3 style="margin:0 0 .35rem;font-family:'JetBrains Mono',monospace;font-size:1rem;word-break:break-word">
                  ${escapeHtml(r.owner)}/<span style="color:var(--coral)">${escapeHtml(r.name)}</span>
                </h3>
                <p style="margin:0;color:var(--ink-soft);font-size:.95rem;line-height:1.45">${escapeHtml(blurb)}</p>
              </a>
            </li>
          `;
        }).join("")}
      </ol>
    </section>
  `;
}

export async function wireLab(): Promise<void> {
  await hydratePdfSlots(document);
  wireFlashcards();
}

interface Card { id: string; term: string; termZh: string; def: string; defZh: string }

function wireFlashcards() {
  const lang = getLang();
  const root = document.getElementById("lab-flashcards");
  if (!root) return;

  const cards = shuffle((glossary as { cards: Card[] }).cards.slice());
  let i = 0;
  let flipped = false;

  function paint() {
    if (i >= cards.length) {
      root!.innerHTML = `
        <div class="sketch-card lean-1" style="text-align:center">
          <p style="margin:0 0 1rem;font-family:'Patrick Hand','LXGW WenKai',cursive;font-size:1.3rem">${t("lab.flashcards.empty")}</p>
          <button class="btn btn--primary" id="fc-restart">${t("lab.flashcards.shuffle")}</button>
        </div>
      `;
      document.getElementById("fc-restart")!.addEventListener("click", () => { i = 0; shuffle(cards); paint(); });
      return;
    }
    const c = cards[i];
    const term = lang === "zh" ? c.termZh : c.term;
    const def  = lang === "zh" ? c.defZh : c.def;
    const state = loadState().flashcardMastery[c.id] || "new";
    root!.innerHTML = `
      <div class="sketch-card lean-${(i % 4) + 1}" id="fc-card" style="cursor:pointer;min-height:10rem;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center">
        <div style="font-family:'Patrick Hand','LXGW WenKai',cursive;font-size:${flipped ? '1.3rem' : '2.4rem'};color:${flipped ? 'var(--ink-soft)' : 'var(--ink)'};max-width:36rem">
          ${escapeHtml(flipped ? def : term)}
        </div>
        <p style="margin:1rem 0 0;color:var(--ink-soft);font-size:.95rem">${flipped ? "" : t("lab.flashcards.flip")}</p>
      </div>
      <div style="display:flex;gap:.5rem;flex-wrap:wrap;margin-top:.75rem;justify-content:center">
        <button class="btn" data-mastery="new"      ${state === "new" ? "style='background:var(--paper-3)'" : ""}>${t("lab.flashcards.new")}</button>
        <button class="btn" data-mastery="learning" ${state === "learning" ? "style='background:var(--paper-3)'" : ""}>${t("lab.flashcards.learning")}</button>
        <button class="btn btn--accent" data-mastery="known" ${state === "known" ? "style='outline:2px solid var(--rule)'" : ""}>${t("lab.flashcards.known")}</button>
        <span style="flex:1"></span>
        <button class="btn" id="fc-prev" ${i === 0 ? "disabled" : ""}>${t("lab.flashcards.prev")}</button>
        <button class="btn btn--primary" id="fc-next">${t("lab.flashcards.next")}</button>
      </div>
      <p style="text-align:center;margin:.5rem 0 0;color:var(--ink-soft)">${i + 1} / ${cards.length}</p>
    `;
    document.getElementById("fc-card")!.addEventListener("click", () => { flipped = !flipped; paint(); });
    document.getElementById("fc-next")!.addEventListener("click", () => { i++; flipped = false; paint(); });
    document.getElementById("fc-prev")!.addEventListener("click", () => {
      if (i > 0) { i--; flipped = false; paint(); }
    });
    root!.querySelectorAll<HTMLButtonElement>("[data-mastery]").forEach((b) => {
      b.addEventListener("click", (e) => {
        e.stopPropagation();
        setFlashcardMastery(c.id, b.dataset.mastery as any);
        if (b.dataset.mastery === "known") { i++; flipped = false; }
        paint();
      });
    });
  }

  paint();
}
