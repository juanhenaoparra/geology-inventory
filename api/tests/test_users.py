"""Testing for user"""

from controllers.user import create_or_get_user, get_all_users, validate_email
from models.models import User
from models.schemas import UserCreate
import pytest
from fastapi import HTTPException

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

def test_get_all_users(session):
    """Probar obtener todos los usuarios."""
    # Crear algunos usuarios de prueba
    users = [
        User(name="Usuario 1", email="user1@test.com"),
        User(name="Usuario 2", email="user2@test.com")
    ]
    for user in users:
        session.add(user)
    session.commit()

    # Obtener todos los usuarios
    all_users = get_all_users(session=session)

    # Verificar que se obtuvieron todos los usuarios
    assert len(all_users) == 2
    assert all_users[0].email == "user1@test.com"
    assert all_users[1].email == "user2@test.com"

def test_create_user_invalid_email(session):
    """Probar la creación de un usuario con email inválido."""
    user_data = UserCreate(
        name="Test User",
        email="invalid-email"  # Email inválido
    )

    with pytest.raises(HTTPException) as exc_info:
        create_or_get_user(user_data=user_data, session=session)

    assert exc_info.value.status_code == 400
    assert "Invalid email format" in str(exc_info.value.detail)

def test_validate_email():
    """Probar la función de validación de email."""
    # Emails válidos
    assert validate_email("user@example.com") is True
    assert validate_email("user.name@domain.co.uk") is True
    assert validate_email("user+label@example.com") is True

    # Emails inválidos
    assert validate_email("invalid-email") is False
    assert validate_email("user@") is False
    assert validate_email("@domain.com") is False
    assert validate_email("user@domain") is False

def test_create_user_empty_email(session):
    """Probar la creación de un usuario con email vacío."""
    user_data = UserCreate(
        name="Test User",
        email=""
    )

    with pytest.raises(HTTPException) as exc_info:
        create_or_get_user(user_data=user_data, session=session)

    assert exc_info.value.status_code == 400
    assert "Email and name are required" in str(exc_info.value.detail)

def test_create_user_empty_name(session):
    """Probar la creación de un usuario con nombre vacío."""
    user_data = UserCreate(
        name="",
        email="test@example.com"
    )

    with pytest.raises(HTTPException) as exc_info:
        create_or_get_user(user_data=user_data, session=session)

    assert exc_info.value.status_code == 400
    assert "Email and name are required" in str(exc_info.value.detail)

def test_validate_email_empty():
    """Probar la validación de email vacío."""
    assert validate_email("") is False
