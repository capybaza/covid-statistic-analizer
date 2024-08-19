from typing import List
import pandas as pd
from sqlalchemy.orm import Session
from fastapi import HTTPException
from datetime import datetime
from src.db import schemas
from . import covid_manager
from src.utils.date_utils import parse_date, parse_datetime
from .schemas.csv_import_dto import CsvImportErrorDTO


# Парсинг и импорт CSV фала со статистикой Covid
def process_csv(file, db: Session) -> dict:
    errors: List[CsvImportErrorDTO] = []
    successful_rows = 0

    try:
        # Чтение CSV файла в DataFrame
        df = pd.read_csv(file.file)

        # Маппинг названий столбцов из CSV на поля модели
        column_mapping = {
            'ObservationDate': 'observationDate',
            'Province/State': 'state',
            'Country/Region': 'country',
            'Last Update': 'lastUpdate',
            'Confirmed': 'Confirmed',
            'Deaths': 'Deaths',
            'Recovered': 'Recovered'
        }

        # Пропускаем столбец 'SNo' (в БД есть id)
        if 'SNo' in df.columns:
            df = df.drop(columns=['SNo'])

        # Переименование столбцов для соответствия модели
        df = df.rename(columns=column_mapping)

        # Преобразование форматов дат
        df['observationDate'] = df['observationDate'].apply(lambda x: parse_date(x) if pd.notna(x) else None)
        df['lastUpdate'] = df['lastUpdate'].apply(lambda x: parse_datetime(x) if pd.notna(x) else datetime.now())

        # Обработка и валидизация данных
        required_columns = ['observationDate', 'state', 'country', 'lastUpdate', 'Confirmed', 'Recovered', 'Deaths']
        for col in required_columns:
            if col not in df.columns:
                raise HTTPException(status_code=400, detail=f"Не найден столбец: {col}")

        # Начало транзакции
        with db.begin():
            for index, row in df.iterrows():
                try:
                    # Проверка корректности даты
                    if pd.isna(row['observationDate']) or pd.isna(row['lastUpdate']):
                        errors.append(CsvImportErrorDTO(
                            row_number=index + 1,
                            error_message="Некорректные значения даты"
                        ))
                        continue

                    # Если поле 'state' пустое, то записываем 'Unknown'
                    state = row['state'] if pd.notna(row['state']) and row['state'] != '' else 'Unknown'

                    # Преобразование даты и времени
                    observationDate = row['observationDate']
                    lastUpdate = row['lastUpdate']

                    # Создание объекта CovidCreate
                    covid_case = schemas.CovidCreate(
                        observationDate=observationDate,
                        state=state,
                        country=row['country'],
                        lastUpdate=lastUpdate,
                        Confirmed=row['Confirmed'],
                        Recovered=row['Recovered'],
                        Deaths=row['Deaths']
                    )

                    # Проверка наличия существующего случая
                    existing_case = covid_manager.get_existing_covid_case(db, row['country'], state, observationDate)
                    if existing_case:
                        # Если запись уже существует, добавляем ошибку
                        # TODO: должны пробрасывать из менеджера
                        errors.append(CsvImportErrorDTO(
                            row_number=index + 1,
                            error_message=f"Запись с данными {row['country']} {state} {observationDate} уже существует"
                        ))
                        continue

                    # Создание новой записи
                    covid_manager.create_covid_case(db, covid_case)
                    successful_rows += 1

                except Exception as ex:
                    # Записываем ошибку для данной строки
                    errors.append(CsvImportErrorDTO(
                        row_number=index + 1,
                        error_message=str(ex)
                    ))

        # Завершение транзакции
        db.commit()

        return {"message": f"CSV файл успешно обработан. Успешно обработано {successful_rows} строк. "
                           f"Ошибок {len(errors)}", "errors": errors}

    except Exception as ex:
        # В случае глобальной ошибки
        db.rollback()
        raise HTTPException(status_code=500, detail=str(ex))
