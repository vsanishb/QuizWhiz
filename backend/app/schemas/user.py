from pydantic import BaseModel
from pydantic import EmailStr


class UserResponse(BaseModel):

    id: str

    username: str

    email: EmailStr

    role: str

    total_score: int

    class Config:
        from_attributes = True