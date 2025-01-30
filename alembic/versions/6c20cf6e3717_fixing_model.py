"""Fixing model

Revision ID: 6c20cf6e3717
Revises: f9fab8a0b3ae
Create Date: 2025-01-30 00:17:48.388025

"""

from typing import Sequence, Union

import sqlalchemy as sa

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "6c20cf6e3717"
down_revision: Union[str, None] = "f9fab8a0b3ae"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column(
        "maintable",
        "staking_holders",
        existing_type=sa.DOUBLE_PRECISION(precision=53),
        type_=sa.Integer(),
        existing_nullable=False,
    )
    op.create_index(
        op.f("ix_maintable_ebc_value"), "maintable", ["ebc_value"], unique=False
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f("ix_maintable_ebc_value"), table_name="maintable")
    op.alter_column(
        "maintable",
        "staking_holders",
        existing_type=sa.Integer(),
        type_=sa.DOUBLE_PRECISION(precision=53),
        existing_nullable=False,
    )
    # ### end Alembic commands ###
