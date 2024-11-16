from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from typing import List
from models.models import Stock
from controllers.stock import store_stock, update_stock, remove_stock
from database import get_session
from controllers.exceptions import UserError, UpdateError

# Inicializar el router para stocks
stock_router = APIRouter()

# Obtener todos los ítems de stock
@stock_router.get("/", response_model=List[Stock], summary="Get all stock items", tags=["Stocks"])
def get_stocks(session: Session = Depends(get_session)):
    """Obtiene todos los ítems del stock."""
    stocks = session.query(Stock).all()
    return stocks

# Obtener un ítem específico de stock por ID
@stock_router.get("/{stock_id}", response_model=Stock, summary="Get stock item by ID", tags=["Stocks"])
def get_stock_by_id(stock_id: int, session: Session = Depends(get_session)):
    """Obtiene un ítem de stock por su ID."""
    stock = session.query(Stock).filter(Stock.id == stock_id).first()
    if not stock:
        raise HTTPException(status_code=404, detail="Stock item not found")
    return stock

# Registrar un nuevo ítem de stock
@stock_router.post("/", summary="Add new stock item", tags=["Stocks"])
def post_store_stock(stock: Stock, session: Session = Depends(get_session)):
    """Crea un nuevo ítem en el stock."""
    try:
        return store_stock(session=session, stock=stock)
    except UserError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")

# Actualizar un ítem existente de stock por ID
@stock_router.put("/{stock_id}", summary="Update stock item", tags=["Stocks"])
def put_update_stock(stock_id: int, updated_stock: Stock, session: Session = Depends(get_session)):
    """Actualiza un ítem existente en el stock por su ID."""
    try:
        return update_stock(session=session, stock_id=stock_id, updated_stock=updated_stock)
    except UpdateError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except UserError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")

# Eliminar un ítem de stock por ID
@stock_router.delete("/{stock_id}", summary="Delete stock item", tags=["Stocks"])
def delete_stock(stock_id: int, session: Session = Depends(get_session)):
    """Elimina un ítem de stock por su ID."""
    try:
        return remove_stock(session=session, stock_id=stock_id)
    except HTTPException as err:
        raise err
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")
