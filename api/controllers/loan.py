"""Controller for loan history"""

import logging
from sqlmodel import Session
from sqlalchemy import select
from fastapi.encoders import jsonable_encoder
from controllers.exceptions import UserError
from models.models import LoanStock, Loan

logger = logging.getLogger(__name__)

def tool_loan_history(session: Session, tool_id: int):
    """Get the loan history for a tool"""
    try:
        loans = session.exec(
            select(Loan).join(LoanStock).where(LoanStock.stock_id == tool_id)
        ).all()
        return [jsonable_encoder(loan[0].dict()) for loan in loans]
    except Exception as exc:
        logger.error("An unexpected error occurred", exc_info=True)
        raise UserError(
            detail="An unexpected error occurred while getting tool loan history."
        ) from exc
