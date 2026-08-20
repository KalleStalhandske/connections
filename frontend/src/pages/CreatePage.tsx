import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGames } from '../store/GamesProvider';
import { GroupEditor } from '../components/GroupEditor';
import { isDraftValid, validateGameDraft } from '../lib/gameLogic';
import type { ConnectionGroup, Difficulty } from '../types';

function emptyGroup(difficulty: Difficulty): ConnectionGroup {
  return { name: '', words: ['', '', '', ''], difficulty };
}

const INITIAL_GROUPS: ConnectionGroup[] = [
  emptyGroup('yellow'),
  emptyGroup('green'),
  emptyGroup('blue'),
  emptyGroup('purple'),
];

export function CreatePage() {
  const navigate = useNavigate();
  const { createGame } = useGames();

  const [title, setTitle] = useState('');
  const [groups, setGroups] = useState<ConnectionGroup[]>(INITIAL_GROUPS);
  const [touched, setTouched] = useState(false);
  const [saving, setSaving] = useState(false);

  const errors = validateGameDraft(title, groups);
  const valid = isDraftValid(errors);

  function updateGroup(index: number, next: ConnectionGroup) {
    setGroups((prev) => prev.map((g, i) => (i === index ? next : g)));
  }

  async function handleSave() {
    setTouched(true);
    if (!valid || saving) return;

    setSaving(true);
    const trimmedGroups = groups.map((g) => ({
      ...g,
      name: g.name.trim(),
      words: g.words.map((w) => w.trim()) as ConnectionGroup['words'],
    })) as [ConnectionGroup, ConnectionGroup, ConnectionGroup, ConnectionGroup];

    const created = await createGame({ title: title.trim(), groups: trimmedGroups });
    navigate(`/play/${created.id}`);
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-8">
      <h1 className="mb-6 text-2xl font-bold">Create a game</h1>

      <label className="mb-6 block text-sm font-semibold">
        Game title
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Friday Night Puzzle"
          className="mt-1 w-full rounded-md border border-black/20 px-3 py-2 text-base font-normal focus:border-black focus:outline-none"
        />
        {touched && errors.title && (
          <span className="mt-1 block text-xs font-medium text-red-700">{errors.title}</span>
        )}
      </label>

      <div className="mb-4 flex flex-col gap-4">
        {groups.map((group, i) => (
          <GroupEditor
            key={i}
            index={i}
            group={group}
            errors={touched ? errors.groups[i] : []}
            onChange={(next) => updateGroup(i, next)}
          />
        ))}
      </div>

      {touched && (errors.wordsError || errors.colorsError) && (
        <ul className="mb-4 space-y-0.5 text-sm font-medium text-red-700">
          {errors.wordsError && <li>{errors.wordsError}</li>}
          {errors.colorsError && <li>{errors.colorsError}</li>}
        </ul>
      )}

      <button
        type="button"
        onClick={handleSave}
        disabled={!valid || saving}
        className="rounded-full border border-black bg-black px-6 py-2 text-sm font-semibold text-white disabled:border-black/30 disabled:bg-black/30"
      >
        {saving ? 'Saving…' : 'Save & play'}
      </button>
    </div>
  );
}
