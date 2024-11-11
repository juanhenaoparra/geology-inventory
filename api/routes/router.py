from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from pydantic import BaseModel, Field

from database import get_session
from models.models import Stock, User, Loan
from controllers.stock import store_stock
from controllers.exceptions import UserError

router = APIRouter()

# Endpoint de prueba
@router.get("/hello")
def hello():
    return {"Hello": "World"}

# Endpoint para obtener herramientas de la base de datos
@router.get("/tools")
def get_tools(session: Session = Depends(get_session)):
    tools = session.query(Stock).all()
    return tools

# Endpoint para obtener usuarios de la base de datos
@router.get("/users")
def get_users(session: Session = Depends(get_session)):
    users = session.query(User).all()
    return users

# Endpoint para registrar stock (manteniendo el original)
@router.post("/stock")
def post_store_stock(stock: Stock, session: Session = Depends(get_session)):
    try:
        return store_stock(session=session, stock=stock)
    except UserError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")

# Modelo para los datos de préstamo que el frontend enviará con alias
class LoanCreate(BaseModel):
    user_id: int = Field(alias="userId")
    tool_id: int = Field(alias="toolId")
    loan_date: str = Field(alias="loanDate")
    return_date: str = Field(alias="returnDate")
    status: str
    observation: str = None

# Endpoint para registrar un nuevo préstamo
@router.post("/loans")
def create_loan(loan_data: LoanCreate, session: Session = Depends(get_session)):
    new_loan = Loan(
        user_id=loan_data.user_id,
        tool_id=loan_data.tool_id,
        loan_date=loan_data.loan_date,
        return_date=loan_data.return_date,
        status=loan_data.status,
        observation=loan_data.observation
    )
    session.add(new_loan)
    session.commit()
    session.refresh(new_loan)
    return new_loan
