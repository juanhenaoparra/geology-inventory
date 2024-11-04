from sqlmodel import Session
from models.models import Stock
from sqlite3 import IntegrityError
from sqlalchemy.exc import SQLAlchemyError
from controllers.exceptions import UserError
import logging

logger = logging.getLogger(__name__)


def store_stock(session: Session, stock: Stock):
    try:
        session.add(stock)
        session.commit()
        session.refresh(stock)
    except (IntegrityError, SQLAlchemyError):
        logger.error("Failed to store stock due to database error", exc_info=True)
        raise UserError(detail="Failed to store stock: Invalid input data.")
    except Exception:
        logger.error("An unexpected error occurred", exc_info=True)
        raise UserError(detail="An unexpected error occurred while storing stock.")

    return stock
