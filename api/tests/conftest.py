import pytest
from sqlmodel import SQLModel, create_engine, Session
from sqlalchemy.pool import StaticPool
from typing import Generator

# Base de datos en memoria
DATABASE_URL = "sqlite:///:memory:"

@pytest.fixture
def session() -> Generator[Session, None, None]:
    """Crear una base de datos en memoria para los tests."""
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        yield session
    SQLModel.metadata.drop_all(engine)
