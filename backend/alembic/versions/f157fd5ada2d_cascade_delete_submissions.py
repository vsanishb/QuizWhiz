"""cascade delete submissions

Revision ID: f157fd5ada2d
Revises: 9eb48729165f
Create Date: 2026-05-31 14:57:19.446809

"""
from typing import Sequence, Union

from alembic import op


# revision identifiers, used by Alembic.
revision: str = "f157fd5ada2d"
down_revision: Union[str, Sequence[str], None] = "9eb48729165f"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.drop_constraint(
        "submissions_question_id_fkey",
        "submissions",
        type_="foreignkey",
    )

    op.create_foreign_key(
        "submissions_question_id_fkey",
        "submissions",
        "questions",
        ["question_id"],
        ["id"],
        ondelete="CASCADE",
    )


def downgrade() -> None:
    op.drop_constraint(
        "submissions_question_id_fkey",
        "submissions",
        type_="foreignkey",
    )

    op.create_foreign_key(
        "submissions_question_id_fkey",
        "submissions",
        "questions",
        ["question_id"],
        ["id"],
    )