from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.db import crud, models, schemas
from src.db.db import SessionLocal

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/covid/", response_model=schemas.Covid)
def create_covid(covid: schemas.CovidCreate, db: Session = Depends(get_db)):
    return crud.create_covid_case(db=db, covid_case=covid)


@router.get("/covid/{covid_id}", response_model=schemas.Covid)
def read_covid(covid_id: int, db: Session = Depends(get_db)):
    return crud.get_covid_case_by_id(db=db, case_id=covid_id)
