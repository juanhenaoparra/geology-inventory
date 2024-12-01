from sqlmodel import Session, select
from models.models import User
from models.schemas import UserCreate
from fastapi import HTTPException

def get_all_users(session: Session):
    """Obtiene la lista completa de usuarios."""
    return session.query(User).all()

def create_or_get_user(user_data: UserCreate, session: Session):
    """
    Crea un nuevo usuario si el email no existe, o retorna el usuario existente.
    """
    # Buscar si existe un usuario con ese email
    existing_user = session.exec(select(User).where(User.email == user_data.email)).first()

    if existing_user:
        return existing_user

    # Si no existe, crear nuevo usuario
    new_user = User(
        name=user_data.name,
        email=user_data.email,
        student_code="",
        role="student"
    )

    try:
        session.add(new_user)
        session.commit()
        session.refresh(new_user)
        return new_user
    except Exception as e:
        session.rollback()
        raise HTTPException(status_code=400, detail=str(e)) from e 