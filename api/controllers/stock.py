from sqlmodel import Session
from models.models import Stock
from sqlite3 import IntegrityError
from sqlalchemy.exc import SQLAlchemyError
from controllers.exceptions import UserError
from controllers.exceptions import UpdateError
from fastapi import HTTPException
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


def update_stock(session: Session, stock_id: int, updated_stock: Stock) -> Stock:

    stock = session.get(Stock, stock_id)

    if not stock:
        raise HTTPException(status_code=404, detail="Stock item not found")

    # Actualizar solo los campos que fueron enviados
    for key, value in updated_stock.dict(exclude_unset=True).items():
        setattr(stock, key, value)

    try:
        session.add(stock)
        session.commit()
        session.refresh(stock)
    except Exception as e:
        session.rollback()
        raise UpdateError(detail="Failed to update stock item") from e

    return stock
