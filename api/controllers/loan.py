"""Controller for loan history"""

import logging
from sqlmodel import Session, func
from fastapi.encoders import jsonable_encoder
from fastapi import HTTPException

from controllers.exceptions import UserError
from models.models import LoanStock, Loan, User, UserLoan
from sqlalchemy import select
from entities.pagination import Pagination
from models.schemas import LoanCreate
from typing import Optional

logger = logging.getLogger(__name__)


def stock_loan_history(session: Session, stock_id: int):
    """Get the loan history for a stock"""
    try:
        stock_loans = session.exec(
            select(Loan).join(LoanStock).where(LoanStock.stock_id == stock_id)
        ).all()
        return [jsonable_encoder(loan.dict()) for loan in stock_loans]
    except Exception as exc:
        logger.error("An unexpected error occurred", exc_info=True)
        raise UserError(
            detail="An unexpected error occurred while getting stock loan history."
        ) from exc


def loans(session: Session, user_id: int, user_role: str, page: int = 1, page_size: int = 10):
    """Obtener préstamos paginados según el rol del usuario."""
    try:
        query = select(Loan, User).join(UserLoan, Loan.id == UserLoan.loan_id).join(User, UserLoan.user_id == User.id)

        if user_role == "student":
            query = query.where(User.id == user_id)

        total = session.exec(select(func.count()).select_from(query.subquery())).scalar()
        all_loans = session.exec(
            query.offset((page - 1) * page_size).limit(page_size)
        ).all()

        loans_with_user = []
        for loan, user in all_loans:
            loan_dict = loan.model_dump()
            loan_dict["user_name"] = user.name
            loans_with_user.append(loan_dict)

        return Pagination(items=loans_with_user, total=total, page=page, page_size=page_size)

    except Exception as exc:
        logger.error("Un error inesperado ocurrió", exc_info=True)
        raise UserError(
            detail="Un error inesperado ocurrió al obtener los préstamos."
        ) from exc



def create_loan_with_relations(session: Session, loan_data: LoanCreate):
    """Crear un préstamo y sus relaciones."""
    try:
        # Crear el préstamo principal en la tabla Loan
        new_loan = Loan(
            loan_date=loan_data.loan_date,
            return_date=loan_data.return_date,
            status=loan_data.status,
            observation=loan_data.observation,
        )
        session.add(new_loan)
        session.commit()
        session.refresh(new_loan)

        # Crear la relación en UserLoan
        user_loan = UserLoan(user_id=loan_data.user_id, loan_id=new_loan.id)
        session.add(user_loan)

        # Crear la relación en LoanStock
        loan_stock = LoanStock(
            stock_id=loan_data.stock_id, loan_id=new_loan.id, status="active"
        )
        session.add(loan_stock)

        # Confirmar todos los cambios
        session.commit()

        return new_loan

    except Exception as exc:
        logger.error("Error al crear el préstamo con relaciones", exc_info=True)
        session.rollback()
        raise HTTPException(
            status_code=500, detail="Error al crear el préstamo con relaciones"
        ) from exc


def update_loan_status(session: Session, loan_id: int, status: str):
    """Actualizar el estado de un préstamo y los stocks relacionados."""
    try:
        loan = session.get(Loan, loan_id)

        if not loan:
            raise HTTPException(status_code=404, detail="Loan not found")
        loan.status = status
        for stock in loan.stocks:
            stock.status = status
        session.commit()
        session.refresh(loan)
        return loan

    except Exception as exc:
        logger.error("Error al actualizar el estado del préstamo", exc_info=True)
        session.rollback()
        raise HTTPException(
            status_code=500, detail="Error al actualizar el estado del préstamo"
        ) from exc
