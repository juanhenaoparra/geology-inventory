"""Controller for loan history"""

import logging
from sqlmodel import Session, func
from fastapi.encoders import jsonable_encoder
from controllers.exceptions import UserError
from models.models import LoanStock, Loan, User, UserLoan
from sqlalchemy import select
from entities.pagination import Pagination
from models.schemas import LoanCreate

logger = logging.getLogger(__name__)

def stock_loan_history(session: Session, stock_id: int):
    """Get the loan history for a stock"""
    try:
        stock_loans = session.exec(
            select(Loan).join(LoanStock).where(LoanStock.stock_id == stock_id)
        ).all()
        return [jsonable_encoder(loan[0].dict()) for loan in stock_loans]
    except Exception as exc:
        logger.error("An unexpected error occurred", exc_info=True)
        raise UserError(
            detail="An unexpected error occurred while getting stock loan history."
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
            loan_dict = loan.model_dump()
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

def create_loan_with_relations(session: Session, loan_data: LoanCreate):
    # Crear el préstamo principal en la tabla Loan
    new_loan = Loan(
        loan_date=loan_data.loan_date,
        return_date=loan_data.return_date,
        status=loan_data.status,
        observation=loan_data.observation
    )
    session.add(new_loan)
    session.commit()
    session.refresh(new_loan)

    # Crear la relación en UserLoan
    user_loan = UserLoan(user_id=loan_data.user_id, loan_id=new_loan.id)
    session.add(user_loan)

    # Crear la relación en LoanStock
    loan_stock = LoanStock(stock_id=loan_data.stock_id, loan_id=new_loan.id, status="active")
    session.add(loan_stock)

    # Confirmar todos los cambios
    session.commit()

    return new_loan
