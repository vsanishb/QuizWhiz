from fastapi import APIRouter
from fastapi import Depends

from app.core.auth import get_current_user

router = APIRouter(
    prefix="/api/users",
    tags=["Users"]
)


@router.get("/dashboard")
def dashboard(
    current_user=Depends(
        get_current_user
    )
):

    return {
        "username": current_user.username,
        "score": current_user.total_score
    }