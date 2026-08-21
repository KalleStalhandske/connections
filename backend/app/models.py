"""
SQLAlchemy ORM models (2.0 typed style). Two tables, related one-to-many:
a Game has exactly 4 Groups, each holding its 4 words as a JSON array.
"""

import uuid
from datetime import datetime, timezone

from sqlalchemy import JSON, DateTime, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .database import Base


def _new_uuid() -> str:
    return str(uuid.uuid4())


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


class Game(Base):
    __tablename__ = "games"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=_new_uuid)
    title: Mapped[str] = mapped_column(String, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_utcnow)

    # One game has many groups; deleting a game deletes its groups too.
    groups: Mapped[list["Group"]] = relationship(
        back_populates="game",
        cascade="all, delete-orphan",
        order_by="Group.id",
    )


class Group(Base):
    __tablename__ = "groups"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    game_id: Mapped[str] = mapped_column(ForeignKey("games.id", ondelete="CASCADE"))
    name: Mapped[str] = mapped_column(String, nullable=False)
    difficulty: Mapped[str] = mapped_column(String, nullable=False)
    # Stored as a JSON array of 4 strings. Works on both SQLite and Postgres,
    # unlike e.g. Postgres-only ARRAY columns.
    words: Mapped[list[str]] = mapped_column(JSON, nullable=False)

    game: Mapped[Game] = relationship(back_populates="groups")
