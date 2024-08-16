from fastapi import APIRouter, Depends
from src.db.db import SessionLocal

from .endpoints.covid import router as covid_router

router = APIRouter()

# Подключаем роутер для обработки CSV
router.include_router(covid_router, prefix="/covid", tags=["Covid"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()