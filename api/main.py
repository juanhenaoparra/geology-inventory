import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from database import lifespan
from routes.stock_router import stock_router
from routes.user_router import user_router
from routes.loan_router import loan_router

# Cargar variables de entorno
load_dotenv()

# Crear la aplicación FastAPI
app = FastAPI(lifespan=lifespan)

# Configurar CORS
origins = [
    "http://localhost:3000",  # Tu frontend React
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registrar los routers
app.include_router(stock_router, prefix="/api/stocks", tags=["Stocks"])
app.include_router(user_router, prefix="/api/users", tags=["Users"])
app.include_router(loan_router, prefix="/api/loans", tags=["Loans"])

# Configuración del servidor para ejecutar localmente
if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", 8001)))
