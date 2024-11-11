"""Controller for loan history"""

import logging
from sqlmodel import Session
from sqlalchemy import select
from fastapi.encoders import jsonable_encoder
from controllers.exceptions import UserError
from models.models import LoanStock, Loan, User, UserLoan

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

def loans(session: Session):
    """Get all loans"""
    try:
        # Get all loans with their relationships
        all_loans = session.exec(
            select(Loan, User)
            .join(UserLoan, Loan.id == UserLoan.loan_id)
            .join(User, UserLoan.user_id == User.id)
            .join(LoanStock, Loan.id == LoanStock.loan_id)
        ).all()

        # Include the user name in the loans
        loans_with_his_user = []
        for loan, user in all_loans:
            loan_dict = loan.dict()
            loan_dict["user_name"] = user.name
            loans_with_his_user.append(loan_dict)

        return loans_with_his_user

    except Exception as exc:
        logger.error("An unexpected error occurred", exc_info=True)
        raise UserError(
            detail="An unexpected error occurred while getting all loans."
        ) from exc
