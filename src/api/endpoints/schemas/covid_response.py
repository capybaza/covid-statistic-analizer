from pydantic import BaseModel
from typing import List
from src.db.schemas import Covid


# Ответ на запрос получения данных о Covid
class CovidResponse(BaseModel):
    # Количество записей
    total_count: int
    # Записи
    records: List[Covid]
