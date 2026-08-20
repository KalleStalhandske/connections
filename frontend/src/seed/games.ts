import type { ConnectionsGame } from '../types';

/**
 * Sample games used to seed localStorage on first load, so /play is never
 * empty. These are NOT re-added if the user already has games stored.
 */
export const seedGames: ConnectionsGame[] = [
  {
    id: 'seed-0',
    title: 'TEST',
    createdAt: '2026-01-01T00:00:00.000Z',
    groups: [
      {
        name: '1:s',
        words: ['1A', '1B', '1C', '1D'],
        difficulty: 'yellow',
      },
      {
        name: '2:s',
        words: ['2A', '2B', '2C', '2D'],
        difficulty: 'green',
      },
      {
        name: '3:s',
        words: ['3A', '3B', '3C', '3D'],
        difficulty: 'blue',
      },
      {
        name: '4:s',
        words: ['4A', '4B', '4C', '4D'],
        difficulty: 'purple',
      },
    ],
  },
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
