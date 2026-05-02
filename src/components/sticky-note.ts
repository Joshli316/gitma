import { rich } from "../utils";

export function stickyNote(opts: { title?: string; body: string; lean?: "l" | "r" | "auto" }): string {
  const cls = opts.lean === "l" ? "sticky--lean-l" : opts.lean === "r" ? "sticky--lean-r" : "";
  return `
    <aside class="sticky ${cls}" role="note">
      ${opts.title ? `<strong style="display:block;margin-bottom:.35rem;font-size:1.2rem">${opts.title}</strong>` : ""}
      <div>${rich(opts.body)}</div>
    </aside>
  `;
}
