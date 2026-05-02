import { t } from "../i18n";
import { escapeHtml } from "../utils";

export type NbSlot = "video" | "audio" | "mindmap";

const ASSETS: Record<NbSlot, string> = {
  video: "assets/notebooklm/video.json",
  audio: "assets/notebooklm/what-is-github.mp3",
  mindmap: "assets/notebooklm/mindmap.svg",
};

export function renderNbSlot(slot: NbSlot): string {
  // ship empty by default; main.ts hydrates after HEAD-check
  return `
    <div class="empty-slot" data-nb-slot="${slot}" data-empty="true" role="region" aria-label="${escapeHtml(t(`nb.${slot}.title`))}">
      <strong>${t(`nb.${slot}.title`)}</strong>
      ${t(`nb.${slot}.empty`)}
    </div>
  `;
}

let manifestPromise: Promise<Set<string>> | null = null;

/** One-shot manifest fetch: GET /assets/notebooklm/manifest.json (single 404 if missing, vs 5). */
function loadManifest(): Promise<Set<string>> {
  if (!manifestPromise) {
    manifestPromise = fetch("assets/notebooklm/manifest.json", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : { available: [] }))
      .then((m) => new Set<string>(Array.isArray(m.available) ? m.available : []))
      .catch(() => new Set<string>());
  }
  return manifestPromise;
}

/** Replace empty-state stickies with actual assets, gated by the manifest. */
export async function hydrateNbSlots(root: ParentNode = document): Promise<void> {
  const slots = root.querySelectorAll<HTMLElement>("[data-nb-slot]");
  if (slots.length === 0) return;
  const manifest = await loadManifest();
  for (const el of Array.from(slots)) {
    const kind = el.dataset.nbSlot as NbSlot;
    if (!kind || !manifest.has(kind)) continue;
    const path = ASSETS[kind];
    if (!path) continue;
    el.dataset.empty = "false";
    el.innerHTML = renderHydrated(kind, path);
  }
}

function renderHydrated(kind: NbSlot, path: string): string {
  if (kind === "audio") {
    return `<strong>${t("nb.audio.title")}</strong>
      <audio controls preload="metadata" src="${path}" style="width:100%;margin-top:.5rem"></audio>`;
  }
  if (kind === "mindmap") {
    const alt = escapeHtml(t("nb.mindmap.title"));
    const zoomLabel = escapeHtml(t("nb.mindmap.zoom"));
    return `<strong>${t("nb.mindmap.title")}</strong>
      <button type="button" class="nb-mindmap-zoom" data-nb-zoom="${path}" aria-label="${zoomLabel}"
        style="display:block;width:100%;margin-top:.5rem;padding:0;border:0;background:transparent;cursor:zoom-in;border-radius:6px">
        <img src="${path}" alt="${alt}" loading="lazy" style="display:block;width:100%;height:auto;background:#fff;border-radius:6px;pointer-events:none" />
      </button>
      <small style="display:block;margin-top:.25rem;text-align:center;opacity:.7">${zoomLabel}</small>`;
  }
  if (kind === "video") {
    // expects { ytId: "..." }
    return `<strong>${t("nb.video.title")}</strong>
      <div data-nb-video-loader="${path}" style="margin-top:.5rem">…</div>`;
  }
  return "";
}

/** After hydrate, fetch each video.json and replace the loader with an iframe. */
export async function hydrateVideoLoaders(root: ParentNode = document): Promise<void> {
  const loaders = root.querySelectorAll<HTMLElement>("[data-nb-video-loader]");
  for (const el of Array.from(loaders)) {
    const path = el.dataset.nbVideoLoader!;
    try {
      const res = await fetch(path);
      if (!res.ok) throw new Error("not ok");
      const data = await res.json();
      const id = String(data.ytId || "").replace(/[^A-Za-z0-9_-]/g, "");
      if (!id) continue;
      el.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${id}" loading="lazy"
        referrerpolicy="strict-origin-when-cross-origin"
        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        style="width:100%;aspect-ratio:16/9;border:0;border-radius:6px"
        allowfullscreen title="GitHub video overview"></iframe>`;
    } catch {
      // leave loader text
    }
  }
}

function ensureZoomDialog(): HTMLDialogElement {
  let dlg = document.getElementById("nb-zoom-dialog") as HTMLDialogElement | null;
  if (dlg) return dlg;
  dlg = document.createElement("dialog");
  dlg.id = "nb-zoom-dialog";
  dlg.setAttribute("aria-label", t("nb.mindmap.title"));
  dlg.style.cssText =
    "padding:0;border:0;background:transparent;max-width:96vw;max-height:96vh;width:96vw;height:96vh;overflow:hidden";
  dlg.innerHTML = `
    <button type="button" data-nb-zoom-close
      aria-label="${escapeHtml(t("nb.zoom.close"))}"
      style="position:absolute;top:1rem;right:1rem;z-index:2;width:2.5rem;height:2.5rem;border-radius:50%;border:0;background:#fff;cursor:pointer;font-size:1.25rem;box-shadow:0 2px 8px rgba(0,0,0,.3)">×</button>
    <img data-nb-zoom-img alt="" style="display:block;width:100%;height:100%;object-fit:contain;background:#fff;border-radius:8px" />
  `;
  dlg.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    if (target === dlg || target.hasAttribute("data-nb-zoom-close")) dlg!.close();
  });
  document.body.appendChild(dlg);
  return dlg;
}

export function attachZoomHandlers(root: ParentNode = document): void {
  for (const btn of Array.from(root.querySelectorAll<HTMLButtonElement>("[data-nb-zoom]"))) {
    btn.addEventListener("click", () => {
      const path = btn.getAttribute("data-nb-zoom");
      if (!path) return;
      const dlg = ensureZoomDialog();
      dlg.querySelector<HTMLImageElement>("[data-nb-zoom-img]")!.src = path;
      dlg.showModal();
    });
  }
}

export function renderPdfSlots(): string {
  return `
    <div class="empty-slot" data-nb-pdf="briefing" data-empty="true">
      <strong>${t("nb.briefing")}</strong>
      ${t("nb.briefing.empty")}
    </div>
    <div class="empty-slot" data-nb-pdf="study-guide" data-empty="true" style="transform:rotate(1deg);margin-top:1rem">
      <strong>${t("nb.studyguide")}</strong>
      ${t("nb.studyguide.empty")}
    </div>
  `;
}

export async function hydratePdfSlots(root: ParentNode = document): Promise<void> {
  const slots = root.querySelectorAll<HTMLElement>("[data-nb-pdf]");
  if (slots.length === 0) return;
  const manifest = await loadManifest();
  for (const el of Array.from(slots)) {
    const kind = el.dataset.nbPdf!;
    const manifestKey = kind === "briefing" ? "briefing" : "studyguide";
    if (!manifest.has(manifestKey)) continue;
    const path = `assets/notebooklm/${kind === "briefing" ? "briefing.pdf" : "study-guide.pdf"}`;
    el.dataset.empty = "false";
    const title = kind === "briefing" ? t("nb.briefing") : t("nb.studyguide");
    el.innerHTML = `<strong>${title}</strong>
      <a class="btn btn--accent" href="${path}" download style="margin-top:.5rem">↓ ${title}</a>`;
  }
}
