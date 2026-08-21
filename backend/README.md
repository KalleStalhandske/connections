# Backend

FastAPI + SQLAlchemy 2.0 + Pydantic v2 API storing games in SQLite. JSON is
camelCase to match the frontend's `ConnectionsGame` type exactly.

## Setup & run

```bash
python3 -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env              # optional: override DATABASE_URL / CORS_ORIGINS
uvicorn app.main:app --reload --port 8000
```

- Docs: `http://localhost:8000/docs`
- `connections.db` (SQLite) is created and seeded with sample games
  automatically on first run.

## Endpoints

| Method | Path              | Description                                     |
| ------ | ----------------- | ------------------------------------------------ |
| GET    | `/api/games`       | List all games (with nested groups)              |
| GET    | `/api/games/{id}`  | Get one game, or `404`                           |
| POST   | `/api/games`       | Create a game (server assigns `id`/`createdAt`)  |
