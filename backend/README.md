# Connections backend

FastAPI + SQLAlchemy 2.0 + Pydantic v2 API backing the Connections clone.
Stores games in SQLite (via SQLAlchemy, so swapping to Postgres later is just
a `DATABASE_URL` change - see "Postgres later" below).

## Setup

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env              # optional: override DATABASE_URL / CORS_ORIGINS
```

## Run

```bash
uvicorn app.main:app --reload --port 8000
```

- API base URL: `http://localhost:8000`
- Interactive docs (Swagger UI): `http://localhost:8000/docs`
- On first run, `connections.db` (SQLite) is created automatically in
  `backend/` and seeded with a few sample games. The seed never overwrites
  existing rows, so it only fires once.

## Endpoints

All prefixed with `/api`:

| Method | Path              | Description                                   |
| ------ | ----------------- | ---------------------------------------------- |
| GET    | `/api/games`       | List all games (with nested groups)            |
| GET    | `/api/games/{id}`  | Get one game, or `404` if it doesn't exist      |
| POST   | `/api/games`       | Create a game (server assigns `id`/`createdAt`) |

JSON is camelCase to match the frontend's `ConnectionsGame` type exactly
(e.g. `createdAt`, not `created_at`).

## Project layout

```
app/
  main.py            # FastAPI app: CORS, router, create tables + seed on startup
  config.py          # Settings (DATABASE_URL, CORS origins) via pydantic-settings
  database.py        # engine, SessionLocal, Base, get_db() dependency
  models.py          # SQLAlchemy models: Game, Group
  schemas.py         # Pydantic models (camelCase JSON): GameOut, GroupOut, GameCreate, GroupCreate
  crud.py            # list_games, get_game, create_game
  seed.py            # insert sample games if the table is empty
  routers/games.py   # the three endpoints
```

## Postgres later

Nothing in `models.py` or the routers is SQLite-specific. To switch:

1. Set `DATABASE_URL=postgresql+psycopg://user:pass@host/dbname` (in `.env`).
2. `pip install "psycopg[binary]"` and add it to `requirements.txt`.
3. Eventually introduce a migrations tool (e.g. Alembic) instead of relying
   on `Base.metadata.create_all`.

The `Group.words` column uses SQLAlchemy's generic `JSON` type specifically
because it works on both SQLite and Postgres.

## Tests

There is no test suite yet.
