from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException
from fastapi import Query
from sqlmodel import Session

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
