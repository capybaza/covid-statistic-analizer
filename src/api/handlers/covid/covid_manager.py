from sqlalchemy.orm import Session
from src.api.handlers.covid.exceptions.validation_exception import ValidationException
from src.db import models, schemas
from datetime import date
from sqlalchemy.exc import NoResultFound


# Создание записи Covid
def create_covid_case(db: Session, covid_case: schemas.CovidCreate) -> models.Covid:
    validate_covid_case(db, covid_case)

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
    db.commit()
    db.refresh(db_covid_case)

    return db_covid_case


# Обновление записи Covid
def update_covid_case(db: Session, covid_case_id: int, covid_update: schemas.CovidUpdate) -> models.Covid:
    try:
        covid_case = db.query(models.Covid).filter(models.Covid.id == covid_case_id).one()
    except NoResultFound:
        raise NoResultFound(f"Запись не найдена для id {covid_case_id}")

    # Проверка на наличие другой записи с такими же параметрами state, country и observationDate
    new_country = covid_update.country or covid_case.country
    new_state = covid_update.state or covid_case.state
    new_observation_date = covid_update.observationDate or covid_case.observationDate

    existing_case = db.query(models.Covid).filter(
        models.Covid.country == new_country,
        models.Covid.state == new_state,
        models.Covid.observationDate == new_observation_date,
        models.Covid.id != covid_case_id
    ).first()

    if existing_case:
        raise ValidationException(
            f"Запись уже существует для {new_country}, "
            f"{new_state}, "
            f"{new_observation_date}"
        )

    for key, value in covid_update.dict(exclude_unset=True).items():
        setattr(covid_case, key, value)

    db.commit()
    db.refresh(covid_case)

    return covid_case


# Удаление записи Covid
def delete_covid_case(db: Session, country: str, state: str, observation_date: date):
    try:
        covid_case = db.query(models.Covid).filter(
            models.Covid.country == country,
            models.Covid.state == state,
            models.Covid.observationDate == observation_date
        ).one()
    except NoResultFound:
        raise NoResultFound(f"Запись не найдена для {country}, {state}, {observation_date}")

    db.delete(covid_case)
    db.commit()


# Метод валидации
def validate_covid_case(db: Session, covid_case: schemas.CovidCreate):
    existing_case = db.query(models.Covid).filter(
        models.Covid.country == covid_case.country,
        models.Covid.state == covid_case.state,
        models.Covid.observationDate == covid_case.observationDate
    ).first()

    if existing_case:
        raise ValidationException(
            f"Запись уже существует для {covid_case.country}, {covid_case.state}, {covid_case.observationDate}")
