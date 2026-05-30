from pydantic import BaseModel
from app.models.enums import DifficultyLevel


class QuestionCreate(BaseModel):

    question_text: str

    option_a: str
    option_b: str
    option_c: str
    option_d: str

    correct_option: str

    difficulty: DifficultyLevel

    points: int


class QuestionUpdate(QuestionCreate):
    pass


class QuestionResponse(BaseModel):

    id: str

    question_text: str

    option_a: str
    option_b: str
    option_c: str
    option_d: str

    difficulty: DifficultyLevel

    points: int

    class Config:
        from_attributes = True