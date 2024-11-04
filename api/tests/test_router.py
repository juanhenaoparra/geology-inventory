import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, SQLModel, create_engine
from sqlalchemy.pool import StaticPool
from fastapi import HTTPException

from routes.router import router

client = TestClient(router)

SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"


@pytest.fixture
def session():
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL,
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        yield session


def test_post_store_stock_success(session):
    test_stock = {
        "name": "hammer",
        "description": "my description",
        "inventory_code": "HM-001",
        "quality": "ok",
    }

    response = client.post("/stock", json=test_stock)

    assert response.status_code == 200
    data = response.json()

    assert "id" in data
    assert "name" in data
    assert "description" in data
    assert "inventory_code" in data
    assert "quality" in data

    assert data["name"] == test_stock["name"]
    assert data["description"] == test_stock["description"]
    assert data["inventory_code"] == test_stock["inventory_code"]
    assert data["quality"] == test_stock["quality"]


def test_post_store_stock_fail_no_name(session):
    test_stock = {
        "description": "my description",
        "inventory_code": "HM-001",
        "quality": "ok",
    }

    with pytest.raises(HTTPException) as exec_error:
        client.post("/stock", json=test_stock)

    assert exec_error.value.status_code == 400
    assert "invalid input data" in str(exec_error.value.detail).lower()


def test_post_store_stock_fail_no_inventory_code(session):
    test_stock = {
        "name": "hammer",
        "description": "my description",
        "quality": "ok",
    }

    with pytest.raises(HTTPException) as exec_error:
        client.post("/stock", json=test_stock)

    assert exec_error.value.status_code == 400
    assert "invalid input data" in str(exec_error.value.detail).lower()
