import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useGames } from '../store/GamesProvider';
import { Grid } from '../components/Grid';
import { MistakeDots } from '../components/MistakeDots';
import { FLIP_DURATION_MS } from '../hooks/useFlip';
import {
  MAX_MISTAKES,
  allWords,
  evaluateGuess,
  sameSelection,
  shuffle,
  sortByDifficulty,
} from '../lib/gameLogic';
import type { ConnectionGroup } from '../types';

type Status = 'playing' | 'won' | 'lost';

export function GamePage() {
  const { id } = useParams<{ id: string }>();
  const { getGame, loading } = useGames();
  const game = id ? getGame(id) : undefined;

  const [unsolvedOrder, setUnsolvedOrder] = useState<string[]>([]);
  const [solvedGroups, setSolvedGroups] = useState<ConnectionGroup[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [message, setMessage] = useState<string | null>(null);
  const [shaking, setShaking] = useState(false);
  const [justSolvedName, setJustSolvedName] = useState<string | null>(null);
  const [lastGuess, setLastGuess] = useState<string[] | null>(null);
  const [inputLocked, setInputLocked] = useState(false);
  // Set the instant a guess is confirmed correct, cleared once that group's
  // tiles finish sliding into place and become its solved-row band.
  const [previewGroup, setPreviewGroup] = useState<ConnectionGroup | null>(null);

  const timeoutsRef = useRef<number[]>([]);
  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach((t) => window.clearTimeout(t));
    };
  }, []);
  function schedule(fn: () => void, ms: number) {
    timeoutsRef.current.push(window.setTimeout(fn, ms));
  }

  // Reset all round state whenever the game being played changes.
  useEffect(() => {
    if (game) {
      setUnsolvedOrder(shuffle(allWords(game)));
      setSolvedGroups([]);
      setSelected([]);
      setMistakes(0);
      setMessage(null);
      setShaking(false);
      setJustSolvedName(null);
      setLastGuess(null);
      setInputLocked(false);
      setPreviewGroup(null);
    }
  }, [game?.id]);

  const status: Status = useMemo(() => {
    if (solvedGroups.length === 4) return 'won';
    if (mistakes >= MAX_MISTAKES) return 'lost';
    return 'playing';
  }, [solvedGroups.length, mistakes]);

  if (!id) return null;

  if (loading) {
    return <div className="mx-auto max-w-xl px-4 py-12 text-center">Loading…</div>;
  }

  if (!game) {
    return (
      <div className="mx-auto max-w-xl px-4 py-12 text-center">
        <p className="mb-4 text-lg font-semibold">Game not found.</p>
        <Link to="/play" className="font-semibold underline">
          Back to games
        </Link>
      </div>
    );
  }

  function toggleWord(word: string) {
    if (status !== 'playing' || inputLocked) return;
    setMessage(null);
    setSelected((prev) => {
      if (prev.includes(word)) return prev.filter((w) => w !== word);
      if (prev.length >= 4) return prev;
      return [...prev, word];
    });
  }

  function handleShuffle() {
    setUnsolvedOrder((prev) => shuffle(prev));
  }

  function handleDeselect() {
    setSelected([]);
    setMessage(null);
  }

  function handleSubmit() {
    if (!game || selected.length !== 4 || status !== 'playing' || inputLocked) return;

    if (lastGuess && sameSelection(lastGuess, selected)) {
      setMessage('Already guessed!');
      return;
    }
    setLastGuess(selected);

    const result = evaluateGuess(game, selected);

    if (result.kind === 'correct') {
      const group = result.group;
      setInputLocked(true);
      setSelected([]);
      // Recolor the guessed tiles and slide them to the front of the
      // unsolved order (where their solved-row band will land) before
      // swapping them for that band, instead of just popping it in.
      setPreviewGroup(group);
      setUnsolvedOrder((prev) => [
        ...prev.filter((w) => group.words.includes(w)),
        ...prev.filter((w) => !group.words.includes(w)),
      ]);
      schedule(() => {
        setSolvedGroups((prev) => [...prev, group]);
        setUnsolvedOrder((prev) => prev.filter((w) => !group.words.includes(w)));
        setPreviewGroup(null);
        setJustSolvedName(group.name);
        setInputLocked(false);
        schedule(() => setJustSolvedName(null), 400);
      }, FLIP_DURATION_MS);
    } else if (result.kind === 'one-away') {
      setMessage('One away…');
      setMistakes((m) => m + 1);
      setInputLocked(true);
      schedule(() => {
        setSelected([]);
        setMessage(null);
        setInputLocked(false);
      }, 1000);
    } else {
      setShaking(true);
      setMistakes((m) => m + 1);
      setInputLocked(true);
      schedule(() => {
        setShaking(false);
        setSelected([]);
        setInputLocked(false);
      }, 500);
    }
  }

  function handlePlayAgain() {
    setUnsolvedOrder(shuffle(allWords(game!)));
    setSolvedGroups([]);
    setSelected([]);
    setMistakes(0);
    setMessage(null);
    setShaking(false);
    setJustSolvedName(null);
    setLastGuess(null);
    setInputLocked(false);
    setPreviewGroup(null);
  }

  const remainingGroups = game.groups.filter(
    (g) => !solvedGroups.some((sg) => sg.name === g.name),
  );
  const displaySolvedGroups =
    status === 'lost' ? [...solvedGroups, ...sortByDifficulty(remainingGroups)] : solvedGroups;
  const displayUnsolvedWords = status === 'lost' ? [] : unsolvedOrder;

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 sm:px-8">
      <div className="mb-4 text-center">
        <h1 className="text-lg font-semibold">{game.title}</h1>
        <p className="text-sm text-black/60">Create four groups of four!</p>
      </div>

      <Grid
        solvedGroups={displaySolvedGroups}
        unsolvedWords={displayUnsolvedWords}
        selectedWords={selected}
        shaking={shaking}
        justSolvedName={justSolvedName}
        previewGroup={previewGroup}
        onToggleWord={toggleWord}
        disabled={status !== 'playing' || inputLocked}
      />

      <div className="mt-4 flex h-6 items-center justify-center text-sm font-semibold">
        {message}
      </div>

      {status === 'playing' && (
        <div className="flex flex-col items-center gap-4">
          <MistakeDots mistakesUsed={mistakes} maxMistakes={MAX_MISTAKES} />
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleShuffle}
              className="rounded-full border border-black px-4 py-2 text-sm font-semibold hover:bg-black/5"
            >
              Shuffle
            </button>
            <button
              type="button"
              onClick={handleDeselect}
              disabled={selected.length === 0}
              className="rounded-full border border-black px-4 py-2 text-sm font-semibold hover:bg-black/5 disabled:opacity-40"
            >
              Deselect all
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={selected.length !== 4 || inputLocked}
              className="rounded-full border border-black bg-black px-4 py-2 text-sm font-semibold text-white disabled:border-black/30 disabled:bg-black/30"
            >
              Submit
            </button>
          </div>
        </div>
      )}

      {status !== 'playing' && (
        <div className="mt-2 flex flex-col items-center gap-3 text-center">
          <p className="text-xl font-bold">
            {status === 'won' ? 'You solved it!' : 'Better luck next time!'}
          </p>
          <p className="text-sm text-black/60">
            Mistakes: {mistakes} / {MAX_MISTAKES}
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handlePlayAgain}
              className="rounded-full border border-black px-4 py-2 text-sm font-semibold hover:bg-black/5"
            >
              Play again
            </button>
            <Link
              to="/play"
              className="rounded-full border border-black bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-black/80"
            >
              Back to games
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
