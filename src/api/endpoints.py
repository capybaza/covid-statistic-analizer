from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.db import crud, models, schemas
from src.db.db import SessionLocal

from .handlers.covid import router as covid_router

router = APIRouter()

# Подключаем роутер для обработки CSV
router.include_router(covid_router, prefix="/covid", tags=["covid"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/covid/", response_model=schemas.Covid)
def create_covid(covid: schemas.CovidCreate, db: Session = Depends(get_db)):
    return crud.create_covid_case(db=db, covid_case=covid)
