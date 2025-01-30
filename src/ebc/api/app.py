import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from ebc.routes.main_table_router import router
from ebc.scheduler.task import lifespan

app = FastAPI(
    title="Epic Ballad",
    redirect_slashes=False,
    root_path="/",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "*"
    ],  # Permite requisições de qualquer origem (ajuste isso em produção)
    allow_credentials=True,
    allow_methods=["*"],  # Permite todos os métodos (GET, POST, etc.)
    allow_headers=["*"],  # Permite todos os headers
)

routes = [router]

for route in routes:
    app.include_router(router=route)


def run():
    uvicorn.run(app=app, host="0.0.0.0", port=8000, log_level="info", reload=True)


if __name__ == "__main__":
    run()
