from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models.question import Question
from app.models.submission import Submission


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


def delete_question(db: Session, question):
    try:
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