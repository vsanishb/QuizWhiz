from fastapi import Depends
from fastapi import HTTPException

from fastapi.security import (
    HTTPBearer,
    HTTPAuthorizationCredentials
)

from sqlalchemy.orm import Session

from app.core.dependencies import get_db
from app.core.security import decode_token
from app.models.user import User


security = HTTPBearer()


def get_current_user(

    credentials: HTTPAuthorizationCredentials = Depends(security),

    db: Session = Depends(get_db)

):

    token = credentials.credentials

    payload = decode_token(token)

    if not payload:

        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )

    user = (
        db.query(User)
        .filter(
            User.id == payload["sub"]
        )
        .first()
    )

    if not user:

        raise HTTPException(
            status_code=401,
            detail="User not found"
        )

    return user