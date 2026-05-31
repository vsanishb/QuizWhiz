from fastapi import FastAPI
from app.core.config import settings
from sqlalchemy import text
from sqlalchemy.orm import Session
from sqlalchemy import inspect
from app.api.auth import router as auth_router
from fastapi.middleware.cors import CORSMiddleware

from app.core.exceptions import (
    generic_exception_handler
)

from fastapi import Depends

from app.api.admin import router as admin_router
from app.api.questions import router as questions_router

from app.api.submissions import (
    router as submissions_router
)

from app.api.leaderboard import (
    router as leaderboard_router
)



from app.core.dependencies import get_db



app = FastAPI(
    title="QuizWhix API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://quiz-whiz-lovat.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_exception_handler(
    Exception,
    generic_exception_handler
)

app.include_router(auth_router)
app.include_router(admin_router)
app.include_router(questions_router)
app.include_router(
    submissions_router
)
app.include_router(
    leaderboard_router
)




@app.get("/")
def root():
    return {
        "message": "QuizWhix API Running"
    }

@app.get("/health")
def health():
    return {
        "status": "healthy"
    }
