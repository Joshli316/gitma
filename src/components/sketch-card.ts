import { rich } from "../utils";

export function sketchCard(opts: {
  title?: string;
  body?: string;
  lean?: 1 | 2 | 3 | 4;
  tag?: string;
  href?: string;
}): string {
  const lean = opts.lean ?? 1;
  const tag = opts.tag ? `<span class="chip chip--mustard">${opts.tag}</span>` : "";
  const inner = `
    <div class="sketch-card lean-${lean}">
      ${tag}
      ${opts.title ? `<h3 style="margin:.5rem 0 .75rem">${opts.title}</h3>` : ""}
      ${opts.body ? `<p style="margin:0">${rich(opts.body)}</p>` : ""}
    </div>
  `;
  if (opts.href) return `<a href="${opts.href}" style="text-decoration:none;color:inherit;display:block">${inner}</a>`;
  return inner;
}
