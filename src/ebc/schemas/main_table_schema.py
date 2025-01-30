from datetime import datetime

from pydantic import BaseModel, Field


# Schema para Criar Registro (Entrada)
class MainTableCreate(BaseModel):
    staking_dollars: float = Field(..., example=10000.50)
    staking_ebc: float = Field(..., example=500000.0)
    staking_holders: int = Field(..., example=2000)
    ebc_value: float = Field(..., example=0.2456)
    market_cap: float = Field(..., example=300000000.00)


# Schema para Leitura (Saída)
class MainTableRead(MainTableCreate):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True  # Permite conversão de SQLAlchemy para Pydantic
