from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from app.core.auth import get_current_user
from app.schemas.user import UserResponse
from app.models.user import User

from app.core.dependencies import get_db

from app.schemas.auth import RegisterRequest

from app.services.auth_service import create_user

from app.schemas.auth import (
    LoginRequest,
    TokenResponse
)

from app.services.auth_service import (
    authenticate_user
)

from app.core.security import (
    create_access_token
)

router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"]
)


@router.post(
    "/login",
    response_model=TokenResponse
)
def login(
    request: LoginRequest,
    db: Session = Depends(get_db)
):

    user = authenticate_user(
        db=db,
        email=request.email,
        password=request.password
    )

    if not user:

        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )

    token = create_access_token(
        {
            "sub": user.id,
            "role": str(user.role)
        }
    )

    return TokenResponse(
        access_token=token
    )


@router.get(
    "/me",
    response_model=UserResponse
)
def me(
    current_user: User = Depends(
        get_current_user
    )
):
    return current_user

@router.post("/register")
def register(
    request: RegisterRequest,
    db: Session = Depends(get_db)
):

    try:

        user = create_user(
            db=db,
            username=request.username,
            email=request.email,
            password=request.password
        )

        return {
            "message": "User registered",
            "user_id": user.id
        }

    except ValueError as e:

        raise HTTPException(
            status_code=400,
            detail=str(e)
        )