# app/core/roles.py

from fastapi import Depends
from fastapi import HTTPException

from app.core.auth import get_current_user
from app.models.enums import UserRole


def require_admin(
    current_user=Depends(
        get_current_user
    )
):

    if current_user.role != UserRole.ADMIN:

        raise HTTPException(
            status_code=403,
            detail="Admin access required"
        )

    return current_user