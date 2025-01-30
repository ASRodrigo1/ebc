from contextlib import asynccontextmanager
from datetime import datetime

from fastapi import APIRouter, Depends, FastAPI, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from ebc.crud.crud_main_table import get_all_entries, get_latest_entry
from ebc.db.dependencies import get_db_session
from ebc.models.main_model import MainTableModel
from ebc.scheduler.task import start_scheduler
from ebc.schemas.main_table_schema import MainTableRead

router = APIRouter()


@router.get("/entries/latest", response_model=MainTableRead)
async def get_latest_main_table_entry(db: AsyncSession = Depends(get_db_session)):
    """Obtém o último registro da tabela."""
    entry = await get_latest_entry(db)
    if not entry:
        raise HTTPException(status_code=404, detail="Nenhum registro encontrado.")
    return entry


@router.get("/entries/", response_model=list[MainTableRead])
async def get_all_main_table_entries(db: AsyncSession = Depends(get_db_session)):
    """Obtém todos os registros da tabela."""
    return await get_all_entries(db)


@router.get("/entries/filter", response_model=list[MainTableRead])
async def get_entries_by_date(
    start_date: str = Query(..., description="Data de início no formato YYYY-MM-DD"),
    end_date: str = Query(..., description="Data de fim no formato YYYY-MM-DD"),
    db: AsyncSession = Depends(get_db_session),
):
    """Obtém registros filtrados por intervalo de datas."""
    start_dt = datetime.strptime(start_date, "%Y-%m-%d")
    end_dt = datetime.strptime(end_date, "%Y-%m-%d")

    result = await db.execute(
        select(MainTableModel).where(
            MainTableModel.created_at >= start_dt, MainTableModel.created_at <= end_dt
        )
    )
    return result.scalars().all()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Gerencia o ciclo de vida da aplicação, iniciando o scheduler."""
    start_scheduler()
    yield  # Permite que o app continue rodando
