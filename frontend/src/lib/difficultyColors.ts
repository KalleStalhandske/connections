import type { Difficulty } from '../types';

/** Tailwind background class for each difficulty's tile/reveal color. */
export const DIFFICULTY_BG: Record<Difficulty, string> = {
  yellow: 'bg-conn-yellow',
  green: 'bg-conn-green',
  blue: 'bg-conn-blue',
  purple: 'bg-conn-purple',
};
