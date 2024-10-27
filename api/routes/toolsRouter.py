from fastapi import APIRouter

router = APIRouter()

tools = [
    {"id": 1, "name": "Martillo", "available": True},
    {"id": 2, "name": "Destornillador", "available": False},
]

@router.get("/tools")
def get_tools():
    return tools
