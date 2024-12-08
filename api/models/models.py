from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List


class Stock(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    description: Optional[str]
    inventory_code: str
    quality: str

    loans: List["LoanStock"] = Relationship(back_populates="stock")


class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    email: str
    semester: Optional[str]
    career: Optional[str]
    student_code: Optional[str]
    phone: Optional[str]
    role: Optional[str]
    loans: List["UserLoan"] = Relationship(back_populates="user")


class Loan(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    loan_date: str
    return_date: str
    status: str
    observation: Optional[str]
    subject: Optional[str]
    users: List["UserLoan"] = Relationship(back_populates="loan")
    stocks: List["LoanStock"] = Relationship(back_populates="loan")


class UserLoan(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)

    user_id: Optional[int] = Field(default=None, foreign_key="user.id")
    loan_id: Optional[int] = Field(default=None, foreign_key="loan.id")

    user: Optional[User] = Relationship(back_populates="loans")
    loan: Optional[Loan] = Relationship(back_populates="users")


class LoanStock(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    status: str

    loan_id: Optional[int] = Field(foreign_key="loan.id")
    stock_id: Optional[int] = Field(foreign_key="stock.id")

    loan: Optional[Loan] = Relationship(back_populates="stocks")
    stock: Optional[Stock] = Relationship(back_populates="loans")
