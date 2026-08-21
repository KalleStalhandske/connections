# Frontend

React + TypeScript + Vite + Tailwind CSS v4 + React Router. Talks to the
backend API (see `../backend/README.md`) for all game data via
`src/api/games.ts`.

## Setup & run

```bash
npm install
cp .env.example .env   # optional: override VITE_API_URL (default http://localhost:8000)
npm run dev            # start Vite dev server, http://localhost:5173
```

The backend must be running for games to load (see `../backend/README.md`).

## Other commands

```bash
npm run build     # type-check and production build
npm run lint       # oxlint
npm run preview    # preview a production build locally
```
