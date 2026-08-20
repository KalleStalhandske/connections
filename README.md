# Connections clone

A web app that replicates the New York Times **Connections** game.

Me and my friends really like to play the daily connections. 
This is a simple copy for us to be able to create our own games so that we can challenge eachother.

## Folder layout

```
frontend/              the app (React + TypeScript + Vite + Tailwind + React Router)
  src/
    components/         reusable UI: Tile, Grid, SolvedRow, MistakeDots, NavBar, GroupEditor
    pages/               CreatePage, PlayBrowsePage, GamePage
    store/               GamesProvider (React Context) + useGames hook
    lib/                 gamesRepository (the only data-access point) and gameLogic
                          (pure, framework-free game rules: guess evaluation, shuffle,
                          draft validation)
    types/               shared TypeScript types (ConnectionsGame, ConnectionGroup, ...)
    seed/                sample games used to seed localStorage on first load
backend/                placeholder for Phase 2 (API + database)
```

The `gamesRepository` module is the single boundary between the app and its
data store. It exposes an async interface (`listGames`, `getGame`,
`createGame`) backed by `localStorage` today; swapping it for `fetch` calls
against a real API in Phase 2 should not require touching any component.

## Running the frontend

```bash
cd frontend
npm install
npm run dev
```

Then open the printed local URL. The app redirects `/` to `/play`, where
you'll find a few seeded sample games plus anything you create at `/create`.

Other useful commands (run from `frontend/`):

```bash
npm run build     # type-check and production build
npm run lint      # oxlint
npm run preview   # preview a production build locally
```

## Notes

- All game state lives in the browser's `localStorage` under the
  `connections:games` key — it's per-browser and won't sync across devices
  until Phase 2 adds a backend.

