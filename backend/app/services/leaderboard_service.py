from sqlalchemy.orm import Session

from app.models.user import User


def get_leaderboard(
    db: Session
):

    users = (
        db.query(User)
        .order_by(
            User.total_score.desc()
        )
        .all()
    )

    result = []

    rank = 1

    for user in users:

        result.append({

            "rank": rank,

            "username": user.username,

            "score": user.total_score
        })

        rank += 1

    return result