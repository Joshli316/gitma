import { t, getLang } from "../i18n";

/** Module 8: a vague complaint → templated issue draft. */
export function renderIssueBuilder(): string {
  const lang = getLang();
  return `
    <section id="ib" class="sketch-card lean-3" style="margin:2rem 0">
      <h2 style="margin:0 0 .5rem">${lang === "zh" ? "把一句牢骚变成像样的 Issue" : "Vague complaint → polished Issue"}</h2>
      <p style="margin:.25rem 0 1rem;color:var(--ink-soft)">${lang === "zh" ? "填几行，模板会自动生成。复制后粘到 GitHub 即可。" : "Fill a few fields — the template assembles itself. Paste into GitHub when done."}</p>

      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,14rem),1fr));gap:.75rem">
        <label class="ib-row"><span>${lang === "zh" ? "一句话标题" : "Title (verb-first)"}</span><input id="ib-title" type="text" placeholder="${lang === "zh" ? "Fix dark-mode contrast on settings" : "Fix dark-mode contrast on settings"}"/></label>
        <label class="ib-row"><span>${lang === "zh" ? "重现步骤（每步一行）" : "Steps to reproduce"}</span><textarea id="ib-steps" rows="4" placeholder="1. Open settings\n2. Toggle dark mode"></textarea></label>
        <label class="ib-row"><span>${lang === "zh" ? "你以为会发生什么" : "Expected"}</span><input id="ib-exp" type="text" placeholder="${lang === "zh" ? "高对比度文字" : "High-contrast text"}"/></label>
        <label class="ib-row"><span>${lang === "zh" ? "实际发生了什么" : "Actual"}</span><input id="ib-act" type="text" placeholder="${lang === "zh" ? "灰字配深灰底，看不清" : "Gray on dark gray, unreadable"}"/></label>
        <label class="ib-row"><span>${lang === "zh" ? "环境（OS/浏览器/版本）" : "Environment"}</span><input id="ib-env" type="text" placeholder="macOS 15 · Safari 18"/></label>
      </div>

      <div class="terminal-header" style="margin-top:1rem">
        <div class="terminal-dot terminal-dot-r"></div><div class="terminal-dot terminal-dot-y"></div><div class="terminal-dot terminal-dot-g"></div>
        <span class="terminal-label">issue draft</span>
      </div>
      <pre class="terminal" id="ib-out" tabindex="0" style="white-space:pre-wrap"></pre>
      <button class="btn" id="ib-copy" style="margin-top:.6rem">${lang === "zh" ? "复制" : "Copy"}</button>
      <span id="ib-copied" style="margin-left:.6rem;color:var(--teal);opacity:0;transition:opacity .25s">${lang === "zh" ? "已复制" : "Copied"}</span>

      <style>
        #ib .ib-row{display:block;font-family:'Patrick Hand','LXGW WenKai',cursive;font-size:1.05rem}
        #ib input, #ib textarea{display:block;width:100%;padding:.5rem .75rem;border:2px solid var(--rule);border-radius:8px;background:var(--paper);color:var(--ink);font-family:'JetBrains Mono',monospace;margin-top:.25rem;font-size:.9rem}
        #ib textarea{font-family:'JetBrains Mono',monospace}
      </style>
    </section>
  `;
}

export function wireIssueBuilder(): void {
  const title = document.getElementById("ib-title") as HTMLInputElement | null;
  const steps = document.getElementById("ib-steps") as HTMLTextAreaElement | null;
  const exp   = document.getElementById("ib-exp") as HTMLInputElement | null;
  const act   = document.getElementById("ib-act") as HTMLInputElement | null;
  const env   = document.getElementById("ib-env") as HTMLInputElement | null;
  const out   = document.getElementById("ib-out");
  if (!title || !steps || !exp || !act || !env || !out) return;

  function build(): string {
    const stepsLines = (steps!.value || "").split("\n").filter((l) => l.trim()).map((l) => l.replace(/^\d+\.\s*/, "")).map((l, i) => `${i + 1}. ${l}`).join("\n");
    return [
      `## Steps to reproduce`,
      stepsLines || "(add steps)",
      ``,
      `## Expected`,
      exp!.value || "(what should happen)",
      ``,
      `## Actual`,
      act!.value || "(what actually happens)",
      ``,
      `## Environment`,
      env!.value || "(OS, browser, version)",
    ].join("\n");
  }

  function paint() {
    const body = build();
    const titleVal = title!.value || "(title)";
    out!.textContent = `# ${titleVal}\n\n${body}`;
  }

  [title, steps, exp, act, env].forEach((el) => el.addEventListener("input", paint));
  document.getElementById("ib-copy")!.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(out!.textContent || "");
      const flash = document.getElementById("ib-copied")!;
      flash.style.opacity = "1";
      setTimeout(() => (flash.style.opacity = "0"), 1500);
    } catch { /* no clipboard */ }
  });
  paint();
}
