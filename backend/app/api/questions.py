from fastapi import APIRouter
from fastapi import Depends
from app.services.question_service import (
    get_unattempted_questions
)

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


@router.get(
    "/unattempted",
    response_model=list[QuestionResponse]
)
def unattempted_questions(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return get_unattempted_questions(
        db,
        current_user.id
    )