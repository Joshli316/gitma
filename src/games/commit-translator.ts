import { t, getLang } from "../i18n";
import { recordGameScore } from "../state";
import { escapeHtml, shuffle } from "../utils";
import { scoreCommit } from "./commit-score";
import games from "../content/games.json";

interface CT {
  id: string;
  intent: { en: string; zh: string };
  good: string[];
  hint: { en: string; zh: string };
}

export function renderCommitTranslatorUI(): string {
  return `
    <section id="ct" class="sketch-card lean-1" style="margin:2rem 0">
      <header>
        <h2 style="margin:0">${t("game.commit.title")}</h2>
        <p style="margin:.4rem 0 0;color:var(--ink-soft)">${t("game.commit.lead")}</p>
      </header>
      <div id="ct-body" style="margin-top:1.25rem"></div>
    </section>
  `;
}

export function wireCommitTranslator(): void {
  const lang = getLang();
  const tasks = shuffle(((games as any).commitTranslator as CT[]).slice());
  let i = 0;
  let totalScore = 0;

  const body = document.getElementById("ct-body")!;

  function paint() {
    if (i >= tasks.length) {
      recordGameScore("commit-translator", Math.round(totalScore / tasks.length));
      body.innerHTML = `
        <div style="text-align:center">
          <h3 style="margin:.5rem 0 1rem">${lang === "zh" ? "通关！平均得分" : "All done — average score"}: ${Math.round(totalScore / tasks.length)} / 100</h3>
          <button class="btn btn--primary" id="ct-restart">${lang === "zh" ? "再来一轮" : "Play again"}</button>
        </div>
      `;
      document.getElementById("ct-restart")!.addEventListener("click", () => { i = 0; totalScore = 0; shuffle(tasks); paint(); });
      return;
    }
    const c = tasks[i];
    body.innerHTML = `
      <div class="sticky" style="display:block;max-width:none;transform:rotate(-.7deg);margin-bottom:1rem">
        <strong style="display:block;margin-bottom:.35rem">${lang === "zh" ? "改动说明" : "What you did"}</strong>
        ${escapeHtml(c.intent[lang as "en"|"zh"])}
      </div>
      <label for="ct-input" style="font-family:'Patrick Hand','LXGW WenKai',cursive;font-size:1.1rem;display:block;margin-bottom:.35rem">${t("game.commit.input.label")}</label>
      <div class="terminal-header">
        <div class="terminal-dot terminal-dot-r"></div><div class="terminal-dot terminal-dot-y"></div><div class="terminal-dot terminal-dot-g"></div>
        <span class="terminal-label">git commit</span>
      </div>
      <div class="terminal" style="display:flex;align-items:center;gap:.5rem">
        <span class="prompt">$ git commit -m "</span>
        <input id="ct-input" type="text" maxlength="120"
          style="flex:1;background:transparent;color:var(--terminal-fg);border:0;outline:0;font-family:inherit;font-size:inherit;min-width:0" />
        <span class="prompt">"</span>
      </div>

      <div style="display:flex;gap:.6rem;margin-top:1rem;flex-wrap:wrap">
        <button class="btn btn--primary" id="ct-score">${t("game.commit.score")}</button>
        <span style="align-self:center;color:var(--ink-soft);font-family:'Patrick Hand',cursive">${i + 1} / ${tasks.length}</span>
      </div>

      <div id="ct-feedback" style="margin-top:1rem;display:none"></div>
    `;
    const input = document.getElementById("ct-input") as HTMLInputElement;
    input.focus();
    document.getElementById("ct-score")!.addEventListener("click", () => score(c, input.value));
  }

  function score(c: CT, msg: string) {
    const { score: pts, issues: keys } = scoreCommit({ message: msg, intent: c.intent.en });
    const issues = keys.map((k) => t(k));
    totalScore += pts;

    const fb = document.getElementById("ct-feedback")!;
    fb.style.display = "block";
    fb.innerHTML = `
      <div class="sketch-card lean-2">
        <h3 style="margin:.25rem 0 .5rem">${pts >= 80 ? "🎯" : pts >= 60 ? "👍" : "🛠"} ${pts} / 100</h3>
        ${issues.length ? `<ul class="prose">${issues.map((s) => `<li>${escapeHtml(s)}</li>`).join("")}</ul>` : `<p style="margin:0">${lang === "zh" ? "好信息！" : "Solid commit message."}</p>`}
        <details style="margin-top:.5rem"><summary style="cursor:pointer;color:var(--coral)">${lang === "zh" ? "看示例" : "See examples"}</summary>
          <pre class="terminal" style="margin-top:.5rem;white-space:pre-wrap">${c.good.map((g) => `<span class="prompt">$ </span>git commit -m "${escapeHtml(g)}"`).join("\n")}</pre>
        </details>
        <button class="btn btn--primary" style="margin-top:.75rem" id="ct-next">${t("game.commit.next")}</button>
      </div>
    `;
    document.getElementById("ct-next")!.addEventListener("click", () => { i++; paint(); });
  }

  paint();
}
