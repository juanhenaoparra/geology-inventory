import pytest
from sqlmodel import Session, create_engine
from sqlmodel import SQLModel
from models.models import Stock
from controllers.stock import update_stock
from fastapi import HTTPException

DATABASE_URL = "sqlite:///./test_db.db"
engine = create_engine(DATABASE_URL)

stock_item = Stock(
    id=1,
    name="Martillo",
    description="Martillo de acero",
    inventory_code="MTL001",
    quality="Alta",
)
updated_stock_data = Stock(
    name="Martillo Actualizado",
    description="Martillo de acero reforzado",
    inventory_code="MTL002",
    quality="Superior",
)


@pytest.fixture
def session():
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        session.add(stock_item)
        session.commit()
        yield session
    SQLModel.metadata.drop_all(engine)


def test_update_stock(session):
    updated_stock = update_stock(session, stock_id=1, updated_stock=updated_stock_data)
    assert updated_stock.name == "Martillo Actualizado"
    assert updated_stock.description == "Martillo de acero reforzado"
    assert updated_stock.inventory_code == "MTL002"
    assert updated_stock.quality == "Superior"

    stock_from_db = session.get(Stock, 1)
    assert stock_from_db.name == "Martillo Actualizado"
    assert stock_from_db.description == "Martillo de acero reforzado"
    assert stock_from_db.inventory_code == "MTL002"
    assert stock_from_db.quality == "Superior"


def test_update_non_existing_stock(session):
    with pytest.raises(HTTPException) as exc_info:
        update_stock(session, stock_id=999, updated_stock=updated_stock_data)

    assert exc_info.value.status_code == 404
    assert "Stock item not found" in str(exc_info.value.detail)


def test_update_stock_error_handling(session, monkeypatch):
    def mock_commit():
        raise ValueError("Database error")

    monkeypatch.setattr(Session, "commit", mock_commit)

    with pytest.raises(HTTPException) as exc_info:
        update_stock(session, stock_id=1, updated_stock=updated_stock_data)

    assert exc_info.value.status_code == 404
    assert "Stock item not found" in str(exc_info.value.detail)
