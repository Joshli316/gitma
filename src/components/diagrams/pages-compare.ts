import { getLang } from "../../i18n";

export function renderPagesCompare(): string {
  const lang = getLang();
  const labels = {
    gh: "GitHub Pages",
    cf: "Cloudflare Pages",
    free: lang === "zh" ? "免费" : "free",
    bw:  lang === "zh" ? "100GB/月" : "100GB/mo",
    bwInf: lang === "zh" ? "无限带宽" : "unlimited",
    cdn: lang === "zh" ? "GitHub 边缘网络" : "GitHub edge",
    cdnFast: lang === "zh" ? "全球更快" : "fast global CDN",
    deploy: lang === "zh" ? "推送即部署" : "push to deploy",
    pr: lang === "zh" ? "每个 PR 都有预览" : "preview per PR",
    workers: lang === "zh" ? "原生 Workers" : "Workers integration",
    use1: lang === "zh" ? "内部工具 / 文档" : "internal / docs",
    use2: lang === "zh" ? "公开网站 / 流量大" : "public / high traffic",
  };
  return `
    <figure role="figure" aria-label="GitHub Pages vs Cloudflare Pages" style="margin:1.5rem 0">
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,18rem),1fr));gap:1.25rem">

        <!-- GH Pages card -->
        <div class="sketch-card lean-1" style="background:var(--paper-2)">
          <h3 style="margin:0 0 .5rem;color:var(--coral)">${labels.gh}</h3>
          <ul class="prose" style="margin:.25rem 0">
            <li>${labels.free}</li>
            <li>${labels.bw}</li>
            <li>${labels.cdn}</li>
            <li>${labels.deploy}</li>
          </ul>
          <p style="margin:.5rem 0 0;font-family:'Patrick Hand','LXGW WenKai',cursive;font-size:1.15rem;color:var(--ink-soft)">→ ${labels.use1}</p>
        </div>

        <!-- CF Pages card with mustard chip to distinguish -->
        <div class="sketch-card lean-2" style="background:var(--paper-2);position:relative">
          <span class="chip chip--mustard" style="position:absolute;top:-.6rem;right:.5rem;transform:rotate(2deg)">${lang === "zh" ? "推荐" : "recommended"}</span>
          <h3 style="margin:0 0 .5rem;color:var(--teal)">${labels.cf}</h3>
          <ul class="prose" style="margin:.25rem 0">
            <li>${labels.free}</li>
            <li>${labels.bwInf}</li>
            <li>${labels.cdnFast}</li>
            <li>${labels.deploy}</li>
            <li>${labels.pr}</li>
            <li>${labels.workers}</li>
          </ul>
          <p style="margin:.5rem 0 0;font-family:'Patrick Hand','LXGW WenKai',cursive;font-size:1.15rem;color:var(--ink-soft)">→ ${labels.use2}</p>
        </div>
      </div>
      <figcaption style="text-align:center;color:var(--ink-soft);font-family:'Patrick Hand','LXGW WenKai',cursive;font-size:1.1rem;margin-top:.75rem">
        ${lang === "zh" ? "都免费、都靠 push 部署。CF 的免费额度更宽。" : "Both free, both deploy on push. CF's free tier is more generous."}
      </figcaption>
    </figure>
  `;
}
