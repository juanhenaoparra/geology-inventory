from fastapi import APIRouter, Depends
from sqlmodel import Session
from models.models import User
from database import get_session

# Inicializar el router para users
user_router = APIRouter()

# Obtener todos los usuarios
@user_router.get("/", summary="Get all users", tags=["Users"])
def get_users(session: Session = Depends(get_session)):
    """Obtiene la lista completa de usuarios."""
    users = session.query(User).all()
    return users
