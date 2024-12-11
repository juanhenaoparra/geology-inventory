"""Test para la función loans del módulo loan.py"""

from datetime import datetime
import pytest
from sqlmodel import Session, SQLModel, create_engine
from sqlalchemy.pool import StaticPool
from models.models import Loan, User, UserLoan, LoanStock, Stock
from controllers.loan import loans

# Configuración de la base de datos de prueba
DATABASE_URL = "sqlite:///:memory:"


@pytest.fixture
def session():
    """Fixture para crear una sesión de base de datos en memoria"""

    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    SQLModel.metadata.create_all(engine)
    with Session(engine) as db_session:
        yield db_session
    SQLModel.metadata.drop_all(engine)


@pytest.fixture
def sample_data(session):
    """Fixture para crear datos de prueba"""

    # Crear usuario de prueba
    user = User(
        name="Juan Pérez",
        email="juan@test.com",
        student_code="ST001",
        semester="3",
        career="Ingeniería",
    )
    session.add(user)
    session.commit()

    # Crear stock de prueba
    stock = Stock(
        name="Martillo",
        description="Martillo de prueba",
        inventory_code="MT001",
        quality="Buena",
    )
    session.add(stock)
    session.commit()

    # Crear préstamos de prueba
    loans_data = []
    for i in range(3):
        loan = Loan(
            loan_date=datetime.now().strftime("%Y-%m-%d"),
            return_date=(datetime.now()).strftime("%Y-%m-%d"),
            status="activo",
            observation=f"Préstamo de prueba {i+1}",
        )
        session.add(loan)
        session.commit()

        # Crear relaciones
        user_loan = UserLoan(user_id=user.id, loan_id=loan.id)
        loan_stock = LoanStock(stock_id=stock.id, loan_id=loan.id, status="active")

        session.add(user_loan)
        session.add(loan_stock)
        session.commit()

        loans_data.append(loan)

    return {"user": user, "stock": stock, "loans": loans_data}


def test_get_loans_pagination(session, sample_data):
    """Test para probar la paginación de préstamos"""

    # Probar primera página
    result = loans(
        session=session,
        user_id=sample_data["user"].id,
        user_role="student",
        page=1,
        page_size=2,
    )

    assert len(result.items) == 2
    assert result.total == 3
    assert result.page == 1
    assert result.page_size == 2
    assert result.has_next is True
    assert result.has_prev is False

    # Probar segunda página
    result = loans(
        session=session,
        user_id=sample_data["user"].id,
        user_role="student",
        page=2,
        page_size=2,
    )

    assert len(result.items) == 1
    assert result.total == 3
    assert result.page == 2
    assert result.has_next is False
    assert result.has_prev is True


def test_get_loans_user_info(session, sample_data):
    """Test para probar la información del usuario en los préstamos"""

    result = loans(
        session=session,
        user_id=sample_data["user"].id,
        user_role="student",
        page=1,
        page_size=10,
    )

    for loan in result.items:
        assert "user_name" in loan
        assert loan["user_name"] == "Juan Pérez"


def test_get_loans_empty_database(session):
    """Test para probar que no haya préstamos en una base de datos vacía"""

    result = loans(
        session=session,
        user_id=sample_data["user"].id,
        user_role="student",
        page=1,
        page_size=10,
    )

    assert len(result.items) == 0
    assert result.total == 0
    assert result.has_next is False
    assert result.has_prev is False


def test_get_loans_invalid_page(session, sample_data):
    """Test para probar que no haya préstamos en una página inválida"""

    result = loans(
        session=session,
        user_id=sample_data["user"].id,
        user_role="student",
        page=999,
        page_size=10,
    )

    assert len(result.items) == 0
    assert result.total == 3
