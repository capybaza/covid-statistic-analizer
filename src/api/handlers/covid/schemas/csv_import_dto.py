from pydantic import BaseModel


# Ошибка импорта данных из CSV
class CsvImportErrorDTO(BaseModel):
    # Номер строки
    row_number: int
    # Текст ошибки
    error_message: str
