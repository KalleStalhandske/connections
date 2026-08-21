"""
FastAPI application entrypoint. Wires up CORS, creates tables (no Alembic in
this phase - see the "Note on Postgres" in the backend prompt), seeds sample
games if the database is empty, and mounts the games router.
"""

from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .database import Base, SessionLocal, engine
from .routers import games
from .seed import seed_if_empty


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    # Startup: create tables if they don't exist yet, then seed sample games
    # if the table is empty. Nothing to do on shutdown.
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_if_empty(db)
    finally:
        db.close()
    yield


app = FastAPI(title="Connections API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(games.router)
