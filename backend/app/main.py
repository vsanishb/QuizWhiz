# app/main.py

from fastapi import FastAPI

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