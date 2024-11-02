import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from database import lifespan
from routes.router import router

load_dotenv()

app = FastAPI(lifespan=lifespan)

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

app.include_router(router, prefix="/api")

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", 8001)))
