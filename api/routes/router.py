from fastapi import APIRouter
from fastapi import Depends
from sqlmodel import Session
from database import get_session

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
