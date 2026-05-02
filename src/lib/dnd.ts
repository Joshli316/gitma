/**
 * Drag & drop with HTML5 DnD on desktop and tap-to-select fallback on touch.
 * Used by Spot README and Local-vs-Remote sorter.
 *
 * Usage:
 *   const dnd = createDnd(rootEl, {
 *     onDrop: (chipId, binId) => boolean // return true to keep placement
 *   });
 *   dnd.attach();
 *   dnd.detach();
 *
 * HTML contract:
 *   - chips: <element class="dnd-chip" data-chip-id="x">
 *   - bins:  <element class="dnd-bin"  data-bin-id="y">
 *   - placed chips get [data-placed="true"] and are appended into the bin
 *   - selected chip (touch) gets [data-selected="true"]
 */

export type DnDOptions = {
  onDrop?: (chipId: string, binId: string) => boolean | void;
};

export interface DnDController {
  attach: () => void;
  detach: () => void;
  reset: () => void;
}

const isTouch = () =>
  typeof window !== "undefined" &&
  ("ontouchstart" in window || (navigator.maxTouchPoints ?? 0) > 0);

export function createDnd(root: HTMLElement, opts: DnDOptions = {}): DnDController {
  let selected: HTMLElement | null = null;

  // ----- Desktop HTML5 DnD -----
  function onDragStart(e: DragEvent) {
    const chip = e.target as HTMLElement;
    if (!chip.classList.contains("dnd-chip")) return;
    if (chip.dataset.placed === "true") return;
    e.dataTransfer?.setData("text/plain", chip.dataset.chipId || "");
    e.dataTransfer && (e.dataTransfer.effectAllowed = "move");
    chip.dataset.dragging = "true";
  }
  function onDragEnd(e: DragEvent) {
    const chip = e.target as HTMLElement;
    if (chip.dataset) delete chip.dataset.dragging;
  }
  function onDragOver(e: DragEvent) {
    const bin = (e.target as HTMLElement).closest(".dnd-bin") as HTMLElement | null;
    if (!bin) return;
    e.preventDefault();
    bin.dataset.over = "true";
  }
  function onDragLeave(e: DragEvent) {
    const bin = (e.target as HTMLElement).closest(".dnd-bin") as HTMLElement | null;
    if (!bin) return;
    delete bin.dataset.over;
  }
  function onDrop(e: DragEvent) {
    const bin = (e.target as HTMLElement).closest(".dnd-bin") as HTMLElement | null;
    if (!bin) return;
    e.preventDefault();
    delete bin.dataset.over;
    const chipId = e.dataTransfer?.getData("text/plain");
    if (!chipId) return;
    placeChip(chipId, bin.dataset.binId || "", bin);
  }

  // ----- Touch / tap fallback -----
  function onClick(e: Event) {
    const t = e.target as HTMLElement;
    const chip = t.closest(".dnd-chip") as HTMLElement | null;
    const bin = t.closest(".dnd-bin") as HTMLElement | null;

    if (chip && chip.dataset.placed !== "true") {
      // toggle selection
      if (selected && selected !== chip) delete selected.dataset.selected;
      if (chip.dataset.selected === "true") { delete chip.dataset.selected; selected = null; }
      else { chip.dataset.selected = "true"; selected = chip; }
      return;
    }
    if (bin && selected) {
      placeChip(selected.dataset.chipId || "", bin.dataset.binId || "", bin);
      delete selected.dataset.selected;
      selected = null;
    }
  }

  function placeChip(chipId: string, binId: string, bin: HTMLElement): void {
    const chip = root.querySelector<HTMLElement>(`.dnd-chip[data-chip-id="${chipId}"]`);
    if (!chip) return;
    const ok = opts.onDrop ? opts.onDrop(chipId, binId) : true;
    if (ok === false) return;
    bin.appendChild(chip);
    chip.dataset.placed = "true";
    chip.removeAttribute("draggable");
  }

  // ----- attach / detach -----
  function makeDraggable() {
    root.querySelectorAll<HTMLElement>(".dnd-chip").forEach((c) => {
      if (c.dataset.placed !== "true") c.setAttribute("draggable", "true");
    });
  }

  function attach() {
    makeDraggable();
    if (!isTouch()) {
      root.addEventListener("dragstart", onDragStart);
      root.addEventListener("dragend", onDragEnd);
      root.addEventListener("dragover", onDragOver);
      root.addEventListener("dragleave", onDragLeave);
      root.addEventListener("drop", onDrop);
    }
    root.addEventListener("click", onClick);
  }

  function detach() {
    root.removeEventListener("dragstart", onDragStart);
    root.removeEventListener("dragend", onDragEnd);
    root.removeEventListener("dragover", onDragOver);
    root.removeEventListener("dragleave", onDragLeave);
    root.removeEventListener("drop", onDrop);
    root.removeEventListener("click", onClick);
  }

  function reset() {
    if (selected) { delete selected.dataset.selected; selected = null; }
    root.querySelectorAll<HTMLElement>(".dnd-bin").forEach((b) => {
      delete b.dataset.over; delete b.dataset.correct; delete b.dataset.wrong;
    });
  }

  return { attach, detach, reset };
}
