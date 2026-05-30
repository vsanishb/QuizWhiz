from sqlalchemy.orm import Session

from app.models.user import User
from app.models.question import Question
from app.models.submission import Submission


def get_existing_submission(
    db: Session,
    user_id: str,
    question_id: str
):
    """
    Check whether the user has already attempted
    the given question.
    """

    return (
        db.query(Submission)
        .filter(
            Submission.user_id == user_id,
            Submission.question_id == question_id
        )
        .first()
    )


def submit_answer(
    db: Session,
    user: User,
    question_id: str,
    selected_option: str
):
    """
    Handles quiz answer submission flow:

    1. Validate question exists
    2. Prevent reattempt
    3. Check correctness
    4. Create submission
    5. Update user score
    6. Return result
    """

    # ----------------------------------
    # Fetch Question
    # ----------------------------------

    question = (
        db.query(Question)
        .filter(
            Question.id == question_id
        )
        .first()
    )

    if not question:
        raise ValueError(
            "Question not found"
        )

    # ----------------------------------
    # Prevent Reattempt
    # ----------------------------------

    existing_submission = get_existing_submission(
        db=db,
        user_id=user.id,
        question_id=question_id
    )

    if existing_submission:
        raise ValueError(
            "Question already attempted"
        )

    # ----------------------------------
    # Evaluate Answer
    # ----------------------------------

    is_correct = (
        selected_option.upper()
        ==
        question.correct_option.upper()
    )

    points_awarded = (
        question.points
        if is_correct
        else 0
    )

    # ----------------------------------
    # Create Submission Record
    # ----------------------------------

    submission = Submission(
        user_id=user.id,
        question_id=question.id,
        selected_option=selected_option.upper(),
        is_correct=is_correct,
        points_awarded=points_awarded
    )

    db.add(submission)

    # ----------------------------------
    # Update User Score
    # ----------------------------------

    user.total_score += points_awarded

    # ----------------------------------
    # Commit Transaction
    # ----------------------------------

    db.commit()

    db.refresh(user)
    db.refresh(submission)

    # ----------------------------------
    # Response
    # ----------------------------------

    return {
        "correct": is_correct,
        "points_awarded": points_awarded,
        "total_score": user.total_score
    }