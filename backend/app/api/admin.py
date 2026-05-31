from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status
)

from sqlalchemy.orm import Session

from app.core.dependencies import get_db
from app.core.roles import require_admin

from app.schemas.question import (
    QuestionCreate,
    QuestionUpdate,
    QuestionResponse
)

from app.services.question_service import (
    create_question,
    get_all_questions,
    get_question,
    delete_question,
    update_question
)

router = APIRouter(
    prefix="/api/admin",
    tags=["Admin"]
)


@router.post(
    "/questions",
    response_model=QuestionResponse,
    status_code=status.HTTP_201_CREATED
)
def create_question_route(
    request: QuestionCreate,
    admin=Depends(require_admin),
    db: Session = Depends(get_db)
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
    admin=Depends(require_admin),
    db: Session = Depends(get_db)
):
    return get_all_questions(db)


@router.put(
    "/questions/{question_id}",
    response_model=QuestionResponse
)
def update_question_route(
    question_id: str,
    request: QuestionUpdate,
    admin=Depends(require_admin),
    db: Session = Depends(get_db)
):
    question = get_question(
        db,
        question_id
    )

    if not question:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Question not found"
        )

    return update_question(
        db,
        question,
        request
    )


@router.delete(
    "/questions/{question_id}",
    status_code=status.HTTP_200_OK
)
def delete_question_route(
    question_id: str,
    admin=Depends(require_admin),
    db: Session = Depends(get_db)
):
    question = get_question(
        db,
        question_id
    )

    if not question:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Question not found"
        )

    delete_question(
        db,
        question
    )

    return {
        "success": True,
        "message": "Question deleted successfully"
    }