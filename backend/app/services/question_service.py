from collections import defaultdict

from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models.question import Question
from app.models.submission import Submission
from app.models.user import User


def create_question(db: Session, data):
    question = Question(**data.model_dump())
    db.add(question)

    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise ValueError("Could not create question. Please check the input data.") from exc

    db.refresh(question)
    return question


def get_all_questions(db: Session):
    return db.query(Question).all()


def get_question(db: Session, question_id: str):
    return (
        db.query(Question)
        .filter(Question.id == question_id)
        .first()
    )


def _recalculate_submissions_and_scores_for_question(db: Session, question: Question):
    related_submissions = (
        db.query(Submission)
        .filter(Submission.question_id == question.id)
        .all()
    )

    user_score_deltas = defaultdict(int)

    for submission in related_submissions:
        old_points = submission.points_awarded or 0

        new_is_correct = (
            (submission.selected_option or "").upper()
            == (question.correct_option or "").upper()
        )

        new_points = question.points if new_is_correct else 0

        submission.is_correct = new_is_correct
        submission.points_awarded = new_points

        user_score_deltas[submission.user_id] += new_points - old_points

    for user_id, delta in user_score_deltas.items():
        user = (
            db.query(User)
            .filter(User.id == user_id)
            .first()
        )

        if user:
            user.total_score = max(
                0,
                (user.total_score or 0) + delta
            )


def delete_question(db: Session, question):
    try:
        # Reduce user scores for all submissions tied to this question
        related_submissions = (
            db.query(Submission)
            .filter(Submission.question_id == question.id)
            .all()
        )

        user_score_deltas = defaultdict(int)

        for submission in related_submissions:
            user_score_deltas[submission.user_id] -= submission.points_awarded or 0

        for user_id, delta in user_score_deltas.items():
            user = (
                db.query(User)
                .filter(User.id == user_id)
                .first()
            )

            if user:
                user.total_score = max(
                    0,
                    (user.total_score or 0) + delta
                )

        db.delete(question)
        db.commit()

    except IntegrityError as exc:
        db.rollback()
        raise ValueError(
            "Cannot delete this question because submissions already exist for it."
        ) from exc


def update_question(db: Session, question, data):
    update_data = data.model_dump()

    for key, value in update_data.items():
        setattr(question, key, value)

    try:
        # Recalculate all submissions for this question
        # because correct option or points may have changed
        _recalculate_submissions_and_scores_for_question(db, question)

        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise ValueError("Could not update question. Please check the input data.") from exc

    db.refresh(question)
    return question


def get_unattempted_questions(db: Session, user_id: str):
    attempted_question_ids = (
        db.query(Submission.question_id)
        .filter(Submission.user_id == user_id)
        .all()
    )

    attempted_question_ids = [q[0] for q in attempted_question_ids]

    if not attempted_question_ids:
        return db.query(Question).all()

    return (
        db.query(Question)
        .filter(~Question.id.in_(attempted_question_ids))
        .all()
    )