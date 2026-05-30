from sqlalchemy.orm import Session

from app.models.user import User
from app.core.security import hash_password


def create_user(
    db: Session,
    username: str,
    email: str,
    password: str
):

    existing_user = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )

    if existing_user:
        raise ValueError(
            "Email already registered"
        )

    user = User(
        username=username,
        email=email,
        password_hash=hash_password(password)
    )

    db.add(user)

    db.commit()

    db.refresh(user)

    return user