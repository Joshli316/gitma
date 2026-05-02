import { t, getLang } from "../i18n";
import { recordGameScore } from "../state";
import { escapeHtml, shuffle } from "../utils";
import games from "../content/games.json";

interface RD {
  id: string;
  name: string;
  language: string;
  stars: string;
  clue: { en: string; zh: string };
  url: string;
  reveal: { en: string; zh: string };
}

export function renderRepoDetectiveUI(): string {
  return `
    <section id="rd" class="sketch-card lean-3" style="margin:2rem 0">
      <header>
        <h2 style="margin:0">${t("game.repo-detective.title")}</h2>
        <p style="margin:.4rem 0 0;color:var(--ink-soft)">${t("game.repo-detective.lead")}</p>
      </header>
      <div id="rd-body" style="margin-top:1.25rem"></div>
    </section>
  `;
}

export function wireRepoDetective(): void {
  const lang = getLang();
  const cards = shuffle(((games as any).repoDetective as RD[]).slice());
  let i = 0;

  const body = document.getElementById("rd-body")!;

  function renderCard() {
    if (i >= cards.length) {
      recordGameScore("repo-detective", 100);
      body.innerHTML = `<p style="font-family:'Patrick Hand','LXGW WenKai',cursive;font-size:1.4rem">${lang === "zh" ? "全部破案了。再来一轮？" : "All cases closed. Run it again?"}</p>
      <button class="btn btn--primary" id="rd-restart">${lang === "zh" ? "再来一轮" : "Run again"}</button>`;
      document.getElementById("rd-restart")!.addEventListener("click", () => { i = 0; shuffle(cards); renderCard(); });
      return;
    }
    const c = cards[i];
    body.innerHTML = `
      <div class="terminal-header">
        <div class="terminal-dot terminal-dot-r"></div><div class="terminal-dot terminal-dot-y"></div><div class="terminal-dot terminal-dot-g"></div>
        <span class="terminal-label">case ${i + 1} / ${cards.length}</span>
      </div>
      <pre class="terminal" style="white-space:pre-wrap" tabindex="0"><span class="prompt">$ </span>gh repo view <span class="str">"???/???"</span>
  <span class="comment"># clue:</span> ${escapeHtml(c.clue[lang as "en"|"zh"])}
  <span class="comment"># language:</span> ${escapeHtml(c.language)}    <span class="comment">stars:</span> ${escapeHtml(c.stars)}</pre>
      <div style="display:flex;gap:.6rem;flex-wrap:wrap;margin-top:1rem">
        <button class="btn btn--primary" id="rd-reveal">${t("game.repo-detective.guess")}</button>
      </div>
      <div id="rd-answer" style="margin-top:1rem;display:none"></div>
    `;
    document.getElementById("rd-reveal")!.addEventListener("click", () => {
      const ans = document.getElementById("rd-answer")!;
      ans.style.display = "block";
      ans.innerHTML = `
        <div class="sketch-card lean-1" style="background:var(--paper)">
          <h3 style="margin:0 0 .5rem">${escapeHtml(c.name)}</h3>
          <p style="margin:0 0 .75rem">${escapeHtml(c.reveal[lang as "en"|"zh"])}</p>
          <div style="display:flex;gap:.5rem;flex-wrap:wrap">
            <a class="btn" href="${c.url}" target="_blank" rel="noopener noreferrer">${t("game.repo-detective.open")} ↗</a>
            <button class="btn btn--accent" id="rd-next">${t("game.repo-detective.next")}</button>
          </div>
        </div>
      `;
      document.getElementById("rd-next")!.addEventListener("click", () => { i++; renderCard(); });
    });
  }

  renderCard();
}
