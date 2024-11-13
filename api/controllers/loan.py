"""Controller for loan history"""

import logging
from sqlmodel import Session, func
from fastapi.encoders import jsonable_encoder
from controllers.exceptions import UserError
from models.models import LoanStock, Loan, User, UserLoan
from sqlalchemy import select
from entities.pagination import Pagination

logger = logging.getLogger(__name__)

def tool_loan_history(session: Session, tool_id: int):
    """Get the loan history for a tool"""
    try:
        tool_loans = session.exec(
            select(Loan).join(LoanStock).where(LoanStock.stock_id == tool_id)
        ).all()
        return [jsonable_encoder(loan[0].dict()) for loan in tool_loans]
    except Exception as exc:
        logger.error("An unexpected error occurred", exc_info=True)
        raise UserError(
            detail="An unexpected error occurred while getting tool loan history."
        ) from exc

def loans(session: Session, page: int = 1, page_size: int = 10):
    """Obtener todos los préstamos paginados"""
    try:
        # Obtener el total de registros
        total = session.query(Loan).count()

        # Obtener los préstamos paginados
        all_loans = session.exec(
            select(Loan, User)
            .join(UserLoan, Loan.id == UserLoan.loan_id)
            .join(User, UserLoan.user_id == User.id)
            .join(LoanStock, Loan.id == LoanStock.loan_id)
            .offset((page - 1) * page_size)
            .limit(page_size)
        ).all()

        # Incluir el nombre del usuario en los préstamos
        loans_with_user = []
        for loan, user in all_loans:
            loan_dict = loan.dict()
            loan_dict["user_name"] = user.name
            loans_with_user.append(loan_dict)

        return Pagination(
            items=loans_with_user,
            total=total,
            page=page,
            page_size=page_size
        )

    except Exception as exc:
        logger.error("Un error inesperado ocurrió", exc_info=True)
        raise UserError(
            detail="Un error inesperado ocurrió al obtener los préstamos."
        ) from exc
