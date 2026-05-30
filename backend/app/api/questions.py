from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from app.core.dependencies import get_db

from app.core.auth import get_current_user

from app.schemas.question import (
    QuestionResponse
)

from app.services.question_service import (
    get_all_questions
)


router = APIRouter(
    prefix="/api/questions",
    tags=["Questions"]
)

@router.get(
    "",
    response_model=list[QuestionResponse]
)
def questions(
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):

    return get_all_questions(db)