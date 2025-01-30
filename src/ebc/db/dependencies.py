from typing import AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncSession

from ebc.db.connection import Session


async def get_db_session() -> AsyncGenerator[AsyncSession, None]:
    async with Session() as session:
        try:
            yield session
        except Exception as e:
            await session.rollback()
            raise e
        finally:
            await session.close()
