"""Controlador de usuarios"""

import re
from sqlmodel import Session, select
from models.models import User
from models.schemas import UserCreate
from fastapi import HTTPException

def get_all_users(session: Session):
    """Obtiene la lista completa de usuarios."""
    return session.exec(select(User)).all()

def validate_email(email: str) -> bool:
    """Valida que el formato del correo electrónico sea correcto."""
    if not email:
        return False
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return bool(re.match(pattern, email))

def create_or_get_user(user_data: UserCreate, session: Session):
    """
    Crea un nuevo usuario si el email no existe, o retorna el usuario existente.
    """
    if not user_data.email or not user_data.name:
        raise HTTPException(status_code=400, detail="Email and name are required")

    if not validate_email(user_data.email):
        raise HTTPException(status_code=400, detail="Invalid email format")

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