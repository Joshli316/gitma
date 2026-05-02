/**
 * Unit tests for commit-translator scoring.
 * Run via `npx tsx test/commit-score.test.ts`.
 */
import { scoreCommit } from "../src/games/commit-score";

let passed = 0; let failed = 0;
function expect<T>(actual: T, expected: T, label: string): void {
  const ok = actual === expected;
  if (ok) { passed++; console.log("  ✓ " + label); }
  else    { failed++; console.log(`  ✗ ${label} — got ${JSON.stringify(actual)}, want ${JSON.stringify(expected)}`); }
}

console.log("\n[commit-score]\n");

// Happy path: verb-first, imperative, ≤72, mentions thing, capitalized
{
  const r = scoreCommit({ message: "Add dark-mode toggle to settings page", intent: "You added a dark-mode toggle to the settings page." });
  expect(r.score, 100, "verb + imperative + length + thing + caps = 100");
  expect(r.issues.length, 0, "no issues for perfect message");
}

// Past tense penalty: verb regex requires word-boundary so "Added" misses the verb bonus too.
{
  const r = scoreCommit({ message: "Added dark-mode toggle", intent: "You added a dark-mode toggle." });
  expect(r.issues.includes("game.commit.feedback.imperative"), true, "flags past-tense as non-imperative");
  // 0 verb + 0 imperative (penalized) + 25 length + 25 thing + 10 caps = 60
  expect(r.score, 60, "past tense ('Added') misses verb regex AND imperative bonus");
}

// Empty message — no content earns no points.
{
  const r = scoreCommit({ message: "", intent: "You added something." });
  expect(r.score, 0, "empty message scores 0");
  expect(r.issues.length, 3, "empty hits 3 issue types (verb, length, thing) — imperative is silent on empty");
}

// Verb missing
{
  const r = scoreCommit({ message: "the login button on Safari", intent: "You fixed the login button on Safari." });
  expect(r.issues.includes("game.commit.feedback.verb"), true, "no verb at start = verb issue");
}

// Length over 72
{
  const longMsg = "Add an extremely long-winded explanation of the dark-mode toggle that goes on and on";
  const r = scoreCommit({ message: longMsg, intent: "You added a dark-mode toggle." });
  expect(r.issues.includes("game.commit.feedback.length"), true, "over 72 chars = length issue");
}

// Doesn't mention thing
{
  const r = scoreCommit({ message: "Add stuff", intent: "You added a dark-mode toggle to the settings page." });
  expect(r.issues.includes("game.commit.feedback.thing"), true, "vague message = thing issue");
}

// Lowercase first letter
{
  const r = scoreCommit({ message: "add dark-mode toggle to settings", intent: "You added a dark-mode toggle to the settings page." });
  // verb (30, case-insensitive) + imperative (10) + length (25) + thing (25) = 90
  expect(r.score, 90, "lowercase verb scores 90 (no caps bonus)");
}

// Stopwords don't count for "thing" hit
{
  const r = scoreCommit({ message: "Fix this with that page", intent: "You did something on a page." });
  // intent tokens after stopword filter: "something" — but "page" is a stopword too
  // message contains none of the non-stopword tokens
  expect(r.issues.includes("game.commit.feedback.thing"), true, "stopwords don't count as thing-mentions");
}

console.log(`\n${passed} passed, ${failed} failed\n`);
process.exit(failed ? 1 : 0);
