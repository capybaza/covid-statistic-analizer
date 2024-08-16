from pydantic import BaseModel
from datetime import datetime


class CovidBase(BaseModel):
    observationDate: datetime
    state: str = None
    country: str
    lastUpdate: datetime
    Confirmed: int
    Recovered: int
    Deaths: int


class CovidCreate(CovidBase):
    pass


class Covid(CovidBase):
    id: int

    class Config:
        orm_mode = True
