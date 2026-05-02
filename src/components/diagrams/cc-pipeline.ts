import { getLang } from "../../i18n";

export function renderCcPipeline(): string {
  const lang = getLang();
  const labels = {
    folder: lang === "zh" ? "项目文件夹" : "project folder",
    git: lang === "zh" ? "git 引擎" : "git engine",
    github: "github.com",
    gh: lang === "zh" ? "gh（命令行）" : "gh (CLI)",
    cc: "Claude Code",
    push: "git push",
    edit: lang === "zh" ? "edit + commit" : "edit + commit",
    talks: lang === "zh" ? "调用网站接口" : "talks to website",
  };
  return `
    <figure role="figure" aria-label="github × claude code pipeline" style="margin:1.5rem 0">
      <svg viewBox="0 0 880 360" width="100%" style="max-width:880px;display:block;margin:0 auto" aria-hidden="true">
        <g style="filter:url(#wobble)" stroke="var(--rule)" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <!-- claude code blob (top left) -->
          <ellipse cx="120" cy="80" rx="90" ry="40" fill="var(--mustard)" opacity="0.25"/>
          <!-- folder -->
          <path d="M40 200 L130 200 L150 180 L300 180 L300 320 L40 320 Z" fill="var(--paper-2)"/>
          <!-- git node -->
          <circle cx="430" cy="250" r="60" fill="var(--paper-3)"/>
          <!-- gh node -->
          <rect x="370" y="80" width="120" height="60" rx="10" fill="var(--paper-2)"/>
          <!-- github cloud -->
          <path d="M730 220 q-30 -40 -70 -10 q-50 -20 -60 30 q-30 5 -25 40 q-10 35 30 40 l180 0 q40 -5 35 -40 q15 -25 -10 -45 q-25 -25 -80 -15z" fill="var(--paper-2)"/>

          <!-- arrows -->
          <path d="M170 150 L170 195" stroke="var(--coral)"/>
          <path d="M163 188 L170 198 L177 188" stroke="var(--coral)"/>
          <path d="M310 250 L370 250" stroke="var(--coral)"/>
          <path d="M363 243 L373 250 L363 257" stroke="var(--coral)"/>
          <path d="M495 250 L600 250" stroke="var(--coral)"/>
          <path d="M593 243 L603 250 L593 257" stroke="var(--coral)"/>
          <path d="M430 145 Q 430 200 430 195" stroke="var(--teal)" stroke-dasharray="4,4"/>
          <path d="M495 110 Q 600 110 660 200" stroke="var(--teal)" stroke-dasharray="4,4"/>
          <path d="M650 195 L657 200 L657 188" stroke="var(--teal)"/>
        </g>

        <!-- labels -->
        <text x="120" y="86" text-anchor="middle" style="font-family:'Patrick Hand',cursive;font-size:24px;fill:var(--ink)">${labels.cc}</text>
        <text x="170" y="265" text-anchor="middle" style="font-family:'Patrick Hand',cursive;font-size:18px;fill:var(--ink)">${labels.folder}</text>
        <text x="170" y="290" text-anchor="middle" style="font-family:'JetBrains Mono',monospace;font-size:13px;fill:var(--ink-soft)">~/Desktop/Projects/</text>
        <text x="430" y="256" text-anchor="middle" style="font-family:'Patrick Hand',cursive;font-size:18px;fill:var(--ink)">${labels.git}</text>
        <text x="430" y="278" text-anchor="middle" style="font-family:'JetBrains Mono',monospace;font-size:13px;fill:var(--ink-soft)">.git/</text>
        <text x="430" y="115" text-anchor="middle" style="font-family:'Patrick Hand',cursive;font-size:18px;fill:var(--ink)">${labels.gh}</text>
        <text x="700" y="252" text-anchor="middle" style="font-family:'Patrick Hand',cursive;font-size:18px;fill:var(--ink)">${labels.github}</text>

        <!-- arrow labels -->
        <text x="190" y="178" style="font-family:'JetBrains Mono',monospace;font-size:13px;fill:var(--coral)">${labels.edit}</text>
        <text x="335" y="240" style="font-family:'JetBrains Mono',monospace;font-size:13px;fill:var(--coral)">git add</text>
        <text x="540" y="240" style="font-family:'JetBrains Mono',monospace;font-size:13px;fill:var(--coral)">${labels.push}</text>
        <text x="540" y="100" text-anchor="end" style="font-family:'Patrick Hand',cursive;font-size:14px;fill:var(--teal)">${labels.talks}</text>
      </svg>
      <figcaption style="text-align:center;color:var(--ink-soft);font-family:'Patrick Hand','LXGW WenKai',cursive;font-size:1.1rem">${lang === "zh" ? "三个工具，一件事——从 Claude Code 到 GitHub。" : "Three tools, one job — Claude Code → git → GitHub."}</figcaption>
    </figure>
  `;
}
