import { loadModules } from "../content";
import { t } from "../i18n";
import { loadState, markModuleComplete } from "../state";
import { escapeHtml, paragraphs, rich } from "../utils";
import { stickyNote } from "../components/sticky-note";
import { terminalBlock } from "../components/terminal-block";
import { renderNbSlot, renderPdfSlots } from "../components/notebooklm-slots";
import type { ModuleContent, ModuleSection } from "../types";

import { renderRepoAnatomy } from "../components/diagrams/repo-anatomy";
import { renderLocalVsRemote } from "../components/diagrams/local-vs-remote";
import { renderCcPipeline } from "../components/diagrams/cc-pipeline";
import { renderBranchTree } from "../components/diagrams/branch-tree";
import { renderCloneFlow } from "../components/diagrams/clone-flow";

import { renderLightningQuizUI, wireLightningQuiz } from "../games/lightning-quiz";
import { renderRepoDetectiveUI, wireRepoDetective } from "../games/repo-detective";
import { renderSpotReadmeUI, wireSpotReadme } from "../games/spot-readme";
import { renderCommitTranslatorUI, wireCommitTranslator } from "../games/commit-translator";
import { renderLocalRemoteSorterUI, wireLocalRemoteSorter } from "../games/local-remote-sorter";

import { renderCommandBuilder, wireCommandBuilder } from "../components/command-builder";
import { renderIssueBuilder, wireIssueBuilder } from "../components/issue-builder";
import { renderLab, wireLab } from "./lab";

export async function renderModule(id: string): Promise<{ html: string; wire: () => Promise<void> | void }> {
  const data = await loadModules();
  const idx = data.modules.findIndex((m) => m.id === id);
  if (idx < 0) {
    return { html: notFound(), wire: () => {} };
  }
  const m = data.modules[idx];
  const prev = data.modules[idx - 1];
  const next = data.modules[idx + 1];
  const done = !!loadState().modulesComplete[m.id];

  const nbBlock = m.notebooklm && m.notebooklm.length
    ? `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,18rem),1fr));gap:1rem;margin:1.5rem 0">
         ${m.notebooklm.map((s) => renderNbSlot(s)).join("")}
       </div>`
    : "";

  const sections = m.sections.map((s) => renderSection(s, m)).join("\n");

  const asym = renderAsymmetric(m);

  const html = `
    <main id="main" class="shell" style="position:relative">
      <a href="#/" class="btn btn--ghost" style="margin:1.5rem 0 .5rem">${t("mod.back-home")}</a>

      <header style="margin:.5rem 0 1.5rem;position:relative">
        <span class="chip chip--coral">${t("home.module")} ${m.num} / 10</span>
        <h1 style="margin:.5rem 0 0">
          <span class="scribble-under">${escapeHtml(m.title)}</span>
        </h1>
        <p style="font-family:'Patrick Hand','LXGW WenKai',cursive;font-size:1.4rem;color:var(--ink-soft);margin:.4rem 0 0">${escapeHtml(m.subtitle)}</p>
        ${asym}
      </header>

      ${nbBlock}

      <div class="prose" style="font-size:1.075rem;max-width:46rem">
        ${paragraphs(m.intro).map((p) => `<p>${rich(p)}</p>`).join("")}
      </div>

      <div style="margin:1.5rem 0">
        ${sections}
      </div>

      ${m.game ? renderGameInline(m.game) : ""}

      <div style="display:flex;flex-wrap:wrap;gap:.6rem;justify-content:space-between;align-items:center;margin:3rem 0 1rem;border-top:1.5px dashed var(--rule);padding-top:1.25rem">
        <div style="display:flex;gap:.5rem;flex-wrap:wrap">
          ${prev ? `<a class="btn btn--ghost" href="#/m/${prev.id}">${t("mod.prev")}</a>` : ""}
          ${next ? `<a class="btn btn--ghost" href="#/m/${next.id}">${t("mod.next")}</a>` : `<a class="btn btn--ghost" href="#/lab">${t("mod.next")}</a>`}
        </div>
        <button id="mark-complete" class="btn ${done ? "" : "btn--primary"}" data-done="${done}">
          ${done ? t("mod.completed") : t("mod.complete")}
        </button>
      </div>
    </main>
  `;

  return {
    html,
    wire: async () => {
      hookCompleteButton(m.id, next?.id);
      // diagrams hover-wiring
      if (m.id === "m2") wireRepoAnatomy();
      if (m.game === "lightning-quiz" || m.id === "m1") wireLightningQuiz();
      if (m.game === "repo-detective") wireRepoDetective();
      if (m.game === "spot-readme") wireSpotReadme();
      if (m.game === "commit-translator") wireCommitTranslator();
      if (m.game === "local-vs-remote") wireLocalRemoteSorter();
      if (m.id === "m5") wireCommandBuilder();
      if (m.id === "m8") wireIssueBuilder();
      if (m.id === "m10") await wireLab();
    },
  };
}

