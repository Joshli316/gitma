import { t, getLang } from "../i18n";
import { recordGameScore } from "../state";
import { escapeHtml, shuffle } from "../utils";
import { createDnd, type DnDController } from "../lib/dnd";
import games from "../content/games.json";

interface Label { id: string; label: { en: string; zh: string } }
interface Block { id: string; match: string; preview: string; previewZh?: string }

let dnd: DnDController | null = null;

export function renderSpotReadmeUI(): string {
  return `
    <section id="sr" class="sketch-card lean-4" style="margin:2rem 0">
      <header>
        <h2 style="margin:0">${t("game.spot-readme.title")}</h2>
        <p style="margin:.4rem 0 0;color:var(--ink-soft)">${t("game.spot-readme.lead")}</p>
      </header>
      <div id="sr-body" style="margin-top:1.25rem"></div>
    </section>
  `;
}

export function wireSpotReadme(): void {
  const lang = getLang();
  const labels = shuffle(((games as any).spotReadme.labels as Label[]).slice());
  const blocks = ((games as any).spotReadme.blocks as Block[]).slice();

  const body = document.getElementById("sr-body")!;

  function paint() {
    body.innerHTML = `
      <div id="sr-pool" style="background:var(--paper-3);border-radius:14px 18px 12px 16px / 16px 12px 18px 14px;padding:.75rem;border:2px dashed var(--rule);margin-bottom:1rem">
        ${labels.map((l) => `
          <span class="dnd-chip" data-chip-id="${l.id}">${escapeHtml(l.label[lang as "en"|"zh"])}</span>
        `).join("")}
      </div>

      <div style="display:grid;gap:.75rem">
        ${blocks.map((b) => `
          <div style="display:grid;grid-template-columns:minmax(7rem, 11rem) 1fr;gap:.6rem;align-items:start">
            <div class="dnd-bin" data-bin-id="${b.id}" aria-label="bin ${b.id}" style="min-height:4rem"></div>
            <pre class="terminal" style="white-space:pre-wrap;font-size:.82rem;margin:0">${escapeHtml(lang === "zh" && b.previewZh ? b.previewZh : b.preview)}</pre>
          </div>
        `).join("")}
      </div>

      <div style="display:flex;gap:.6rem;margin-top:1rem;flex-wrap:wrap">
        <button class="btn btn--primary" id="sr-check">${t("game.spot-readme.check")}</button>
        <button class="btn" id="sr-reset">${t("game.spot-readme.reset")}</button>
        <span id="sr-score" style="align-self:center"></span>
      </div>
    `;
    if (dnd) dnd.detach();
    dnd = createDnd(body);
    dnd.attach();

    document.getElementById("sr-check")!.addEventListener("click", check);
    document.getElementById("sr-reset")!.addEventListener("click", () => { paint(); });
  }

  function check() {
    let correct = 0;
    body.querySelectorAll<HTMLElement>(".dnd-bin").forEach((bin) => {
      const want = bin.dataset.binId!;
      const chip = bin.querySelector<HTMLElement>(".dnd-chip");
      if (chip && chip.dataset.chipId === want) {
        bin.dataset.correct = "true"; correct++;
      } else if (chip) {
        bin.dataset.wrong = "true";
      }
    });
    const total = ((games as any).spotReadme.blocks as Block[]).length;
    document.getElementById("sr-score")!.textContent = t("game.spot-readme.score", { n: correct, total });
    recordGameScore("spot-readme", Math.round((correct / total) * 100));
  }

  paint();
}
