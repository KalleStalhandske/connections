import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { ConnectionsGame } from '../types';
import * as gamesRepository from '../lib/gamesRepository';

interface GamesContextValue {
  games: ConnectionsGame[];
  loading: boolean;
  createGame: (
    input: Omit<ConnectionsGame, 'id' | 'createdAt'>,
  ) => Promise<ConnectionsGame>;
  getGame: (id: string) => ConnectionsGame | undefined;
}

const GamesContext = createContext<GamesContextValue | undefined>(undefined);

export function GamesProvider({ children }: { children: ReactNode }) {
  const [games, setGames] = useState<ConnectionsGame[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    gamesRepository.listGames().then((loaded) => {
      if (!cancelled) {
        setGames(loaded);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo<GamesContextValue>(
    () => ({
      games,
      loading,
      createGame: async (input) => {
        const created = await gamesRepository.createGame(input);
        setGames((prev) => [...prev, created]);
        return created;
      },
      getGame: (id) => games.find((game) => game.id === id),
    }),
    [games, loading],
  );

  return <GamesContext.Provider value={value}>{children}</GamesContext.Provider>;
}

export function useGames(): GamesContextValue {
  const ctx = useContext(GamesContext);
  if (!ctx) {
    throw new Error('useGames must be used within a GamesProvider');
  }
  return ctx;
}
