import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, SQLModel, create_engine
from sqlalchemy.pool import StaticPool
from fastapi import HTTPException

from routes.stock_router import stock_router

stock_router = TestClient(stock_router)

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
        SQLModel.metadata.drop_all(engine)


def test_post_store_stock_success(session):
    test_stock = {
        "name": "hammer",
        "description": "my description",
        "inventory_code": "HM-001",
        "quality": "ok",
    }

    response = stock_router.post("/", json=test_stock)

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
        stock_router.post("/", json=test_stock)

    assert exec_error.value.status_code == 400
    assert "invalid input data" in str(exec_error.value.detail).lower()


def test_post_store_stock_fail_no_inventory_code(session):
    test_stock = {
        "name": "hammer",
        "description": "my description",
        "quality": "ok",
    }

    with pytest.raises(HTTPException) as exec_error:
        stock_router.post("/", json=test_stock)

    assert exec_error.value.status_code == 400
    assert "invalid input data" in str(exec_error.value.detail).lower()


def test_delete_stock_success(session):
    test_stock = {
        "name": "hammer",
        "description": "my description",
        "inventory_code": "HM-001",
        "quality": "ok",
    }

    response = stock_router.post("/", json=test_stock)
    assert response.status_code == 200

    response = stock_router.delete(f"/{response.json()['id']}")
    assert response.status_code == 200


def test_delete_stock_fail_not_found(session):
    with pytest.raises(HTTPException) as exec_error:
        stock_router.delete("/101")

    assert exec_error.value.status_code == 404
