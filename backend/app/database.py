"""
SQLAlchemy engine/session setup. This is the only file that knows how to
connect to the database - models and CRUD code just use `Base` and `get_db`.
"""

from collections.abc import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from .config import settings

# `check_same_thread=False` is only needed for SQLite, since FastAPI can
# handle a request in a different thread than the one that created the
# connection. It's a no-op for other databases (e.g. Postgres), so it's safe
# to leave in place even after switching DATABASE_URL.
connect_args = {"check_same_thread": False} if settings.database_url.startswith("sqlite") else {}

engine = create_engine(settings.database_url, connect_args=connect_args)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    """Base class all SQLAlchemy models inherit from."""


def get_db() -> Generator[Session, None, None]:
    """FastAPI dependency that yields a DB session and always closes it."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
