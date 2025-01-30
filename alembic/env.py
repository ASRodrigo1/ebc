from logging.config import fileConfig

from decouple import config as config_decouple
from sqlalchemy import create_engine

from alembic import context
from ebc.models.base_model import BaseModel

# Alembic Config object, providing access to the .ini file in use.
config = context.config

# Find .env file
config_decouple._find_file("../")

# Load environment variables
TEST_MODE = config_decouple("TEST_MODE", cast=bool)
DB_URL = (
    config_decouple("PROD_DATABASE_URL")
    if not TEST_MODE
    else config_decouple("TEST_DATABASE_URL")
)

# Set DB URL for sqlalchemy (although it's for sync, Alembic requires this to be set)
config.set_main_option("sqlalchemy.url", DB_URL)

# Interpret the config file for Python logging.
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Add your model's MetaData object here for 'autogenerate' support
target_metadata = BaseModel.metadata

# Async engine creation
sync_engine = create_engine(DB_URL.replace("postgresql+asyncpg", "postgresql+psycopg2"))


# Migration in offline mode
def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode.

    Configures the context with just a URL, no Engine.
    Calls to context.execute() here emit the given string to the script output.
    """
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


# Migration in online mode
def run_migrations_online() -> None:
    """Executa as migrações em modo online usando engine síncrona."""
    with sync_engine.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)
        with context.begin_transaction():
            context.run_migrations()


# Helper to configure and run migrations
def do_run_migrations(connection):
    context.configure(connection=connection, target_metadata=target_metadata)

    with context.begin_transaction():
        context.run_migrations()


# Main entry point to run migrations
def run_migrations() -> None:
    """Determine if migrations should run in 'offline' or 'online' mode."""
    if context.is_offline_mode():
        run_migrations_offline()
    else:
        run_migrations_online()


run_migrations()
