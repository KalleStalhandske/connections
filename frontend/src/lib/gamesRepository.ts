/**
 * The ONLY place that reads/writes game data. Implemented against
 * localStorage today; every method is async so swapping this out for a
 * `fetch`-based API in Phase 2 requires no changes to callers.
 */
import type { ConnectionsGame } from '../types';
import { seedGames } from '../seed/games';

const STORAGE_KEY = 'connections:games';

function readAll(): ConnectionsGame[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    // Malformed JSON or storage unavailable: degrade to an empty list.
    return [];
  }
}

function writeAll(games: ConnectionsGame[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(games));
  } catch {
    // Storage unavailable (quota, private mode, etc.) - fail silently.
  }
}

/** Seed sample games on first load only; never overwrites existing data. */
function ensureSeeded(): void {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) {
      writeAll(seedGames);
    }
  } catch {
    // Storage unavailable - nothing to seed into.
  }
}

export async function listGames(): Promise<ConnectionsGame[]> {
  ensureSeeded();
  return readAll();
}

export async function getGame(id: string): Promise<ConnectionsGame | undefined> {
  ensureSeeded();
  return readAll().find((game) => game.id === id);
}

export async function createGame(
  input: Omit<ConnectionsGame, 'id' | 'createdAt'>,
): Promise<ConnectionsGame> {
  const game: ConnectionsGame = {
    ...input,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  const games = readAll();
  games.push(game);
  writeAll(games);
  return game;
}
