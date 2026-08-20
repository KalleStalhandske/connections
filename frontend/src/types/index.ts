export type Difficulty = 'yellow' | 'green' | 'blue' | 'purple';

// Difficulty ordering, easiest -> hardest.
export const DIFFICULTY_ORDER: Difficulty[] = ['yellow', 'green', 'blue', 'purple'];

export interface ConnectionGroup {
  name: string; // e.g. "TYPES OF PIZZA" (displayed uppercase)
  words: [string, string, string, string];
  difficulty: Difficulty; // also determines the color
}

export interface ConnectionsGame {
  id: string;
  title: string; // author-chosen name for the game
  groups: [ConnectionGroup, ConnectionGroup, ConnectionGroup, ConnectionGroup];
  createdAt: string; // ISO timestamp
}
