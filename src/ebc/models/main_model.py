from datetime import datetime

from sqlalchemy import DateTime, Float, Integer
from sqlalchemy.orm import Mapped, mapped_column

from ebc.models.base_model import BaseModel


class MainTableModel(BaseModel):

    __tablename__ = "maintable"

    id: Mapped[int] = mapped_column(
        name="id",
        type_=Integer,
        autoincrement=True,
        index=True,
        primary_key=True,
    )
    created_at: Mapped[datetime] = mapped_column(
        name="created_at",
        type_=DateTime(timezone=True),
        default=datetime.now,
    )
    updated_at: Mapped[datetime] = mapped_column(
        name="updated_at",
        type_=DateTime(timezone=True),
        default=datetime.now,
        onupdate=datetime.now,
    )

    staking_dollars: Mapped[float] = mapped_column(
        name="staking_dollars",
        type_=Float,
        nullable=False,
        default=0.0,
    )

    staking_ebc: Mapped[float] = mapped_column(
        name="staking_ebc",
        type_=Float,
        nullable=False,
        default=0.0,
    )

    staking_holders: Mapped[int] = mapped_column(
        name="staking_holders",
        type_=Integer,
        nullable=False,
        default=0.0,
    )

    ebc_value: Mapped[float] = mapped_column(
        name="ebc_value",
        type_=Float,
        nullable=False,
        default=0.0,
        index=True,
    )

    market_cap: Mapped[float] = mapped_column(
        name="market_cap",
        type_=Float,
        nullable=False,
        default=0.0,
    )

    def __repr__(self) -> str:
        return f"<MainTableModel(id={self.id}, ebc_value={self.ebc_value})"
