from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException
from sqlmodel import Session

from database import get_session
from models.models import Stock
from controllers.stock import store_stock
from controllers.exceptions import UserError

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


@router.post("/stock")
def post_store_stock(stock: Stock, session: Session = Depends(get_session)):
    try:
        return store_stock(session=session, stock=stock)
    except UserError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")
