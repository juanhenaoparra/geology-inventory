# schemas.py
from pydantic import BaseModel, Field
from typing import Optional
from enum import Enum


class LoanStatusUpdate(str, Enum):
    Pending = "pendiente"
    Returned = "devuelto"


class LoanCreate(BaseModel):
    user_id: int = Field(alias="userId")
    stock_id: int = Field(alias="stockId")
    loan_date: str = Field(alias="loanDate")
    return_date: str = Field(alias="returnDate")
    status: str = Field(default=LoanStatusUpdate.Pending.value)
    observation: Optional[str] = None

class UserCreate(BaseModel):
    name: str
    email: str
