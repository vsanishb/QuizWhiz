from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from app.core.dependencies import get_db

from app.core.auth import get_current_user

from app.schemas.submission import (
    SubmitAnswerRequest,
    SubmissionResponse
)

from app.services.submission_service import (
    submit_answer
)


router = APIRouter(
    prefix="/api/submissions",
    tags=["Submissions"]
)


@router.post(
    "",
    response_model=SubmissionResponse
)
def submit_answer_route(
    request: SubmitAnswerRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    try:

        return submit_answer(
            db=db,
            user=current_user,
            question_id=request.question_id,
            selected_option=request.selected_option
        )

    except ValueError as e:

        raise HTTPException(
            status_code=400,
            detail=str(e)
        )