function renderSection(s: ModuleSection, m: ModuleContent): string {
  switch (s.type) {
    case "prose":
      return `<div class="prose" style="margin:1.25rem 0;max-width:46rem">${paragraphs(s.body || "").map((p) => `<p>${rich(p)}</p>`).join("")}</div>`;
    case "sticky":
      return `<div style="margin:1.5rem 0">${stickyNote({ title: s.title, body: s.body || "", lean: "auto" })}</div>`;
    case "callout":
      return `<div style="margin:1.5rem 0;display:flex;justify-content:${s.lean === "r" ? "flex-end" : "flex-start"}">${stickyNote({ title: s.title, body: s.body || "", lean: s.lean ?? "auto" })}</div>`;
    case "terminal":
      return terminalBlock(s.lines || [], "claude code");
    case "diagram":
      return renderDiagram(s.diagramId || "");
    case "embed":
      if (s.id === "lab") return renderLab();
      if (s.id === "issue-builder") return renderIssueBuilder();
      if (s.id === "command-builder") return renderCommandBuilder();
      return "";
    case "list":
      return `<ul class="prose" style="font-size:1.05rem">${(s.items || []).map((i) => `<li>${rich(i)}</li>`).join("")}</ul>`;
    case "scribble":
      return `<p class="scribble-under" style="font-family:'Patrick Hand',cursive;font-size:1.4rem">${rich(s.body || "")}</p>`;
    default:
      return "";
  }
}

function renderDiagram(id: string): string {
  switch (id) {
    case "repo-anatomy":   return renderRepoAnatomy();
    case "local-vs-remote": return renderLocalVsRemote();
    case "cc-pipeline":    return renderCcPipeline();
    case "branch-tree":    return renderBranchTree();
    case "clone-flow":     return renderCloneFlow();
    default: return `<div class="sketch-card lean-2"><p style="margin:0;color:var(--ink-soft)">[diagram: ${escapeHtml(id)}]</p></div>`;
  }
}

function renderGameInline(game: string): string {
  switch (game) {
    case "lightning-quiz":   return renderLightningQuizUI();
    case "repo-detective":   return renderRepoDetectiveUI();
    case "spot-readme":      return renderSpotReadmeUI();
    case "commit-translator": return renderCommitTranslatorUI();
    case "local-vs-remote":  return renderLocalRemoteSorterUI();
    default: return "";
  }
}

/** Asymmetric break — rotated each module so it doesn't become a pattern. */
function renderAsymmetric(m: ModuleContent): string {
  switch (m.asymmetric) {
    case "sticky":
      return `<aside class="sticky sticky--lean-r" style="position:absolute;right:0;top:.5rem;max-width:13rem;display:none" hidden></aside>`;
    case "arrow":
      return `<svg class="asymmetric-arrow" width="96" height="60" viewBox="0 0 96 60" style="right:-1rem;top:.5rem;position:absolute" aria-hidden="true">
                <path d="M2 50 Q 30 5 90 18 M 75 8 L 92 18 L 78 30" fill="none" stroke="var(--coral)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>`;
    case "stain":
      return `<span class="coffee-stain" style="right:-2rem;top:-2rem"></span>
              <span class="coffee-stain" style="right:5rem;top:6rem;width:50px;height:50px;opacity:.6"></span>`;
    case "scribble":
      return `<svg class="asymmetric-arrow" width="120" height="40" viewBox="0 0 120 40" style="right:0;top:.25rem;position:absolute" aria-hidden="true">
                <path d="M2 30 Q 20 5, 40 30 T 80 30 T 118 18" fill="none" stroke="var(--mustard)" stroke-width="3" stroke-linecap="round"/>
              </svg>`;
    case "tape":
      return `<span aria-hidden="true" style="position:absolute;right:1rem;top:-.5rem;display:inline-block;width:90px;height:24px;background:rgba(255,242,122,.7);transform:rotate(-3deg);box-shadow:1px 2px 4px rgba(0,0,0,.1);border-left:1px dashed rgba(0,0,0,.15);border-right:1px dashed rgba(0,0,0,.15)"></span>`;
    case "doodle":
      return `<svg class="asymmetric-arrow" width="80" height="80" viewBox="0 0 80 80" style="right:.5rem;top:.5rem;position:absolute" aria-hidden="true">
                <circle cx="40" cy="40" r="28" fill="none" stroke="var(--lavender)" stroke-width="2.5" stroke-dasharray="3,5"/>
                <circle cx="40" cy="40" r="14" fill="none" stroke="var(--coral)" stroke-width="2.5"/>
                <circle cx="40" cy="40" r="3" fill="var(--mustard)"/>
              </svg>`;
    default: return "";
  }
}

function hookCompleteButton(modId: string, nextId?: string): void {
  const btn = document.getElementById("mark-complete") as HTMLButtonElement | null;
  if (!btn) return;
  btn.addEventListener("click", () => {
    markModuleComplete(modId);
    btn.dataset.done = "true";
    btn.classList.remove("btn--primary");
    btn.textContent = t("mod.completed");
    if (nextId) {
      setTimeout(() => { window.location.hash = `#/m/${nextId}`; }, 350);
    }
  });
}

function notFound(): string {
  return `<main id="main" class="shell" style="padding-top:3rem"><h1>${t("err.404.title")}</h1><p>${t("err.404.body")}</p><a class="btn" href="#/">${t("mod.back-home")}</a></main>`;
}

// Re-exported wireRepoAnatomy from the diagram module
import { wireRepoAnatomy } from "../components/diagrams/repo-anatomy";
