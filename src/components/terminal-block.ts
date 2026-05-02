import { escapeHtml } from "../utils";

/** Renders a terminal-styled code block with traffic lights and syntax highlights. */
export function terminalBlock(lines: string[], label = "terminal"): string {
  const body = lines.map((raw) => highlightLine(raw)).join("\n");
  return `
    <div role="figure" aria-label="${escapeHtml(label)}" style="margin:1.25rem 0">
      <div class="terminal-header">
        <div class="terminal-dot terminal-dot-r" aria-hidden="true"></div>
        <div class="terminal-dot terminal-dot-y" aria-hidden="true"></div>
        <div class="terminal-dot terminal-dot-g" aria-hidden="true"></div>
        <span class="terminal-label">${escapeHtml(label)}</span>
      </div>
      <pre class="terminal" tabindex="0">${body}</pre>
    </div>
  `;
}

function highlightLine(raw: string): string {
  // raw can begin with "$ " (prompt), or "  " (output), or "#" (comment)
  // Order matters: do "#"/'"' detection on the RAW string first, then escape segments individually,
  // so escaped entities like &#39; don't trip the regexes.
  // 1) split off a trailing comment (only "# " preceded by start-of-line or whitespace)
  const commentMatch = raw.match(/(^|\s)(#[^\n]*)$/);
  let main = raw;
  let trailing = "";
  if (commentMatch) {
    main = raw.slice(0, commentMatch.index! + commentMatch[1].length);
    trailing = commentMatch[2];
  }
  // 2) inside main: escape, then mark "$ " prompt, then "..." strings
  let s = escapeHtml(main);
  s = s.replace(/^\$ /, '<span class="prompt">$ </span>');
  s = s.replace(/(&quot;[^&]*?&quot;)/g, '<span class="str">$1</span>');
  if (trailing) s += `<span class="comment">${escapeHtml(trailing)}</span>`;
  return s;
}
