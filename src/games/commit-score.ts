/**
 * Pure scoring function for the Commit Translator game.
 *
 * Lives in its own file so it's testable in isolation (test/commit-score.test.ts).
 * Scores 0..100 across 5 heuristics: verb-first, imperative, length, mentions-thing, capitalization.
 */

export interface CommitScoreResult {
  score: number;
  issues: string[]; // i18n keys for "game.commit.feedback.*" — null when score is high
}

export interface CommitScoreInput {
  message: string;
  /** The English-language intent string used to extract token candidates. */
  intent: string;
}

const VERB_RE = /^(Add|Fix|Update|Remove|Refactor|Rename|Move|Bump|Upgrade|Drop|Replace|Document|Improve|Clean|Restore|Revert|Patch|Style|Test|Implement|Introduce|Wire|Hook)\b/i;
const PAST_3RD_RE = /^(Added|Fixed|Updated|Removed|Refactored|Renamed|Moved|Adds|Fixes|Updates|Removes)\b/i;
const STOPWORDS = new Set(["this", "that", "with", "from", "into", "page", "have", "your", "where"]);

export function scoreCommit({ message, intent }: CommitScoreInput): CommitScoreResult {
  const trimmed = message.trim();
  const issues: string[] = [];
  let pts = 0;

  if (VERB_RE.test(trimmed)) pts += 30;
  else issues.push("game.commit.feedback.verb");

  // Imperative bonus only when there's actually a message — empty strings shouldn't earn the "not past-tense" reward.
  if (trimmed.length > 0 && !PAST_3RD_RE.test(trimmed)) pts += 10;
  else if (PAST_3RD_RE.test(trimmed)) issues.push("game.commit.feedback.imperative");

  if (trimmed.length > 0 && trimmed.length <= 72) pts += 25;
  else issues.push("game.commit.feedback.length");

  const intentTokens = intent
    .toLowerCase()
    .replace(/[^a-z0-9 .-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 3 && !STOPWORDS.has(w));
  const lower = trimmed.toLowerCase();
  const hits = intentTokens.filter((w) => lower.includes(w)).length;
  if (hits >= 1) pts += 25;
  else issues.push("game.commit.feedback.thing");

  if (/^[A-Z]/.test(trimmed)) pts += 10;

  return { score: Math.min(100, Math.max(0, pts)), issues };
}
