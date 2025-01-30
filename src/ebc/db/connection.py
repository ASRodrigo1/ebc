from sqlalchemy.ext.asyncio import AsyncEngine, AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker

from ebc.db.config import DBConfig

# Determine whether to log SQL queries based on environment
echo_value = True if DBConfig.TEST_MODE else False

# Create an asynchronous database engine
async_engine: AsyncEngine = create_async_engine(
    url=DBConfig.DB_URL,
    echo=echo_value,
    future=True,
    pool_size=50,
    max_overflow=20,
)

# Create an asynchronous session factory
Session: AsyncSession = sessionmaker(
    autocommit=False,
    autoflush=False,
    expire_on_commit=False,
    class_=AsyncSession,
    bind=async_engine,
)
