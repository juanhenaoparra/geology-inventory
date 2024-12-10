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
    # Buscar el usuario en la base de datos
    statement = select(User).where(User.id == user_id)
    user_instance = session.exec(statement).first()

    if not user_instance:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    # Actualizar los campos proporcionados
    for key, value in user_data.model_dump(exclude_unset=True).items():
        setattr(user_instance, key, value)

    session.add(user_instance)
    session.commit()
    session.refresh(user_instance)

    return user_instance



