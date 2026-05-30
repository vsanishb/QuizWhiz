from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from app.core.dependencies import get_db

from app.services.leaderboard_service import (
    get_leaderboard
)

router = APIRouter(
    prefix="/api/leaderboard",
    tags=["Leaderboard"]
)

@router.get("")
def leaderboard(
    db: Session = Depends(get_db)
):
    return get_leaderboard(db)