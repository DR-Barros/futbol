# app/main.py
from fastapi import FastAPI
from app.api.v1 import api_router
from app.core.config import settings

app = FastAPI(title=settings.PROJECT_NAME)

# Incluir routers
app.include_router(api_router, prefix="/api/v1")