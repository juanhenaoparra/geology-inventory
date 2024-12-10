from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session
from models.schemas import LoanCreate, LoanStatusUpdate
import controllers.loan
from database import get_session
from controllers.exceptions import UserError
from typing import Optional

loan_router = APIRouter()


@loan_router.get("/", summary="Get loans based on user role", tags=["Loans"])
def get_loans(
    user_id: int = Query(..., description="ID del usuario solicitante"),
    user_role: str = Query(..., description="Rol del usuario"),
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(10, ge=1, le=100, description="Number of items per page"),
    session: Session = Depends(get_session),
):
    """Obtiene préstamos basados en el rol del usuario."""
    return controllers.loan.loans(
        session=session, user_id=user_id, user_role=user_role, page=page, page_size=page_size
    )


@loan_router.post("/", summary="Create a new loan with group members", tags=["Loans"])
def create_loan(loan_data: LoanCreate, session: Session = Depends(get_session)):
    """Crea un nuevo préstamo con usuarios adicionales del grupo."""
    try:
        new_loan = controllers.loan.create_loan_with_relations(
            session=session, loan_data=loan_data
        )
        return new_loan
    except UserError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")



@loan_router.put(
    "/{loan_id}/status/{status}",
    summary="Update loan status, return date and stock statuses",
    tags=["Loans"],
)
def update_loan_status(
    loan_id: int, status: LoanStatusUpdate, session: Session = Depends(get_session)
):
    """Actualiza el estado de un préstamo existente, la fecha de devolución y el estado de los items del préstamo."""
    loan = controllers.loan.update_loan_status(
        session=session, loan_id=loan_id, status=status.value
    )
    return loan
