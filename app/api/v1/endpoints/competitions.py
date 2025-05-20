from statsbombpy import sb
from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
import pandas as pd


router = APIRouter()

@router.get("/")
def get_competitions():
    """
    Get all competitions
    """
    competitions: pd.DataFrame = sb.competitions()
    competitions = competitions.to_json(orient="records")
    return JSONResponse(content=competitions)

@router.get("/{competition_id}/{season_id}/matches")
def get_season_matches(competition_id: int, season_id: int):
    """
    Get all matches for a competition and season
    """
    try:
        matches: pd.DataFrame = sb.matches(competition_id, season_id)
        matches = matches.to_json(orient="records")
        return JSONResponse(content=matches)
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"Competition {competition_id} or season {season_id} not found. error: {e}")