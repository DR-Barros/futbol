from fastapi import APIRouter
from app.api.v1.endpoints import competitions, matches

api_router = APIRouter()
# Include the competitions router
api_router.include_router(competitions.router, prefix="/competitions", tags=["competitions"])
# Include the matches router
api_router.include_router(matches.router, prefix="/matches", tags=["matches"])