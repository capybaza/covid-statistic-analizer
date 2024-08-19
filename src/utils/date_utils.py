from datetime import datetime
from dateutil import parser
from src.utils.exceptions.parse_datetime_exception import ParseDateTimeException


# Метод парсинга даты (только дата без времени)
def parse_date(date_str: str) -> datetime:
    try:
        parsed_date = parser.parse(date_str, fuzzy=False)
        return parsed_date.replace(hour=0, minute=0, second=0, microsecond=0)
    except ValueError:
        raise ParseDateTimeException(f"Ошибка парсинга даты: '{date_str}' не является корректным форматом")


# Метод парсинга даты и времени (дата с временем)
def parse_datetime(date_str: str) -> datetime:
    try:
        return parser.parse(date_str, fuzzy=False)
    except ValueError:
        raise ParseDateTimeException(f"Ошибка парсинга даты и времени: '{date_str}' не является корректным форматом")
