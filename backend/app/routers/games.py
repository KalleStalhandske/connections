"""The three /api/games endpoints."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from .. import crud, schemas
from ..database import get_db

router = APIRouter(prefix="/api/games", tags=["games"])


@router.get("", response_model=list[schemas.GameOut])
def list_games(db: Session = Depends(get_db)) -> list[schemas.GameOut]:
    return crud.list_games(db)


@router.get("/{game_id}", response_model=schemas.GameOut)
def get_game(game_id: str, db: Session = Depends(get_db)) -> schemas.GameOut:
    game = crud.get_game(db, game_id)
    if game is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Game not found")
    return game


@router.post("", response_model=schemas.GameOut, status_code=status.HTTP_201_CREATED)
def create_game(game_in: schemas.GameCreate, db: Session = Depends(get_db)) -> schemas.GameOut:
    return crud.create_game(db, game_in)
