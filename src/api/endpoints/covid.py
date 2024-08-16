from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
from sqlalchemy.orm import Session
from starlette import status

from src.db.db import get_db
from src.api.handlers.covid.covid_csv_importer import process_csv, covid_manager
from src.db import schemas

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
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Неизвестный тип файла. Загрузите CSV файл.")

    # Вызов функции обработки CSV
    result = process_csv(file, db)

    return result
