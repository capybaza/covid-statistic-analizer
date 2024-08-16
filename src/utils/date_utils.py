from datetime import datetime
import pandas as pd


# Метод парсинга даты
# В БД храним все значения, как дату и время
def parse_date(date_str: str) -> datetime:
    try:
        # Преобразование строки даты в datetime, устанавливая время на начало дня
        return pd.to_datetime(date_str, format='%m/%d/%Y', errors='coerce').replace(hour=0, minute=0, second=0, microsecond=0)
    except Exception as e:
        raise ValueError(f"Date parsing error: {e}")


# Метод парсинга даты и времени
def parse_datetime(date_str: str) -> datetime:
    try:
        # Попытка преобразовать строку даты и времени с несколькими форматами
        for fmt in ('%m/%d/%Y %H:%M', '%Y-%m-%d %H:%M:%S', '%m/%d/%Y %H:%M:%S', '%Y-%m-%d %H:%M'):
            try:
                return pd.to_datetime(date_str, format=fmt, errors='coerce')
            except ValueError:
                continue
        raise ValueError("Неизвестный формат даты")
    except Exception as e:
        raise ValueError(f"Ошибка парсинга даты: {e}")
