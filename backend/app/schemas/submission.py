from pydantic import BaseModel


class SubmitAnswerRequest(BaseModel):

    question_id: str

    selected_option: str


class SubmissionResponse(BaseModel):

    correct: bool

    points_awarded: int

    total_score: int