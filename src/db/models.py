from sqlalchemy import (
    Column, Date, DateTime, Enum as PgEnum, ForeignKey, Integer, MetaData, String, Table
)
from sqlalchemy.ext.declarative import declarative_base
from enum import Enum, unique

# SQLAlchemy рекомендует использовать единый формат для генерации названий для
# индексов и внешних ключей.
# https://docs.sqlalchemy.org/en/13/core/constraints.html#configuring-constraint-naming-conventions
convention = {
    'all_column_names': lambda constraint, table: '_'.join([
        column.name for column in constraint.columns.values()
    ]),
    'ix': 'ix__%(table_name)s__%(all_column_names)s',
    'uq': 'uq__%(table_name)s__%(all_column_names)s',
    'ck': 'ck__%(table_name)s__%(constraint_name)s',
    'fk': 'fk__%(table_name)s__%(all_column_names)s__%(referred_table_name)s',
    'pk': 'pk__%(table_name)s'
}

metadata = MetaData(naming_convention=convention)
Base = declarative_base(metadata=metadata)


@unique
class Gender(Enum):
    female = 'female'
    male = 'male'


class Covid(Base):
    __tablename__ = "covid"
    id = Column(Integer, primary_key=True)
    observationDate = Column(DateTime, nullable=False)
    state = Column(String, nullable=True)
    country = Column(String, nullable=False)
    lastUpdate = Column(DateTime, nullable=False)
    Confirmed = Column(Integer, nullable=False)
    Recovered = Column(Integer, nullable=False)
    Deaths = Column(Integer, nullable=False)
