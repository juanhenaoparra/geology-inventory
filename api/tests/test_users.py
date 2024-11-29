from fastapi import HTTPException
import pytest
from routes.user_router import create_or_get_user
from models.models import User
from models.schemas import UserCreate

def test_create_new_user(session):
    """Probar la creación de un nuevo usuario."""
    user_data = UserCreate(
        name="Juan Pérez",
        email="juan@test.com"
    )
    
    # Crear usuario
    new_user = create_or_get_user(user_data=user_data, session=session)
    
    # Verificar que el usuario fue creado correctamente
    assert new_user.name == "Juan Pérez"
    assert new_user.email == "juan@test.com"
    assert new_user.student_code == ""
    assert new_user.role == "student"

def test_get_existing_user(session):
    """Probar obtener un usuario existente por email."""
    # Crear usuario primero
    existing_user = User(
        name="María García",
        email="maria@test.com",
        student_code="ST123",
        role="student"
    )
    session.add(existing_user)
    session.commit()
    
    # Intentar crear usuario con mismo email
    user_data = UserCreate(
        name="María Diferente",
        email="maria@test.com"
    )
    
    retrieved_user = create_or_get_user(user_data=user_data, session=session)
    
    # Verificar que se devolvió el usuario existente
    assert retrieved_user.id == existing_user.id
    assert retrieved_user.name == "María García"
    assert retrieved_user.email == "maria@test.com"
