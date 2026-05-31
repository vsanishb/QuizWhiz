from sqlalchemy.exc import IntegrityError
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

    question = (
        db.query(Question)
        .filter(
            Question.id == question_id
        )
        .first()
    )

    if not question:
        raise ValueError("Question not found")

    existing_submission = get_existing_submission(
        db=db,
        user_id=user.id,
        question_id=question_id
    )

    if existing_submission:
        raise ValueError("Question already attempted")

    is_correct = (
        selected_option.upper()
        == question.correct_option.upper()
    )

    points_awarded = question.points if is_correct else 0

    submission = Submission(
        user_id=user.id,
        question_id=question.id,
        selected_option=selected_option.upper(),
        is_correct=is_correct,
        points_awarded=points_awarded
    )

    db.add(submission)

    user.total_score = (user.total_score or 0) + points_awarded

    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise ValueError("Could not submit answer. Please try again.") from exc

    db.refresh(user)
    db.refresh(submission)

    return {
        "correct": is_correct,
        "points_awarded": points_awarded,
        "total_score": user.total_score
    }


def delete_submission(
    db: Session,
    submission: Submission
):
    """
    Delete a submission and recalculate the user's total score
    by subtracting the points earned from this submission.
    """
    try:
        user = (
            db.query(User)
            .filter(User.id == submission.user_id)
            .first()
        )

        if user:
            user.total_score = max(
                0,
                (user.total_score or 0) - (submission.points_awarded or 0)
            )

        db.delete(submission)
        db.commit()

    except IntegrityError as exc:
        db.rollback()
        raise ValueError("Could not delete submission.") from exc