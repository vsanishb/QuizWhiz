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


from app.core.security import verify_password
from app.models.user import User


def authenticate_user(
    db: Session,
    email: str,
    password: str
):

    user = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )

    if not user:
        return None

    if not verify_password(
        password,
        user.password_hash
    ):
        return None

    return user