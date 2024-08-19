from sqlalchemy.orm import Session
from src.db import models, schemas
from datetime import date


# Создание записи Covid
def create_covid_case(db: Session, covid_case: schemas.CovidCreate) -> models.Covid:
    existing_case = get_existing_covid_case(
        db,
        country=covid_case.country,
        state=covid_case.state,
        observation_date=covid_case.observationDate
    )
    # TODO: при ошибки валидации - кидать эксепшен. Эксепшен должен затягиваться импортом
    if existing_case:
        # Запись уже существует, возвращаем её
        return existing_case

    db_covid_case = models.Covid(
        observationDate=covid_case.observationDate,
        state=covid_case.state,
        country=covid_case.country,
        lastUpdate=covid_case.lastUpdate,
        Confirmed=covid_case.Confirmed,
        Recovered=covid_case.Recovered,
        Deaths=covid_case.Deaths
    )

    db.add(db_covid_case)

    return db_covid_case


# Валидация на дублирование записи
# TODO: при ошибки валидации - кидать эксепшен
def get_existing_covid_case(db: Session, country: str, state: str, observation_date: date) -> models.Covid:
    return db.query(models.Covid).filter(
        models.Covid.country == country,
        models.Covid.state == state,
        models.Covid.observationDate == observation_date
    ).first()
