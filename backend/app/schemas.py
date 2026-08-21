"""
Pydantic v2 request/response schemas.

All models serialise to camelCase (via `alias_generator=to_camel`) so the
JSON matches the frontend's `ConnectionsGame` type exactly - notably
`created_at` -> `createdAt`. `populate_by_name=True` means the Python side
can still be constructed using the snake_case field names.
"""

from datetime import datetime, timezone
from typing import Literal

from pydantic import BaseModel, ConfigDict, field_serializer, field_validator, model_validator
from pydantic.alias_generators import to_camel

Difficulty = Literal["yellow", "green", "blue", "purple"]
DIFFICULTIES: frozenset[str] = frozenset({"yellow", "green", "blue", "purple"})


class CamelModel(BaseModel):
    """Base for every schema below: camelCase JSON in and out."""

    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)


# ---- Output schemas (what the API returns) --------------------------------


class GroupOut(CamelModel):
    name: str
    words: list[str]
    difficulty: Difficulty


class GameOut(CamelModel):
    id: str
    title: str
    groups: list[GroupOut]
    created_at: datetime

    # Read straight from the SQLAlchemy model's attributes.
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)

    @field_serializer("created_at")
    def serialize_created_at(self, value: datetime) -> str:
        # SQLite drops tzinfo on round-trip, so `value` may come back naive.
        # Every timestamp we store is UTC, so treat a naive value as UTC and
        # always render the explicit "Z" offset the frontend's ISO string
        # (and `new Date(...)` parsing) expects.
        if value.tzinfo is None:
            value = value.replace(tzinfo=timezone.utc)
        return value.astimezone(timezone.utc).isoformat().replace("+00:00", "Z")


# ---- Input schemas (what POST /api/games accepts) --------------------------


class GroupCreate(CamelModel):
    name: str
    words: list[str]
    difficulty: Difficulty

    @field_validator("name")
    @classmethod
    def name_not_blank(cls, value: str) -> str:
        trimmed = value.strip()
        if not trimmed:
            raise ValueError("group name must not be blank")
        return trimmed

    @field_validator("words")
    @classmethod
    def exactly_four_nonblank_words(cls, value: list[str]) -> list[str]:
        if len(value) != 4:
            raise ValueError("each group must have exactly 4 words")
        trimmed = [word.strip() for word in value]
        if any(not word for word in trimmed):
            raise ValueError("words must not be blank")
        return trimmed


class GameCreate(CamelModel):
    title: str
    groups: list[GroupCreate]

    @field_validator("title")
    @classmethod
    def title_not_blank(cls, value: str) -> str:
        trimmed = value.strip()
        if not trimmed:
            raise ValueError("title must not be blank")
        return trimmed

    @field_validator("groups")
    @classmethod
    def exactly_four_groups(cls, value: list[GroupCreate]) -> list[GroupCreate]:
        if len(value) != 4:
            raise ValueError("a game must have exactly 4 groups")
        return value

    @model_validator(mode="after")
    def unique_words_and_full_difficulty_set(self) -> "GameCreate":
        # All 16 words across the game must be unique, compared
        # case-insensitively (words are already trimmed by GroupCreate).
        all_words_lower = [word.lower() for group in self.groups for word in group.words]
        if len(all_words_lower) != len(set(all_words_lower)):
            raise ValueError("all 16 words across the game must be unique")

        # Each difficulty colour must be used exactly once.
        difficulties = [group.difficulty for group in self.groups]
        if set(difficulties) != DIFFICULTIES:
            raise ValueError("each difficulty (yellow, green, blue, purple) must be used exactly once")

        return self
