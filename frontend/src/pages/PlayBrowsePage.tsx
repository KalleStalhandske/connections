import { Link } from 'react-router-dom';
import { useGames } from '../store/GamesProvider';

export function PlayBrowsePage() {
  const { games, loading } = useGames();

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Choose a game</h1>
        <Link
          to="/create"
          className="rounded-full border border-black px-4 py-1.5 text-sm font-semibold hover:bg-black hover:text-white"
        >
          + Create a game
        </Link>
      </div>

      {loading && <p className="text-sm text-black/60">Loading games…</p>}

      {!loading && games.length === 0 && (
        <p className="text-sm text-black/60">
          No games yet.{' '}
          <Link to="/create" className="font-semibold underline">
            Create the first one
          </Link>
          .
        </p>
      )}

      <ul className="flex flex-col gap-3">
        {[...games]
          .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
          .map((game) => {
            const wordCount = game.groups.reduce((n, g) => n + g.words.length, 0);
            return (
              <li
                key={game.id}
                className="flex items-center justify-between rounded-lg border border-black/10 px-4 py-3"
              >
                <div>
                  <div className="font-semibold">{game.title}</div>
                  <div className="text-sm text-black/60">{wordCount} words</div>
                </div>
                <Link
                  to={`/play/${game.id}`}
                  className="rounded-full border border-black bg-black px-4 py-1.5 text-sm font-semibold text-white hover:bg-black/80"
                >
                  Play
                </Link>
              </li>
            );
          })}
      </ul>
    </div>
  );
}
