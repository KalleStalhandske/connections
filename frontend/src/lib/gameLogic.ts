/**
 * Pure, framework-free game rules for Connections. No React here, so this
 * stays easy to unit test and to reuse (e.g. server-side in a later phase).
 */
import type { ConnectionGroup, ConnectionsGame, Difficulty } from '../types';
import { DIFFICULTY_ORDER } from '../types';

export const MAX_MISTAKES = 4;
export const SELECTION_SIZE = 4;

export type GuessResult =
  | { kind: 'correct'; group: ConnectionGroup }
  | { kind: 'one-away' }
  | { kind: 'incorrect' };

/** Normalize a word for comparison: trim whitespace, case-insensitive. */
function normalize(word: string): string {
  return word.trim().toLowerCase();
}

/** Find the group (if any) that a given word belongs to. */
export function findGroupForWord(
  game: ConnectionsGame,
  word: string,
): ConnectionGroup | undefined {
  const target = normalize(word);
  return game.groups.find((group) =>
    group.words.some((w) => normalize(w) === target),
  );
}

/**
 * Evaluate a 4-word guess against a game's groups:
 * - "correct" if the 4 words are exactly one group.
 * - "one-away" if exactly 3 of the 4 belong to the same single group.
 * - "incorrect" otherwise.
 */
export function evaluateGuess(
  game: ConnectionsGame,
  selectedWords: string[],
): GuessResult {
  if (selectedWords.length !== SELECTION_SIZE) {
    return { kind: 'incorrect' };
  }

  const groupsOfSelected = selectedWords.map((word) => findGroupForWord(game, word));
  const counts = new Map<ConnectionGroup, number>();
  for (const group of groupsOfSelected) {
    if (!group) continue;
    counts.set(group, (counts.get(group) ?? 0) + 1);
  }

  for (const [group, count] of counts) {
    if (count === SELECTION_SIZE) {
      return { kind: 'correct', group };
    }
    if (count === SELECTION_SIZE - 1) {
      return { kind: 'one-away' };
    }
  }

  return { kind: 'incorrect' };
}

/** Fisher-Yates shuffle; returns a new array, does not mutate the input. */
export function shuffle<T>(items: readonly T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/** All 16 words of a game, in group order (not shuffled). */
export function allWords(game: ConnectionsGame): string[] {
  return game.groups.flatMap((group) => group.words);
}

/** Compare two word selections for equality, ignoring order and case. */
export function sameSelection(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  const na = [...a].map(normalize).sort();
  const nb = [...b].map(normalize).sort();
  return na.every((w, i) => w === nb[i]);
}

/** Difficulty ordering, easiest -> hardest, for reveal-on-loss ordering. */
export function sortByDifficulty(groups: ConnectionGroup[]): ConnectionGroup[] {
  const rank: Record<Difficulty, number> = { yellow: 0, green: 1, blue: 2, purple: 3 };
  return [...groups].sort((a, b) => rank[a.difficulty] - rank[b.difficulty]);
}

export interface GameDraftErrors {
  title?: string;
  groups: string[][]; // one array of error messages per group index (0-3)
  wordsError?: string; // cross-group: duplicate words anywhere in the game
  colorsError?: string; // cross-group: each of the 4 colors must be used exactly once
}

/** True if a draft has zero errors anywhere. */
export function isDraftValid(errors: GameDraftErrors): boolean {
  return (
    !errors.title &&
    !errors.wordsError &&
    !errors.colorsError &&
    errors.groups.every((g) => g.length === 0)
  );
}

/**
 * Validate a game draft before saving. Pure and framework-free so both the
 * Create form and (later) any API layer can reuse the same rules.
 */
export function validateGameDraft(title: string, groups: ConnectionGroup[]): GameDraftErrors {
  const groupErrors: string[][] = groups.map(() => []);

  groups.forEach((group, i) => {
    if (group.name.trim().length === 0) {
      groupErrors[i].push('Category name is required.');
    }
    group.words.forEach((word, j) => {
      if (word.trim().length === 0) {
        groupErrors[i].push(`Word ${j + 1} is required.`);
      }
    });
  });

  const allTrimmedWords = groups.flatMap((g) => g.words.map((w) => normalize(w)).filter(Boolean));
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const word of allTrimmedWords) {
    if (seen.has(word)) duplicates.add(word);
    seen.add(word);
  }

  const colorCounts = new Map<Difficulty, number>();
  for (const group of groups) {
    colorCounts.set(group.difficulty, (colorCounts.get(group.difficulty) ?? 0) + 1);
  }
  const colorsValid = DIFFICULTY_ORDER.every((d) => colorCounts.get(d) === 1);

  return {
    title: title.trim().length === 0 ? 'Title is required.' : undefined,
    groups: groupErrors,
    wordsError:
      duplicates.size > 0 ? 'All 16 words must be unique (case-insensitive).' : undefined,
    colorsError: colorsValid ? undefined : 'Each of the four colors must be used exactly once.',
  };
}
