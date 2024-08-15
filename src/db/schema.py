from enum import Enum, unique

from sqlalchemy import (
    Column, Date, Enum as PgEnum, ForeignKey, ForeignKeyConstraint, Integer,
    MetaData, String, Table,
)


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


@unique
class Gender(Enum):
    female = 'female'
    male = 'male'


covid_table = Table(
    "covid",
    metadata,
    Column('id', Integer, primary_key=True),
    Column('observationDate', Date, nullable=False),
    Column('state', String, nullable=True),
    Column('country', String, nullable=False),
    Column('lastUpdate', Date, nullable=False),
    Column('Confirmed', Integer, nullable=False),
    Column('Recovered', Integer, nullable=False),
    Column('Deaths', Integer, nullable=False)
)