from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
from sqlalchemy.orm import Session
from src.db.db import get_db
from src.api.handlers.covid.covid_csv_importer import process_csv

router = APIRouter()


@router.post("/upload_csv/")
async def upload_csv(file: UploadFile = File(...), db: Session = Depends(get_db)):
    if file.content_type != "text/csv":
        raise HTTPException(status_code=400, detail="Неизвестный тип файла. Загрузите CSV файл.")

    # Вызов функции обработки CSV
    result = process_csv(file, db)

    return result
