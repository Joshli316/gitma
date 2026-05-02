import { getLang } from "../../i18n";

export function renderCloneFlow(): string {
  const lang = getLang();
  return `
    <figure role="figure" aria-label="clone flow" style="margin:1.5rem 0">
      <svg viewBox="0 0 720 240" width="100%" style="max-width:720px;display:block;margin:0 auto" aria-hidden="true">
        <g style="filter:url(#wobble)" stroke="var(--rule)" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <!-- cloud -->
          <path d="M120 100 q-30 -40 -70 -10 q-50 -20 -60 30 q-30 5 -25 40 q-10 35 30 40 l180 0 q40 -5 35 -40 q15 -25 -10 -45 q-25 -25 -80 -15z" transform="translate(0, -40)" fill="var(--paper-2)"/>
          <!-- arrow -->
          <path d="M260 110 L460 110" stroke="var(--coral)"/>
          <path d="M450 102 L463 110 L450 118" stroke="var(--coral)"/>
          <!-- folder -->
          <path d="M490 70 L580 70 L600 50 L700 50 L700 200 L490 200 Z" fill="var(--paper-2)"/>
        </g>
        <text x="125" y="120" text-anchor="middle" style="font-family:'Patrick Hand',cursive;font-size:20px;fill:var(--ink)">github.com/owner/repo</text>
        <text x="360" y="100" text-anchor="middle" style="font-family:'JetBrains Mono',monospace;font-size:14px;fill:var(--coral)">gh repo clone</text>
        <text x="595" y="135" text-anchor="middle" style="font-family:'Patrick Hand',cursive;font-size:18px;fill:var(--ink)">${lang === "zh" ? "本地副本" : "local copy"}</text>
        <text x="595" y="160" text-anchor="middle" style="font-family:'JetBrains Mono',monospace;font-size:13px;fill:var(--ink-soft)">~/repo/</text>
      </svg>
    </figure>
  `;
}
