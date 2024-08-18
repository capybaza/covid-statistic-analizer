from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, File, UploadFile, Query
from sqlalchemy.orm import Session
from starlette import status

from src.db.db import get_db
from src.api.handlers.covid.covid_csv_importer import process_csv, covid_manager
from src.db import schemas, models
from .schemas.covid_response import CovidResponse

router = APIRouter()


# Создание записи о Covid-19
@router.post("/covid/create", response_model=schemas.Covid, name="Создание записи о Covid-19.")
def create_covid_case(covid_create: schemas.CovidCreate, db: Session = Depends(get_db)):
    try:
        new_covid_case = covid_manager.create_covid_case(db=db, covid_case=covid_create)
        return new_covid_case
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


# Импорт Ковида из CSV
@router.post("/upload_csv", name="Импорт данных о Covid-19 из CSV файла.")
async def upload_csv(file: UploadFile = File(...), db: Session = Depends(get_db)):
    if file.content_type != "text/csv":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="Неизвестный тип файла. Загрузите CSV файл.")

    # Вызов функции обработки CSV
    result = process_csv(file, db)

    return result


# Получение записей о Covid-19
@router.get("/covid", response_model=CovidResponse, name="Получение записей о Covid-19.")
def get_covid_cases(
        db: Session = Depends(get_db),
        skip: int = Query(0, ge=0, description="Смещение для пагинации"),
        limit: int = Query(10, gt=0, le=100, description="Количество записей на странице"),
        state: Optional[str] = Query(None, description="Фильтр по штату"),
        country: Optional[str] = Query(None, description="Фильтр по стране"),
        min_confirmed: Optional[int] = Query(None, ge=0, description="Минимальное количество подтвержденных случаев"),
        max_confirmed: Optional[int] = Query(None, ge=0, description="Максимальное количество подтвержденных случаев"),
        min_recovered: Optional[int] = Query(None, ge=0, description="Минимальное количество выздоровлений"),
        max_recovered: Optional[int] = Query(None, ge=0, description="Максимальное количество выздоровлений"),
        min_deaths: Optional[int] = Query(None, ge=0, description="Минимальное количество смертей"),
        max_deaths: Optional[int] = Query(None, ge=0, description="Максимальное количество смертей"),
        start_observation_date: Optional[str] = Query(None, description="Начальная дата наблюдения (YYYY-MM-DD)"),
        end_observation_date: Optional[str] = Query(None, description="Конечная дата наблюдения (YYYY-MM-DD)"),
        start_last_update: Optional[str] = Query(None, description="Начальная дата последнего обновления (YYYY-MM-DD)"),
        end_last_update: Optional[str] = Query(None, description="Конечная дата последнего обновления (YYYY-MM-DD)")
):
    query = db.query(models.Covid)

    # Применение фильтров
    if state:
        query = query.filter(models.Covid.state.ilike(f"%{state}%"))
    if country:
        query = query.filter(models.Covid.country.ilike(f"%{country}%"))
    if min_confirmed is not None:
        query = query.filter(models.Covid.Confirmed >= min_confirmed)
    if max_confirmed is not None:
        query = query.filter(models.Covid.Confirmed <= max_confirmed)
    if min_recovered is not None:
        query = query.filter(models.Covid.Recovered >= min_recovered)
    if max_recovered is not None:
        query = query.filter(models.Covid.Recovered <= max_recovered)
    if min_deaths is not None:
        query = query.filter(models.Covid.Deaths >= min_deaths)
    if max_deaths is not None:
        query = query.filter(models.Covid.Deaths <= max_deaths)
    if start_observation_date:
        query = query.filter(models.Covid.observationDate >= start_observation_date)
    if end_observation_date:
        query = query.filter(models.Covid.observationDate <= end_observation_date)
    if start_last_update:
        query = query.filter(models.Covid.lastUpdate >= start_last_update)
    if end_last_update:
        query = query.filter(models.Covid.lastUpdate <= end_last_update)

    # Применение пагинации
    total_count = query.count()  # Общее количество записей
    covid_cases = query.offset(skip).limit(limit).all()

    return {
        "total_count": total_count,
        "records": covid_cases
    }