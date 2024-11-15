from fastapi import APIRouter, Depends, HTTPException
from fastapi import Query
from sqlmodel import Session
from typing import List
from controllers.stock import store_stock, update_stock, remove_stock
from controllers.exceptions import UserError, UpdateErrorfrom
from pydantic import BaseModel, Field

from database import get_session
from models.models import Stock, User, Loan

from controllers.loan import tool_loan_history, loans


router = APIRouter()

# Endpoint de prueba
@router.get("/hello")
def hello():
    return {"Hello": "World"}


@router.get("/stocks", response_model=List[Stock])
def get_stocks(session: Session = Depends(get_session)):
    stocks = session.query(Stock).all()
    return stocks


@router.get("/stocks/{stock_id}", response_model=Stock)
def get_stock_by_id(stock_id: int, session: Session = Depends(get_session)):
    stock = session.query(Stock).filter(Stock.id == stock_id).first()
    if not stock:
        raise HTTPException(status_code=404, detail="Stock item not found")
    return stock


# Endpoint para obtener herramientas de la base de datos
@router.get("/tools")
def get_tools(session: Session = Depends(get_session)):
    tools = session.query(Stock).all()
    return tools


@router.get("/tools/{tool_id}/loan-history")
def get_tool_loan_history(tool_id: int, session: Session = Depends(get_session)):
    """Get the loan history for a tool"""
    return tool_loan_history(session=session, tool_id=tool_id)


@router.get("/loans")
def get_loans(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    session: Session = Depends(get_session),
):
    """Obtener todos los préstamos"""
    return loans(session=session, page=page, page_size=page_size)

# Endpoint para obtener usuarios de la base de datos
@router.get("/users")
def get_users(session: Session = Depends(get_session)):
    users = session.query(User).all()
    return users

@router.get("/tools/{tool_id}/loan-history")
def get_tool_loan_history(tool_id: int, session: Session = Depends(get_session)):
    """Get the loan history for a tool"""
    return tool_loan_history(session=session, tool_id=tool_id)


@router.get("/loans")
def get_loans(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    session: Session = Depends(get_session),
):
    """Obtener todos los préstamos"""
    return loans(session=session, page=page, page_size=page_size)

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


@router.put("/stocks/{stock_id}")
def put_update_stock(
    stock_id: int, updated_stock: Stock, session: Session = Depends(get_session)
):
    try:
        return update_stock(
            session=session, stock_id=stock_id, updated_stock=updated_stock
        )
    except UpdateError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except UserError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")


@router.delete("/stocks/{stock_id}")
def delete_stock(stock_id: int, session: Session = Depends(get_session)):
    try:
        return remove_stock(session=session, stock_id=stock_id)
    except HTTPException as err:
        raise err
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
