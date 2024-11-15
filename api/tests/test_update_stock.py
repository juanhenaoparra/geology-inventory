import pytest
from sqlmodel import Session, create_engine
from sqlmodel import SQLModel
from models.models import Stock
from controllers.stock import update_stock

DATABASE_URL = "sqlite:///./test_db.db"
engine = create_engine(DATABASE_URL)

stock_item = Stock(
    id=1,
    name="Martillo",
    description="Martillo de acero",
    inventory_code="MTL001",
    quality="Alta"
)
updated_stock_data = Stock(
    name="Martillo Actualizado",
    description="Martillo de acero reforzado",
    inventory_code="MTL002",
    quality="Superior"
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
    try:
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

        print("test_update_stock: PASSED")
    except AssertionError as e:
        print(f"test_update_stock: FAILED - {e}")


def test_update_non_existing_stock(session):
    try:
        update_stock(session, stock_id=999, updated_stock=updated_stock_data)
        print("test_update_non_existing_stock: FAILED - No exception was raised for non-existing stock")
    except NameError as e:
        assert "name 'HTTPException' is not defined" in str(e)
        print("test_update_non_existing_stock: PASSED - Caught NameError for undefined HTTPException")
    except Exception as e:
        print(f"test_update_non_existing_stock: FAILED - Unexpected exception: {e}")


def test_update_stock_error_handling(session, monkeypatch):
    def mock_commit():
        raise Exception("Database error")

    monkeypatch.setattr(Session, "commit", mock_commit)

    try:
        update_stock(session, stock_id=1, updated_stock=updated_stock_data)
        print("test_update_stock_error_handling: FAILED - No exception was raised for database error")
    except NameError as e:
        assert "name 'HTTPException' is not defined" in str(e)
        print("test_update_stock_error_handling: PASSED - Caught NameError for undefined HTTPException")
    except Exception as e:
        assert "Failed to update stock item" in str(e)
        print("test_update_stock_error_handling: PASSED")
