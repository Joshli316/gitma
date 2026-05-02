import { t, getLang } from "../i18n";

/** Module 5 command builder — pick parts, see the assembled `gh repo clone …` line. */
export function renderCommandBuilder(): string {
  const lang = getLang();
  return `
    <section id="cb" class="sketch-card lean-2" style="margin:2rem 0">
      <h2 style="margin:0 0 .5rem">${lang === "zh" ? "拼一行 clone 命令" : "Build a clone command"}</h2>
      <p style="margin:.25rem 0 1rem;color:var(--ink-soft)">${lang === "zh" ? "选 owner / repo / 分支，看完整命令拼出来。" : "Pick the owner, repo and branch — watch the command assemble."}</p>

      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,12rem),1fr));gap:.75rem;margin-bottom:1rem">
        <label style="display:block">
          <span style="font-family:'Patrick Hand',cursive">owner</span>
          <input id="cb-owner" type="text" value="anthropics" class="cb-input"/>
        </label>
        <label style="display:block">
          <span style="font-family:'Patrick Hand',cursive">repo</span>
          <input id="cb-repo" type="text" value="claude-code" class="cb-input"/>
        </label>
        <label style="display:block">
          <span style="font-family:'Patrick Hand',cursive">branch (${lang === "zh" ? "可选" : "optional"})</span>
          <input id="cb-branch" type="text" placeholder="main" class="cb-input"/>
        </label>
      </div>

      <div style="display:flex;flex-wrap:wrap;gap:.5rem;margin-bottom:1rem">
        <label class="chip"><input type="radio" name="cb-tool" value="gh" checked style="accent-color:var(--coral)"/> gh</label>
        <label class="chip"><input type="radio" name="cb-tool" value="git" style="accent-color:var(--coral)"/> git</label>
      </div>

      <div class="terminal-header">
        <div class="terminal-dot terminal-dot-r"></div><div class="terminal-dot terminal-dot-y"></div><div class="terminal-dot terminal-dot-g"></div>
        <span class="terminal-label">terminal</span>
      </div>
      <pre class="terminal" tabindex="0" id="cb-out" style="display:flex;align-items:center;justify-content:space-between;gap:1rem"></pre>
      <button class="btn" id="cb-copy" style="margin-top:.6rem">${lang === "zh" ? "复制" : "Copy"}</button>
      <span id="cb-copied" style="margin-left:.6rem;color:var(--teal);opacity:0;transition:opacity .25s">${lang === "zh" ? "已复制" : "Copied"}</span>

      <style>
        #cb input.cb-input{display:block;width:100%;padding:.5rem .75rem;border:2px solid var(--rule);border-radius:8px;background:var(--paper);color:var(--ink);font-family:'JetBrains Mono',monospace;margin-top:.25rem}
      </style>
    </section>
  `;
}

export function wireCommandBuilder(): void {
  const ownerEl  = document.getElementById("cb-owner") as HTMLInputElement | null;
  const repoEl   = document.getElementById("cb-repo") as HTMLInputElement | null;
  const branchEl = document.getElementById("cb-branch") as HTMLInputElement | null;
  const outEl    = document.getElementById("cb-out") as HTMLElement | null;
  if (!ownerEl || !repoEl || !branchEl || !outEl) return;

  const owner = ownerEl, repo = repoEl, branch = branchEl, out = outEl;

  function update() {
    const tool = (document.querySelector('input[name="cb-tool"]:checked') as HTMLInputElement).value;
    const o = (owner.value || "owner").replace(/[^A-Za-z0-9._-]/g, "");
    const r = (repo.value || "repo").replace(/[^A-Za-z0-9._-]/g, "");
    const b = (branch.value || "").replace(/[^A-Za-z0-9._/-]/g, "");
    let cmd = "";
    if (tool === "gh") {
      cmd = `gh repo clone ${o}/${r}${b ? ` -- --branch ${b}` : ""}`;
    } else {
      cmd = `git clone https://github.com/${o}/${r}.git${b ? ` --branch ${b}` : ""}`;
    }
    out.innerHTML = `<span><span class="prompt">$ </span>${cmd}</span>`;
    out.dataset.cmd = cmd;
  }

  [owner, repo, branch].forEach((el) => el.addEventListener("input", update));
  document.querySelectorAll<HTMLInputElement>('input[name="cb-tool"]').forEach((el) => el.addEventListener("change", update));
  document.getElementById("cb-copy")!.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(out.dataset.cmd || "");
      const flash = document.getElementById("cb-copied")!;
      flash.style.opacity = "1";
      setTimeout(() => (flash.style.opacity = "0"), 1500);
    } catch { /* no clipboard */ }
  });
  update();
}
