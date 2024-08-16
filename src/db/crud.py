from sqlalchemy.orm import Session
from src.db import models


def get_covid_cases(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Covid).offset(skip).limit(limit).all()


def create_covid_case(db: Session, covid_case: models.Covid):
    db.add(covid_case)
    db.commit()
    db.refresh(covid_case)
    return covid_case


def get_covid_case_by_id(db: Session, case_id: int):
    return db.query(models.Covid).filter(models.Covid.id == case_id).first()
