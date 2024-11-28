# schemas.py
from pydantic import BaseModel, Field
from typing import Optional

class LoanCreate(BaseModel):
    user_id: int = Field(alias="userId")
    stock_id: int = Field(alias="stockId")
    loan_date: str = Field(alias="loanDate")
    return_date: str = Field(alias="returnDate")
    status: str
    observation: Optional[str] = None

class UserCreate(BaseModel):
    name: str
    email: str
    student_code: str
