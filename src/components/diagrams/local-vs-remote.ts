import { t } from "../../i18n";

/**
 * Local vs Remote — laptop ↔ cloud, with `git push` and `git pull` arrows between them.
 * Wobble filter applied for sketch feel; labels in plain text overlay so they're translatable.
 */
export function renderLocalVsRemote(): string {
  return `
    <figure role="figure" aria-label="${t("game.lvr.title")}" style="margin:1.5rem 0">
      <svg viewBox="0 0 760 320" width="100%" style="max-width:760px;display:block;margin:0 auto;background:transparent" aria-hidden="true">
        <g style="filter:url(#wobble)" stroke="var(--rule)" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <!-- laptop -->
          <rect x="40" y="80" width="240" height="150" rx="14" fill="var(--paper-2)"/>
          <rect x="55" y="92" width="210" height="115" rx="6" fill="var(--paper)"/>
          <rect x="20" y="225" width="280" height="20" rx="6" fill="var(--paper-3)"/>

          <!-- cloud -->
          <path d="M520 110 q-30 -40 -70 -10 q-50 -20 -60 30 q-30 5 -25 40 q-10 35 30 40 l180 0 q40 -5 35 -40 q15 -25 -10 -45 q-25 -25 -80 -15z" fill="var(--paper-2)"/>

          <!-- arrow: push (right) -->
          <path d="M295 130 L460 130" stroke="var(--coral)"/>
          <path d="M450 122 L462 130 L450 138" stroke="var(--coral)"/>

          <!-- arrow: pull (left) -->
          <path d="M460 175 L295 175" stroke="var(--teal)"/>
          <path d="M305 167 L293 175 L305 183" stroke="var(--teal)"/>
        </g>

        <!-- text labels (not inside the wobble group, so they read clean) -->
        <text x="160" y="270" text-anchor="middle" style="font-family:'Patrick Hand','LXGW WenKai',cursive;fill:var(--ink);font-size:22px">${t("game.lvr.local")}</text>
        <text x="500" y="270" text-anchor="middle" style="font-family:'Patrick Hand','LXGW WenKai',cursive;fill:var(--ink);font-size:22px">${t("game.lvr.remote")}</text>
        <text x="375" y="120" text-anchor="middle" style="font-family:'JetBrains Mono',monospace;fill:var(--coral);font-size:16px">git push →</text>
        <text x="375" y="200" text-anchor="middle" style="font-family:'JetBrains Mono',monospace;fill:var(--teal);font-size:16px">← git pull</text>
        <text x="160" y="160" text-anchor="middle" style="font-family:'Patrick Hand',cursive;fill:var(--ink-soft);font-size:18px">~/Desktop/Projects/</text>
        <text x="500" y="160" text-anchor="middle" style="font-family:'Patrick Hand',cursive;fill:var(--ink-soft);font-size:18px">github.com/you</text>
      </svg>
      <figcaption style="text-align:center;color:var(--ink-soft);font-family:'Patrick Hand','LXGW WenKai',cursive;font-size:1.1rem">push = up, pull = down — that's the whole loop.</figcaption>
    </figure>
  `;
}
