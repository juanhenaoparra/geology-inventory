from models.models import Stock

def test_create_stock(session):
    """Probar la creación de un stock."""
    stock = Stock(name="Hammer", description="Heavy-duty hammer", inventory_code="HAM001", quality="Good")
    session.add(stock)
    session.commit()

    retrieved_stock = session.query(Stock).filter_by(inventory_code="HAM001").first()
    assert retrieved_stock is not None
    assert retrieved_stock.name == "Hammer"
    assert retrieved_stock.quality == "Good"
