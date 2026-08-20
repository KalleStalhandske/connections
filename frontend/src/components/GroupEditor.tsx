import type { ConnectionGroup, Difficulty } from '../types';

const DIFFICULTY_BG: Record<Difficulty, string> = {
  yellow: 'bg-conn-yellow/40',
  green: 'bg-conn-green/40',
  blue: 'bg-conn-blue/40',
  purple: 'bg-conn-purple/40',
};

const DIFFICULTY_SWATCH: Record<Difficulty, string> = {
  yellow: 'bg-conn-yellow',
  green: 'bg-conn-green',
  blue: 'bg-conn-blue',
  purple: 'bg-conn-purple',
};

const DIFFICULTIES: Difficulty[] = ['yellow', 'green', 'blue', 'purple'];

interface GroupEditorProps {
  index: number;
  group: ConnectionGroup;
  errors?: string[];
  onChange: (group: ConnectionGroup) => void;
}

/** One group's editor within the Create form: name, 4 words, difficulty. */
export function GroupEditor({ index, group, errors, onChange }: GroupEditorProps) {
  function setWord(i: number, value: string) {
    const words = [...group.words] as ConnectionGroup['words'];
    words[i] = value;
    onChange({ ...group, words });
  }

  return (
    <div className={`rounded-lg border border-black/10 p-4 ${DIFFICULTY_BG[group.difficulty]}`}>
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-semibold">Group {index + 1}</span>
        <div className="flex gap-1.5">
          {DIFFICULTIES.map((d) => (
            <button
              key={d}
              type="button"
              title={d}
              onClick={() => onChange({ ...group, difficulty: d })}
              className={`h-6 w-6 rounded-full ${DIFFICULTY_SWATCH[d]} ${
                group.difficulty === d ? 'ring-2 ring-black ring-offset-1' : 'opacity-60'
              }`}
            />
          ))}
        </div>
      </div>

      <label className="mb-2 block text-xs font-semibold uppercase text-black/60">
        Category name
        <input
          type="text"
          value={group.name}
          onChange={(e) => onChange({ ...group, name: e.target.value })}
          placeholder="e.g. TYPES OF PIZZA"
          className="mt-1 w-full rounded-md border border-black/20 bg-white px-3 py-1.5 text-sm font-normal normal-case text-black focus:border-black focus:outline-none"
        />
      </label>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {group.words.map((word, i) => (
          <input
            key={i}
            type="text"
            value={word}
            onChange={(e) => setWord(i, e.target.value)}
            placeholder={`Word ${i + 1}`}
            className="rounded-md border border-black/20 bg-white px-2 py-1.5 text-sm focus:border-black focus:outline-none"
          />
        ))}
      </div>

      {errors && errors.length > 0 && (
        <ul className="mt-2 space-y-0.5 text-xs font-medium text-red-700">
          {errors.map((err) => (
            <li key={err}>{err}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
