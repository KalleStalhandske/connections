import { useRef } from 'react';
import { useFlip } from '../hooks/useFlip';
import type { ConnectionGroup } from '../types';
import { SolvedRow } from './SolvedRow';
import { Tile } from './Tile';

interface GridProps {
  solvedGroups: ConnectionGroup[];
  unsolvedWords: string[];
  selectedWords: string[];
  shaking: boolean;
  justSolvedName?: string | null;
  /** The group currently sliding into place after a correct guess, ahead of
   * being swapped for its solved-row band. */
  previewGroup?: ConnectionGroup | null;
  onToggleWord: (word: string) => void;
  disabled?: boolean;
}

/**
 * The 4x4 play board: solved groups stack at the top as full-width colored
 * rows (in the order they were solved), remaining unsolved tiles fill the
 * grid beneath them. Reordering `unsolvedWords` (e.g. to bring a just-solved
 * group to the front) slides tiles into their new spots via `useFlip`,
 * rather than snapping straight there.
 */
export function Grid({
  solvedGroups,
  unsolvedWords,
  selectedWords,
  shaking,
  justSolvedName,
  previewGroup,
  onToggleWord,
  disabled,
}: GridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const layoutSignal = [...solvedGroups.map((g) => g.name), ...unsolvedWords].join('|');
  useFlip(containerRef, layoutSignal);

  return (
    <div ref={containerRef} className="grid grid-cols-4 gap-2 sm:gap-3">
      {solvedGroups.map((group) => (
        <div key={group.name} data-flip-key={group.name} className="col-span-4">
          <SolvedRow group={group} justSolved={group.name === justSolvedName} />
        </div>
      ))}
      {unsolvedWords.map((word) => (
        <Tile
          key={word}
          word={word}
          selected={selectedWords.includes(word)}
          shaking={shaking && selectedWords.includes(word)}
          previewDifficulty={previewGroup?.words.includes(word) ? previewGroup.difficulty : undefined}
          onClick={() => onToggleWord(word)}
          disabled={disabled}
        />
      ))}
    </div>
  );
}
