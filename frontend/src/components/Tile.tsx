interface TileProps {
  word: string;
  selected: boolean;
  shaking: boolean;
  onClick: () => void;
  disabled?: boolean;
}

/** A single word tile in the play grid. Auto-shrinks long words to fit. */
export function Tile({ word, selected, shaking, onClick, disabled }: TileProps) {
  const sizeClass =
    word.length > 10 ? 'text-[0.65rem] sm:text-xs' : word.length > 7 ? 'text-xs sm:text-sm' : 'text-sm sm:text-base';

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={[
        'flex aspect-square w-full items-center justify-center rounded-md p-2 text-center font-bold uppercase',
        'select-none transition-transform duration-100 ease-out active:scale-95',
        sizeClass,
        selected ? 'bg-tile-selected text-white' : 'bg-tile text-tile-text hover:brightness-95',
        disabled ? 'cursor-not-allowed opacity-70' : 'cursor-pointer',
        shaking ? 'animate-shake' : '',
      ].join(' ')}
    >
      {word}
    </button>
  );
}
