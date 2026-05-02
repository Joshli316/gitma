import { progressPct, loadState } from "../state";
import { t } from "../i18n";

export function progressBar(): string {
  const pct = progressPct();
  const done = Object.values(loadState().modulesComplete).filter(Boolean).length;
  return `
    <div role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100"
         aria-label="${t("home.progress")}: ${pct}%"
         style="margin:.5rem 0 1.5rem">
      <div style="display:flex;justify-content:space-between;font-family:'Patrick Hand',cursive;font-size:1.1rem">
        <span>${t("home.progress")}</span>
        <span>${done} / 10 — ${pct}%</span>
      </div>
      <div style="height:14px;background:var(--paper-3);border:2px solid var(--rule);border-radius:99px;margin-top:.35rem;position:relative;overflow:hidden">
        <div style="height:100%;width:${pct}%;background:var(--mustard);border-right:${pct > 0 && pct < 100 ? '2px solid var(--rule)' : '0'};transition:width .3s"></div>
      </div>
    </div>
  `;
}
