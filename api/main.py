from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

# Importa el router de herramientas
from routes.tools_router import router as tool_router
from routes.router import router as hello

load_dotenv()

app = FastAPI()

allow_origins = os.getenv("ALLOWED_ORIGINS")
if allow_origins:
    allow_origins = allow_origins.split(",")
else:
    allow_origins = []

allow_methods = os.getenv("ALLOWED_METHODS")
if allow_methods:
    allow_methods = allow_methods.split(",")
else:
    allow_methods = []

allow_headers = os.getenv("ALLOWED_HEADERS")
if allow_headers:
    allow_headers = allow_headers.split(",")
else:
    allow_headers = []

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=allow_methods,
    allow_headers=allow_headers,
)

# Incluye las rutas de herramientas bajo el prefijo /api
app.include_router(tool_router, prefix="/api")
# Incluye las rutas de herramientas bajo el prefijo /api
app.include_router(hello, prefix="/api")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", 8001)))
