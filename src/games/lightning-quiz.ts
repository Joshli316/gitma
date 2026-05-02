import { t, getLang } from "../i18n";
import { recordGameScore } from "../state";
import { escapeHtml, shuffle } from "../utils";
import games from "../content/games.json";

interface Q {
  id: string;
  prompt: { en: string; zh: string };
  options: { en: string[]; zh: string[] };
  answer: number;
  rationale: { en: string; zh: string };
}

export function renderLightningQuizUI(): string {
  return `
    <section id="lq" class="sketch-card lean-2" style="margin:2rem 0">
      <header style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:.5rem">
        <h2 style="margin:0">${t("quiz.start")}</h2>
        <span class="chip" id="lq-progress"></span>
      </header>
      <div id="lq-body" style="margin-top:1rem"></div>
    </section>
  `;
}

export function wireLightningQuiz(): void {
  const lang = getLang();
  const all = (games as any).lightningQuiz as Q[];
  const order = shuffle(all.slice());
  let i = 0;
  let correct = 0;

  const progress = document.getElementById("lq-progress")!;
  const body = document.getElementById("lq-body")!;

  function renderQ() {
    if (i >= order.length) return finish();
    const q = order[i];
    progress.textContent = t("quiz.q-of", { n: i + 1, total: order.length });
    body.innerHTML = `
      <p style="font-family:'Patrick Hand','LXGW WenKai',cursive;font-size:1.4rem;margin:.5rem 0 1rem">${escapeHtml(q.prompt[lang as "en"|"zh"])}</p>
      <div role="radiogroup" aria-label="quiz options" id="lq-options">
        ${q.options[lang as "en"|"zh"].map((opt, idx) => `
          <button class="quiz-option" data-idx="${idx}" role="radio" aria-checked="false">${escapeHtml(opt)}</button>
        `).join("")}
      </div>
      <div id="lq-feedback" style="margin-top:1rem;display:none"></div>
    `;
    body.querySelectorAll<HTMLButtonElement>(".quiz-option").forEach((btn) => {
      btn.addEventListener("click", () => answer(parseInt(btn.dataset.idx!, 10), q));
    });
  }

  function answer(idx: number, q: Q) {
    const opts = body.querySelectorAll<HTMLButtonElement>(".quiz-option");
    opts.forEach((btn, n) => {
      btn.disabled = true;
      if (n === q.answer) btn.dataset.state = "right";
      else if (n === idx) btn.dataset.state = "wrong";
    });
    if (idx === q.answer) correct++;
    const fb = document.getElementById("lq-feedback")!;
    fb.style.display = "block";
    fb.innerHTML = `
      <div class="sticky" style="display:block;max-width:none;transform:rotate(-.4deg)">
        <strong style="display:block;margin-bottom:.4rem">${idx === q.answer ? t("quiz.right") : t("quiz.wrong")}</strong>
        <span>${escapeHtml(q.rationale[lang as "en"|"zh"])}</span>
      </div>
      <button class="btn btn--primary" style="margin-top:1rem" id="lq-next">
        ${i + 1 === order.length ? t("quiz.finish") : t("quiz.next")}
      </button>
    `;
    document.getElementById("lq-next")!.addEventListener("click", () => { i++; renderQ(); });
  }

  function finish() {
    const total = order.length;
    recordGameScore("lightning-quiz", Math.round((correct / total) * 100));
    progress.textContent = "";
    body.innerHTML = `
      <div class="sketch-card lean-1" style="text-align:center">
        <h3 style="margin:.25rem 0 1rem">${t("quiz.your-score", { n: correct, total })}</h3>
        <p style="margin:0 0 1rem;color:var(--ink-soft)">${correct === total ? "🎯" : correct >= total - 1 ? "👏" : "📚"}</p>
        <button class="btn btn--primary" id="lq-replay">${t("quiz.replay")}</button>
      </div>
    `;
    document.getElementById("lq-replay")!.addEventListener("click", () => {
      i = 0; correct = 0; shuffle(order); renderQ();
    });
  }

  renderQ();
}
