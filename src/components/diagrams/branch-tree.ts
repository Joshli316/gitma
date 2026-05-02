import { getLang } from "../../i18n";

export function renderBranchTree(): string {
  const lang = getLang();
  return `
    <figure role="figure" aria-label="branch tree" style="margin:1.5rem 0">
      <svg viewBox="0 0 720 280" width="100%" style="max-width:720px;display:block;margin:0 auto" aria-hidden="true">
        <g style="filter:url(#wobble)" stroke="var(--rule)" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <!-- main line -->
          <line x1="40" y1="140" x2="700" y2="140" stroke="var(--ink)" stroke-width="3"/>
          <!-- main commits -->
          <circle cx="80"  cy="140" r="14" fill="var(--paper-2)"/>
          <circle cx="200" cy="140" r="14" fill="var(--paper-2)"/>
          <circle cx="500" cy="140" r="14" fill="var(--mustard)"/>
          <circle cx="640" cy="140" r="14" fill="var(--mustard)"/>

          <!-- feature branch -->
          <path d="M200 140 Q 250 80 320 80 L 470 80 Q 500 80 500 140" stroke="var(--coral)"/>
          <circle cx="320" cy="80" r="12" fill="var(--coral)" stroke="var(--rule)"/>
          <circle cx="400" cy="80" r="12" fill="var(--coral)" stroke="var(--rule)"/>
          <circle cx="470" cy="80" r="12" fill="var(--coral)" stroke="var(--rule)"/>

          <!-- bugfix branch (small) -->
          <path d="M500 140 Q 540 200 600 200" stroke="var(--teal)"/>
          <circle cx="600" cy="200" r="11" fill="var(--teal)" stroke="var(--rule)"/>
        </g>

        <!-- labels -->
        <text x="40" y="170" style="font-family:'Patrick Hand',cursive;font-size:18px;fill:var(--ink)">main</text>
        <text x="320" y="60" style="font-family:'Patrick Hand',cursive;font-size:16px;fill:var(--coral)">feature/login</text>
        <text x="495" y="125" text-anchor="middle" style="font-family:'Patrick Hand',cursive;font-size:14px;fill:var(--ink)">${lang === "zh" ? "合并" : "merge"}</text>
        <text x="600" y="225" text-anchor="middle" style="font-family:'Patrick Hand',cursive;font-size:15px;fill:var(--teal)">fix/typo</text>
      </svg>
      <figcaption style="text-align:center;color:var(--ink-soft);font-family:'Patrick Hand','LXGW WenKai',cursive;font-size:1.1rem">${lang === "zh" ? "main 一直在跑，分支去做实验，做完合并回来。" : "main keeps running. Branches experiment. Done → merge back."}</figcaption>
    </figure>
  `;
}
