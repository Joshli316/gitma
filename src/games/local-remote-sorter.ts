import { t, getLang } from "../i18n";
import { recordGameScore } from "../state";
import { escapeHtml, shuffle } from "../utils";
import { createDnd, type DnDController } from "../lib/dnd";
import games from "../content/games.json";

interface Action {
  id: string;
  label: { en: string; zh: string };
  bin: "local" | "remote" | "both";
}

let dnd: DnDController | null = null;

export function renderLocalRemoteSorterUI(): string {
  return `
    <section id="lvr" class="sketch-card lean-2" style="margin:2rem 0">
      <header>
        <h2 style="margin:0">${t("game.lvr.title")}</h2>
        <p style="margin:.4rem 0 0;color:var(--ink-soft)">${t("game.lvr.lead")}</p>
      </header>
      <div id="lvr-body" style="margin-top:1.25rem"></div>
    </section>
  `;
}

export function wireLocalRemoteSorter(): void {
  const lang = getLang();
  const actions = shuffle(((games as any).localVsRemote as Action[]).slice());
  const body = document.getElementById("lvr-body")!;

  function paint() {
    body.innerHTML = `
      <div id="lvr-pool" style="border:2px dashed var(--rule);background:var(--paper-3);padding:.75rem;border-radius:14px 18px 12px 16px / 16px 12px 18px 14px;margin-bottom:1rem">
        ${actions.map((a) => `<span class="dnd-chip" data-chip-id="${a.id}">${escapeHtml(a.label[lang as "en"|"zh"])}</span>`).join("")}
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,14rem),1fr));gap:.75rem">
        <div class="dnd-bin" data-bin-id="local"><strong style="display:block;margin-bottom:.5rem;font-family:'Patrick Hand','LXGW WenKai',cursive;font-size:1.2rem;color:var(--coral)">${t("game.lvr.local")}</strong></div>
        <div class="dnd-bin" data-bin-id="both"><strong style="display:block;margin-bottom:.5rem;font-family:'Patrick Hand','LXGW WenKai',cursive;font-size:1.2rem;color:var(--mustard)">${t("game.lvr.both")}</strong></div>
        <div class="dnd-bin" data-bin-id="remote"><strong style="display:block;margin-bottom:.5rem;font-family:'Patrick Hand','LXGW WenKai',cursive;font-size:1.2rem;color:var(--teal)">${t("game.lvr.remote")}</strong></div>
      </div>
      <div style="display:flex;gap:.6rem;margin-top:1rem;flex-wrap:wrap">
        <button class="btn btn--primary" id="lvr-check">${t("game.lvr.check")}</button>
        <button class="btn" id="lvr-reset">${t("game.lvr.reset")}</button>
        <span id="lvr-score" style="align-self:center"></span>
      </div>
    `;
    if (dnd) dnd.detach();
    dnd = createDnd(body);
    dnd.attach();

    document.getElementById("lvr-check")!.addEventListener("click", check);
    document.getElementById("lvr-reset")!.addEventListener("click", () => paint());
  }

  function check() {
    let correct = 0;
    let placed = 0;
    body.querySelectorAll<HTMLElement>(".dnd-chip[data-placed='true']").forEach((chip) => {
      placed++;
      const bin = chip.closest<HTMLElement>(".dnd-bin")!;
      const action = (((games as any).localVsRemote as Action[])).find((a) => a.id === chip.dataset.chipId);
      if (action && bin.dataset.binId === action.bin) {
        chip.style.outline = "2px solid var(--teal)";
        correct++;
      } else if (action) {
        chip.style.outline = "2px solid var(--coral)";
      }
    });
    const total = actions.length;
    document.getElementById("lvr-score")!.textContent = `${correct} / ${total}`;
    recordGameScore("local-vs-remote", Math.round((correct / total) * 100));
  }

  paint();
}
