from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from models.schemas import UserCreate
from database import get_session
from controllers import user
from models.models import User
from models.schemas import UserUpdate

# Inicializar el router para users
user_router = APIRouter()

# Obtener todos los usuarios
@user_router.get("/", summary="Get all users", tags=["Users"])
def get_users(session: Session = Depends(get_session)):
    """Obtiene la lista completa de usuarios."""
    return user.get_all_users(session=session)

# Crear o obtener usuario por email
@user_router.post("/", summary="Create or get user by email", tags=["Users"])
def create_or_get_user(user_data: UserCreate, session: Session = Depends(get_session)):
    """
    Crea un nuevo usuario si el email no existe, o retorna el usuario existente.
    """
    return user.create_or_get_user(user_data=user_data, session=session)

@user_router.put("/{user_id}", summary="Update user", tags=["Users"])
def update_user(user_id: int, user_data: UserUpdate, session: Session = Depends(get_session)):
    """
    Actualiza los datos de un usuario.
    """
    return user.update_user_data(
        session=session,
        user_id=user_id,
        user_data=user_data.model_dump(exclude_unset=True)
    )
