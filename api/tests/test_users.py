from models.models import User

def test_create_user(session):
    """Probar la creación de un usuario."""
    user = User(name="Test User", email="test@example.com", student_code="ST123")
    session.add(user)
    session.commit()

    retrieved_user = session.query(User).filter_by(email="test@example.com").first()
    assert retrieved_user is not None
    assert retrieved_user.name == "Test User"
    assert retrieved_user.student_code == "ST123"
