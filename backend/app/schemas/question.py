from pydantic import BaseModel
from app.models.enums import DifficultyLevel


class QuestionBase(BaseModel):
    question_text: str
    option_a: str
    option_b: str
    option_c: str
    option_d: str
    difficulty: DifficultyLevel
    points: int


class QuestionCreate(QuestionBase):
    correct_option: str


class QuestionUpdate(QuestionCreate):
    pass


class QuestionResponse(QuestionBase):
    id: str

    class Config:
        from_attributes = True


class AdminQuestionResponse(QuestionResponse):
    correct_option: str