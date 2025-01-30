from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from ebc.models.main_model import MainTableModel
from ebc.schemas.main_table_schema import MainTableCreate


async def create_entry(db: AsyncSession, entry: MainTableCreate) -> MainTableModel:
    """Cria um novo registro na tabela."""
    new_entry = MainTableModel(**entry.model_dump())
    db.add(new_entry)
    await db.commit()
    await db.refresh(new_entry)
    return new_entry


async def get_latest_entry(db: AsyncSession) -> MainTableModel:
    """Obtém o último registro inserido, ordenado pelo timestamp de criação."""
    result = await db.execute(
        select(MainTableModel).order_by(MainTableModel.created_at.desc()).limit(1)
    )
    return result.scalar_one_or_none()


async def get_all_entries(db: AsyncSession):
    """Obtém todos os registros na tabela."""
    result = await db.execute(select(MainTableModel))
    return result.scalars().all()
