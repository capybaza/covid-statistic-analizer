from pydantic import BaseModel
from datetime import date


class CovidBase(BaseModel):
    observationDate: date
    state: str = None
    country: str
    lastUpdate: date
    Confirmed: int
    Recovered: int
    Deaths: int


class CovidCreate(CovidBase):
    pass


class Covid(CovidBase):
    id: int

    class Config:
        orm_mode = True
