from contextlib import asynccontextmanager

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from fastapi import FastAPI

from ebc.core.staking import get_staking_data
from ebc.core.totals import get_totals_data
from ebc.crud.crud_main_table import create_entry
from ebc.db.dependencies import get_db_session
from ebc.schemas.main_table_schema import MainTableCreate

# Criando scheduler correto para FastAPI
scheduler = AsyncIOScheduler()


async def fetch_and_store_data():
    """Obtém os dados e salva no banco."""
    print("Iniciando `fetch_and_store_data`...")

    # 🔥 Obter os dados em apenas 2 requisições
    totals_data = get_totals_data()
    staking_data = get_staking_data()

    if not totals_data or not staking_data:
        print("ERRO: Falha ao obter dados do scraping.")
        return

    # 🔹 Extrair valores
    staking_dollars = staking_data["staking_dollars"]
    staking_ebc = staking_data["staking_ebc"]
    staking_holders = totals_data["holders"]
    ebc_value = totals_data["ebc_value"]
    market_cap = totals_data["marketcap"]

    print(">>> ", ebc_value)

    # 🔹 Verificação antes de salvar no banco
    if None in [staking_dollars, staking_ebc, staking_holders, ebc_value, market_cap]:
        print("ERRO: Algum dado retornou `None`. Verifique o scraping.")
        return

    async for session in get_db_session():
        entry = MainTableCreate(
            staking_dollars=staking_dollars,
            staking_ebc=staking_ebc,
            staking_holders=staking_holders,
            ebc_value=ebc_value,
            market_cap=market_cap,
        )
        await create_entry(session, entry)


# Agendar a função para rodar a cada 30 minutos (ou menos para testes)
scheduler.add_job(fetch_and_store_data, "interval", minutes=5)


async def start_scheduler():
    """Inicia o APScheduler no ciclo de vida correto do FastAPI."""
    scheduler.start()


async def stop_scheduler():
    """Para o APScheduler no shutdown da API."""
    scheduler.shutdown()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Gerencia o ciclo de vida do aplicativo e inicia o scheduler."""
    await start_scheduler()
    yield
    await stop_scheduler()
