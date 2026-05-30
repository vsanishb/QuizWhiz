from uuid import uuid4
from datetime import datetime

from sqlalchemy import Enum

from app.models.enums import DifficultyLevel

from sqlalchemy import String
from sqlalchemy import Integer
from sqlalchemy import DateTime

from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column

from app.db.database import Base


class Question(Base):

    __tablename__ = "questions"

    id: Mapped[str] = mapped_column(
        String,
        primary_key=True,
        default=lambda: str(uuid4())
    )

    question_text: Mapped[str] = mapped_column(
        String(1000)
    )

    option_a: Mapped[str] = mapped_column(
        String(255)
    )

    option_b: Mapped[str] = mapped_column(
        String(255)
    )

    option_c: Mapped[str] = mapped_column(
        String(255)
    )

    option_d: Mapped[str] = mapped_column(
        String(255)
    )

    correct_option: Mapped[str] = mapped_column(
    String(1),
    nullable=False
)

    difficulty: Mapped[DifficultyLevel] = mapped_column(
    Enum(DifficultyLevel),
    nullable=False
)

    points: Mapped[int] = mapped_column(
        Integer
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow
    )