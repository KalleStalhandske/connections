import type { ConnectionGroup } from '../types';

const DIFFICULTY_BG: Record<ConnectionGroup['difficulty'], string> = {
  yellow: 'bg-conn-yellow',
  green: 'bg-conn-green',
  blue: 'bg-conn-blue',
  purple: 'bg-conn-purple',
};

interface SolvedRowProps {
  group: ConnectionGroup;
  justSolved?: boolean;
}

/** A full-width colored row shown once a group has been solved. */
export function SolvedRow({ group, justSolved }: SolvedRowProps) {
  return (
    <div
      className={[
        'flex aspect-square w-full flex-col items-center justify-center gap-1 rounded-md p-2 text-center sm:aspect-20/3',
        DIFFICULTY_BG[group.difficulty],
        justSolved ? 'animate-solve-pop' : '',
      ].join(' ')}
    >
      <div className="text-sm font-extrabold uppercase tracking-wide text-ink sm:text-base">
        {group.name}
      </div>
      <div className="text-xs font-semibold uppercase text-ink sm:text-sm">
        {group.words.join(', ')}
      </div>
    </div>
  );
}
