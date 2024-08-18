from pydantic import BaseModel
from typing import List
from src.db.schemas import Covid


class CovidResponse(BaseModel):
    total_count: int
    records: List[Covid]
