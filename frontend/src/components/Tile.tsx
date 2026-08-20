import { DIFFICULTY_BG } from '../lib/difficultyColors';
import type { Difficulty } from '../types';

interface TileProps {
  word: string;
  selected: boolean;
  shaking: boolean;
  onClick: () => void;
  disabled?: boolean;
  /** Set while this tile is sliding into place after a correct guess, ahead
   * of being replaced by the solved-row band: tints it that group's color. */
  previewDifficulty?: Difficulty;
}

/** A single word tile in the play grid. Auto-shrinks long words to fit. */
export function Tile({ word, selected, shaking, onClick, disabled, previewDifficulty }: TileProps) {
  const sizeClass =
    word.length > 10 ? 'text-[0.65rem] sm:text-xs' : word.length > 7 ? 'text-xs sm:text-sm' : 'text-sm sm:text-base';

  return (
    <button
      type="button"
      data-flip-key={word}
      onClick={onClick}
      disabled={disabled}
      className={[
        'flex aspect-5/3 w-full items-center justify-center rounded-md p-2 text-center font-bold uppercase',
        'select-none transition-[transform,background-color] duration-150 ease-out active:scale-95',
        sizeClass,
        previewDifficulty
          ? `${DIFFICULTY_BG[previewDifficulty]} text-ink`
          : selected
            ? 'bg-tile-selected text-white'
            : 'bg-tile text-tile-text hover:brightness-95',
        disabled ? 'cursor-not-allowed opacity-70' : 'cursor-pointer',
        shaking ? 'animate-shake' : '',
      ].join(' ')}
    >
      {word}
    </button>
  );
}
