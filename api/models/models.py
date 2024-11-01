from sqlmodel import SQLModel, Field
from typing import Optional


class Stock(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    description: Optional[str]
    inventory_code: str
    quality: str


class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    email: str
    semester: Optional[str]
    career: Optional[str]
    student_code: str
    subject: Optional[str]
    phone: Optional[str]


class UserLoan(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int
    loan_id: int


class Loan(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    loan_date: str
    return_date: str
    status: str
    observation: Optional[str]


class LoanDetail(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    loan_id: int
    stock_id: int
    status: str
