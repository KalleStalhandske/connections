import type { ConnectionsGame } from '../types';

/**
 * Sample games used to seed localStorage on first load, so /play is never
 * empty. These are NOT re-added if the user already has games stored.
 */
export const seedGames: ConnectionsGame[] = [
  {
    id: 'seed-1',
    title: 'Classic Mix',
    createdAt: '2026-01-01T00:00:00.000Z',
    groups: [
      {
        name: 'TYPES OF PIZZA',
        words: ['MARGHERITA', 'HAWAIIAN', 'PEPPERONI', 'SUPREME'],
        difficulty: 'yellow',
      },
      {
        name: 'GO ___',
        words: ['CART', 'FISH', 'PHER', 'KART'],
        difficulty: 'green',
      },
      {
        name: 'CHESS PIECES',
        words: ['BISHOP', 'KNIGHT', 'ROOK', 'PAWN'],
        difficulty: 'blue',
      },
      {
        name: 'HOMOPHONES OF NUMBERS',
        words: ['WON', 'TOO', 'FOR', 'ATE'],
        difficulty: 'purple',
      },
    ],
  },
  {
    id: 'seed-2',
    title: 'Kitchen & Coffee',
    createdAt: '2026-01-02T00:00:00.000Z',
    groups: [
      {
        name: 'COFFEE ORDERS',
        words: ['LATTE', 'MOCHA', 'CORTADO', 'ESPRESSO'],
        difficulty: 'yellow',
      },
      {
        name: 'KITCHEN UTENSILS',
        words: ['WHISK', 'SPATULA', 'LADLE', 'TONGS'],
        difficulty: 'green',
      },
      {
        name: '___ BEAN',
        words: ['STRING', 'JELLY', 'HUMAN', 'HAS'],
        difficulty: 'blue',
      },
      {
        name: 'WORDS BEFORE "CAKE"',
        words: ['CUP', 'PAN', 'BEEF', 'FISH'],
        difficulty: 'purple',
      },
    ],
  },
  {
    id: 'seed-3',
    title: 'Movie Night',
    createdAt: '2026-01-03T00:00:00.000Z',
    groups: [
      {
        name: 'FILM GENRES',
        words: ['THRILLER', 'COMEDY', 'DRAMA', 'HORROR'],
        difficulty: 'yellow',
      },
      {
        name: 'PIXAR MOVIES',
        words: ['COCO', 'BRAVE', 'CARS', 'UP'],
        difficulty: 'green',
      },
      {
        name: 'MOVIE THEATER ITEMS',
        words: ['POPCORN', 'TICKET', 'SCREEN', 'AISLE'],
        difficulty: 'blue',
      },
      {
        name: '___ ROLL',
        words: ['DRUM', 'RICK', 'BARREL', 'ROCK'],
        difficulty: 'purple',
      },
    ],
  },
];
