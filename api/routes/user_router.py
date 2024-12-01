from fastapi import APIRouter, Depends
from sqlmodel import Session
from models.schemas import UserCreate
from database import get_session
from controllers import user

# Inicializar el router para users
user_router = APIRouter()

# Obtener todos los usuarios
@user_router.get("/", summary="Get all users", tags=["Users"])
def get_users(session: Session = Depends(get_session)):
    """Obtiene la lista completa de usuarios."""
    return user.get_all_users(session=session)

@user_router.post("/", summary="Create or get user by email", tags=["Users"])
def create_or_get_user(user_data: UserCreate, session: Session = Depends(get_session)):
    """
    Crea un nuevo usuario si el email no existe, o retorna el usuario existente.
    """
    return user.create_or_get_user(user_data=user_data, session=session)
