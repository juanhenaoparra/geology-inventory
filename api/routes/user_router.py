from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from models.models import User
from models.schemas import UserCreate
from database import get_session

# Inicializar el router para users
user_router = APIRouter()

# Obtener todos los usuarios
@user_router.get("/", summary="Get all users", tags=["Users"])
def get_users(session: Session = Depends(get_session)):
    """Obtiene la lista completa de usuarios."""
    users = session.query(User).all()
    return users

@user_router.post("/", summary="Create or get user by email", tags=["Users"])
def create_or_get_user(user_data: UserCreate, session: Session = Depends(get_session)):
    """
    Crea un nuevo usuario si el email no existe, o retorna el usuario existente.
    """
    # Buscar si existe un usuario con ese email
    existing_user = session.query(User).filter(User.email == user_data.email).first()

    if existing_user:
        return existing_user

    # Si no existe, crear nuevo usuario
    new_user = User(
        name=user_data.name,
        email=user_data.email,
        student_code=""
    )

    try:
        session.add(new_user)
        session.commit()
        session.refresh(new_user)
        return new_user
    except Exception as e:
        session.rollback()
        raise HTTPException(status_code=400, detail=str(e)) from e
