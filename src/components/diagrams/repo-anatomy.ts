import { getLang } from "../../i18n";

interface Spot {
  id: string;
  x: number; y: number; w: number; h: number;
  title: { en: string; zh: string };
  body: { en: string; zh: string };
}

const SPOTS: Spot[] = [
  { id: "readme", x: 60, y: 70, w: 230, h: 38,
    title: { en: "README.md", zh: "README.md" },
    body:  { en: "The front-door file. First thing people read on github.com.", zh: "门面文件，github.com 上第一眼看到的内容。" } },
  { id: "license", x: 60, y: 118, w: 230, h: 38,
    title: { en: "LICENSE", zh: "LICENSE" },
    body:  { en: "Tells others what they're allowed to do with your code.", zh: "告诉别人能怎么用你的代码。" } },
  { id: "gitignore", x: 60, y: 166, w: 230, h: 38,
    title: { en: ".gitignore", zh: ".gitignore" },
    body:  { en: "Files git should pretend don't exist (node_modules, .env).", zh: "让 git 假装不存在的文件（node_modules、.env）。" } },
  { id: "src", x: 60, y: 214, w: 230, h: 38,
    title: { en: "src/  package.json  dist/  …", zh: "src/  package.json  dist/  …" },
    body:  { en: "Your actual code. Anything goes.", zh: "你真正的代码。怎么放都行。" } },
  { id: "git", x: 60, y: 262, w: 230, h: 38,
    title: { en: ".git/  (the time machine)", zh: ".git/（时间机器）" },
    body:  { en: "Hidden folder where every snapshot is stored. Don't touch.", zh: "隐藏文件夹，每个快照都存在这里。别动。" } },
];

export function renderRepoAnatomy(): string {
  const lang = getLang();
  return `
    <figure role="figure" aria-label="repo anatomy" style="margin:1.5rem 0">
      <div style="display:grid;grid-template-columns:minmax(0,1fr);md:grid-template-columns:380px 1fr;gap:1.5rem;align-items:start">
        <svg viewBox="0 0 350 360" width="100%" style="max-width:380px;display:block;background:transparent" id="repo-anatomy-svg" aria-label="repo cross-section">
          <g style="filter:url(#wobble)" stroke="var(--rule)" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <!-- folder shape -->
            <path d="M20 50 L120 50 L140 28 L320 28 L320 320 L20 320 Z" fill="var(--paper-2)"/>
            <line x1="20" y1="60" x2="320" y2="60" stroke="var(--rule)" stroke-width="1.5" stroke-dasharray="4,4"/>
          </g>
          ${SPOTS.map((s) => `
            <g class="hotspot" data-spot="${s.id}" tabindex="0" role="button"
               aria-label="${s.title[lang as "en"|"zh"]}">
              <rect x="${s.x}" y="${s.y}" width="${s.w}" height="${s.h}" rx="6"
                fill="var(--paper)" stroke="var(--rule)" stroke-width="2" style="filter:url(#wobble)"/>
              <text x="${s.x + 14}" y="${s.y + 25}" style="font-family:'JetBrains Mono',monospace;fill:var(--ink);font-size:14px">${s.title[lang as "en"|"zh"]}</text>
            </g>
          `).join("")}
        </svg>

        <div id="repo-anatomy-info" style="min-height:8rem">
          ${SPOTS.map((s, i) => `
            <div class="sketch-card lean-${(i % 4) + 1}" data-spot-info="${s.id}" style="display:${i === 0 ? "block" : "none"};margin-bottom:.5rem">
              <strong style="color:var(--coral);font-family:'Patrick Hand',cursive;font-size:1.3rem">${s.title[lang as "en"|"zh"]}</strong>
              <p style="margin:.4rem 0 0">${s.body[lang as "en"|"zh"]}</p>
            </div>
          `).join("")}
        </div>
      </div>
      <figcaption style="text-align:center;color:var(--ink-soft);font-family:'Patrick Hand','LXGW WenKai',cursive;font-size:1.1rem;margin-top:1rem">
        ${lang === "zh" ? "悬停（或点击）每一块看说明。" : "Hover (or tap) each block to read what it does."}
      </figcaption>
    </figure>
  `;
}

export function wireRepoAnatomy(): void {
  const svg = document.getElementById("repo-anatomy-svg");
  const info = document.getElementById("repo-anatomy-info");
  if (!svg || !info) return;

  const show = (id: string) => {
    info.querySelectorAll<HTMLElement>("[data-spot-info]").forEach((el) => {
      el.style.display = el.dataset.spotInfo === id ? "block" : "none";
    });
    svg.querySelectorAll<SVGGElement>(".hotspot").forEach((g) => {
      g.dataset.active = g.getAttribute("data-spot") === id ? "true" : "false";
    });
  };

  svg.addEventListener("mouseover", (e) => {
    const g = (e.target as HTMLElement).closest("[data-spot]") as HTMLElement | null;
    if (g) show(g.dataset.spot!);
  });
  svg.addEventListener("focusin", (e) => {
    const g = (e.target as HTMLElement).closest("[data-spot]") as HTMLElement | null;
    if (g) show(g.dataset.spot!);
  });
  svg.addEventListener("click", (e) => {
    const g = (e.target as HTMLElement).closest("[data-spot]") as HTMLElement | null;
    if (g) show(g.dataset.spot!);
  });
}
