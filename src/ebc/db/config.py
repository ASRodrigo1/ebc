from decouple import config
from pydantic import ConfigDict

TEST_MODE = config("TEST_MODE", cast=bool, default=False)
DB_URL = config("PROD_DATABASE_URL") if not TEST_MODE else config("TEST_DATABASE_URL")


class DBConfig(ConfigDict):
    DB_URL: str = DB_URL
    TEST_MODE: bool = TEST_MODE
