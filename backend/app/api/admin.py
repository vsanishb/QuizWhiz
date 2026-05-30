from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from app.core.dependencies import get_db

from app.core.roles import require_admin

from app.schemas.question import (
    QuestionCreate,
    QuestionResponse
)

from app.services.question_service import (
    create_question,
    get_all_questions,
    get_question,
    delete_question
)

router = APIRouter(
    prefix="/api/admin",
    tags=["Admin"]
)


@router.post(
    "/questions",
    response_model=QuestionResponse
)
def create_question_route(
    request: QuestionCreate,
    db: Session = Depends(get_db),
    admin=Depends(require_admin)
):

    return create_question(
        db,
        request
    )


@router.get(
    "/questions",
    response_model=list[QuestionResponse]
)
def list_questions(
    db: Session = Depends(get_db),
    admin=Depends(require_admin)
):

    return get_all_questions(db)


@router.delete(
    "/questions/{question_id}"
)
def delete_question_route(
    question_id: str,
    db: Session = Depends(get_db),
    admin=Depends(require_admin)
):

    question = get_question(
        db,
        question_id
    )

    if not question:

        raise HTTPException(
            status_code=404,
            detail="Question not found"
        )

    delete_question(
        db,
        question
    )

    return {
        "message": "Deleted"
    }