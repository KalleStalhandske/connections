"""
Database access functions used by the routers. Kept separate from the
routers themselves so the request/response layer stays thin.
"""

from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from . import models, schemas


def list_games(db: Session) -> list[models.Game]:
    stmt = select(models.Game).options(selectinload(models.Game.groups)).order_by(models.Game.created_at)
    return list(db.scalars(stmt).all())


def get_game(db: Session, game_id: str) -> models.Game | None:
    stmt = (
        select(models.Game)
        .options(selectinload(models.Game.groups))
        .where(models.Game.id == game_id)
    )
    return db.scalars(stmt).first()


def create_game(db: Session, game_in: schemas.GameCreate) -> models.Game:
    game = models.Game(
        title=game_in.title,
        groups=[
            models.Group(name=group.name, difficulty=group.difficulty, words=group.words)
            for group in game_in.groups
        ],
    )
    db.add(game)
    db.commit()
    db.refresh(game)
    return game
