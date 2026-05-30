from sqlalchemy.orm import Session

from app.models.question import Question


def create_question(
    db: Session,
    data
):

    question = Question(
        **data.model_dump()
    )

    db.add(question)

    db.commit()

    db.refresh(question)

    return question


def get_all_questions(
    db: Session
):
    return db.query(
        Question
    ).all()


def get_question(
    db: Session,
    question_id: str
):

    return (
        db.query(Question)
        .filter(
            Question.id == question_id
        )
        .first()
    )


def delete_question(
    db: Session,
    question
):

    db.delete(question)

    db.commit()