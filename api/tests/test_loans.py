"""Tests para la funcionalidad de préstamos"""

from datetime import datetime
import pytest
from sqlmodel import Session, SQLModel, create_engine
from sqlalchemy.pool import StaticPool
from models.models import Loan, User, UserLoan, LoanStock, Stock
from controllers.loan import loans, create_loan_with_relations, update_loan_status
from models.schemas import LoanCreate, LoanStatusUpdate

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
        role="student",
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
            status=LoanStatusUpdate.Pending.value,
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


def test_create_loan_with_relations(session):
    """Probar la creación de un préstamo con sus relaciones"""
    # Crear datos de prueba
    user = User(name="Test User", email="test@example.com", student_code="ST123")
    stock = Stock(
        name="Hammer",
        description="Heavy-duty hammer",
        inventory_code="HAM001",
        quality="Good",
    )
    session.add(user)
    session.add(stock)
    session.commit()

    # Crear un préstamo
    loan_data = LoanCreate(  # Usar los alias definidos en LoanCreate
        userId=user.id,
        stockId=stock.id,
        loanDate="2024-11-16",
        returnDate="2024-11-20",
        status=LoanStatusUpdate.Pending.value,
        observation="Test loan",
    )
    new_loan = create_loan_with_relations(session=session, loan_data=loan_data)

    # Verificar que el préstamo fue creado
    assert new_loan.id is not None
    assert new_loan.status == LoanStatusUpdate.Pending.value

    # Verificar las relaciones
    user_loan = session.query(UserLoan).filter_by(loan_id=new_loan.id).first()
    assert user_loan.user_id == user.id

    loan_stock = session.query(LoanStock).filter_by(loan_id=new_loan.id).first()
    assert loan_stock.stock_id == stock.id


def test_get_loans_user_info(session, sample_data):
    """Test para probar la información del usuario en los préstamos"""
    result = loans(session=session, user_id=sample_data["user"].id, user_role="student")

    for loan in result.items:
        assert "user_name" in loan
        assert loan["user_name"] == sample_data["user"].name


def test_get_loans_empty_database(session):
    """Test para probar que no haya préstamos en una base de datos vacía"""
    result = loans(session=session, user_id=420, user_role="student")
    assert len(result.items) == 0


def test_update_loan_status(session, sample_data):
    """Test para probar la actualización del estado de un préstamo"""
    loan = update_loan_status(
        session=session,
        loan_id=sample_data["loans"][0].id,
        status=LoanStatusUpdate.Returned.value,
    )
    assert loan.status == LoanStatusUpdate.Returned.value
