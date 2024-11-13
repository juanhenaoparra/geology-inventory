
from fastapi import APIRouter, Depends, HTTPException

from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException
from fastapi import Query

from sqlmodel import Session
from typing import List
from controllers.stock import store_stock, update_stock
from controllers.exceptions import UserError, UpdateError
from database import get_session
from models.models import Stock

from controllers.stock import store_stock
from controllers.exceptions import UserError
from controllers.loan import tool_loan_history, loans


router = APIRouter()

tools = [
    {"id": 1, "name": "Martillo", "available": True},
    {"id": 2, "name": "Destornillador", "available": False},
]

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

@router.get("/tools")
def get_tools(session: Session = Depends(get_session)):
    return tools


@router.get("/tools/{tool_id}/loan-history")
def get_tool_loan_history(tool_id: int, session: Session = Depends(get_session)):
    """Get the loan history for a tool"""
    return tool_loan_history(session=session, tool_id=tool_id)

@router.get("/loans")
def get_loans(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    session: Session = Depends(get_session)
):
    """Obtener todos los préstamos"""
    return loans(session=session, page=page, page_size=page_size)


@router.post("/stock")
def post_store_stock(stock: Stock, session: Session = Depends(get_session)):
    try:
        return store_stock(session=session, stock=stock)
    except UserError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")

@router.put("/stocks/{stock_id}")
def put_update_stock(stock_id: int, updated_stock: Stock, session: Session = Depends(get_session)):
    try:
        return update_stock(session=session, stock_id=stock_id, updated_stock=updated_stock)
    except UpdateError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except UserError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")
