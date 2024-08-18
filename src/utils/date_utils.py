from datetime import datetime
import pandas as pd
from dateutil import parser


# Метод парсинга даты (только дата без времени)
def parse_date(date_str: str) -> datetime:
    try:
        parsed_date = parser.parse(date_str, fuzzy=False)
        return parsed_date.replace(hour=0, minute=0, second=0, microsecond=0)
    except ValueError:
        raise ValueError(f"Ошибка парсинга даты: '{date_str}' не является корректной датой")


# Метод парсинга даты и времени (дата с временем)
def parse_datetime(date_str: str) -> datetime:
    try:
        return parser.parse(date_str, fuzzy=False)
    except ValueError:
        raise ValueError(f"Ошибка парсинга даты и времени: '{date_str}' не является корректным форматом")
