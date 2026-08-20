import type { ConnectionGroup } from '../types';
import { SolvedRow } from './SolvedRow';
import { Tile } from './Tile';

interface GridProps {
  solvedGroups: ConnectionGroup[];
  unsolvedWords: string[];
  selectedWords: string[];
  shaking: boolean;
  justSolvedName?: string | null;
  onToggleWord: (word: string) => void;
  disabled?: boolean;
}

/**
 * The 4x4 play board: solved groups stack at the top as full-width colored
 * rows (in the order they were solved), remaining unsolved tiles fill the
 * grid beneath them.
 */
export function Grid({
  solvedGroups,
  unsolvedWords,
  selectedWords,
  shaking,
  justSolvedName,
  onToggleWord,
  disabled,
}: GridProps) {
  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-3">
      {solvedGroups.map((group) => (
        <div key={group.name} className="col-span-4">
          <SolvedRow group={group} justSolved={group.name === justSolvedName} />
        </div>
      ))}
      {unsolvedWords.map((word) => (
        <Tile
          key={word}
          word={word}
          selected={selectedWords.includes(word)}
          shaking={shaking && selectedWords.includes(word)}
          onClick={() => onToggleWord(word)}
          disabled={disabled}
        />
      ))}
    </div>
  );
}
