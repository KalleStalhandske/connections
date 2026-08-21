/**
 * The ONLY place that reads/writes game data. Talks to the backend API over
 * `fetch`; every method is async so it's a drop-in for whatever the data
 * source was before (this used to be `lib/gamesRepository.ts`, backed by
 * localStorage - same three functions, same signatures).
 */
import type { ConnectionsGame } from '../types';

const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

export async function listGames(): Promise<ConnectionsGame[]> {
  const res = await fetch(`${BASE}/api/games`);
  if (!res.ok) {
    throw new Error(`Failed to load games (${res.status})`);
  }
  return res.json();
}

export async function getGame(id: string): Promise<ConnectionsGame | undefined> {
  const res = await fetch(`${BASE}/api/games/${id}`);
  if (res.status === 404) {
    return undefined;
  }
  if (!res.ok) {
    throw new Error(`Failed to load game ${id} (${res.status})`);
  }
  return res.json();
}

export async function createGame(
  input: Omit<ConnectionsGame, 'id' | 'createdAt'>,
): Promise<ConnectionsGame> {
  const res = await fetch(`${BASE}/api/games`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    throw new Error(`Failed to create game (${res.status})`);
  }
  return res.json();
}
