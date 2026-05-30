from fastapi import FastAPI
from app.core.config import settings

app = FastAPI(
    title="QuizWhix API",
    version="1.0.0"
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

@app.get("/config-check")
def config_check():
    return {
        "jwt_algorithm": settings.JWT_ALGORITHM
    }