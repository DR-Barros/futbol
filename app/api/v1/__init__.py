from fastapi import APIRouter
from app.api.v1.endpoints import competitions

api_router = APIRouter()
# Include the competitions router
api_router.include_router(competitions.router, prefix="/competitions", tags=["competitions"])