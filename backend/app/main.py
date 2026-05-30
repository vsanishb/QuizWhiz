from fastapi import FastAPI
from app.core.config import settings
from sqlalchemy import text
from sqlalchemy.orm import Session
from sqlalchemy import inspect
from app.api.auth import router as auth_router

from fastapi import Depends

from app.core.dependencies import get_db



app = FastAPI(
    title="QuizWhix API",
    version="1.0.0"
)

app.include_router(auth_router)

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

@app.get("/config-check")
def config_check():
    return {
        "jwt_algorithm": settings.JWT_ALGORITHM
    }

@app.get("/db-check")
def db_check(
    db: Session = Depends(get_db)
):

    result = db.execute(
        text("SELECT 1")
    )

    return {
        "database": "connected",
        "result": result.scalar()
    }

@app.get("/tables")
def get_tables(
    db: Session = Depends(get_db)
):

    inspector = inspect(db.bind)

    return {
        "tables": inspector.get_table_names()
    }