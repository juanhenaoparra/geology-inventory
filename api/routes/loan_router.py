from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session
from models.schemas import LoanCreate
from models.models import Loan
from controllers.loan import loans, create_loan_with_relations
from database import get_session
from controllers.exceptions import UserError

# Inicializar el router para loans
loan_router = APIRouter()

# Obtener todos los préstamos paginados
@loan_router.get("/", summary="Get all loans", tags=["Loans"])
def get_loans(
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(10, ge=1, le=100, description="Number of items per page"),
    session: Session = Depends(get_session),
):
    """Obtiene todos los préstamos de manera paginada."""
    return loans(session=session, page=page, page_size=page_size)

# Crear un nuevo préstamo
@loan_router.post("/", summary="Create a new loan", tags=["Loans"])
def create_loan(loan_data: LoanCreate, session: Session = Depends(get_session)):
    """Crea un nuevo préstamo y sus relaciones."""
    try:
        new_loan = create_loan_with_relations(session=session, loan_data=loan_data)
        return new_loan
    except UserError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")

# Actualizar el estado de un préstamo a "devuelto"
@loan_router.put("/{loan_id}/return", summary="Update loan status to returned", tags=["Loans"])
def update_loan_status(loan_id: int, session: Session = Depends(get_session)):
    """Actualiza el estado de un préstamo existente a 'devuelto'."""
    # Buscar el préstamo por ID
    loan = session.get(Loan, loan_id)
    if not loan:
        raise HTTPException(status_code=404, detail="Loan not found")
    
    # Actualizar el estado del préstamo
    loan.status = "devuelto"
    session.add(loan)
    session.commit()
    session.refresh(loan)
    return loan
