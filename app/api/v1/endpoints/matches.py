from statsbombpy import sb
from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
import pandas as pd


router = APIRouter()

@router.get("/{match_id}/{competition_id}/{season_id}")
def get_match(match_id: int, competition_id: int, season_id: int):
    """
    Get match details by match ID
    """
    try:
        match = sb.events(match_id=match_id, split=True)
        match_detail = sb.matches(competition_id, season_id)
        match_detail = match_detail[match_detail["match_id"] == match_id]
        players = sb.lineups(match_id=match_id)
        keys = match.keys()
        for key in keys:
            if key == "starting_xis":
                starting = match[key][["team", "tactics"]].to_dict(orient="records")
                for i in range(len(starting)):
                    lineup = starting[i]["tactics"]["lineup"]
                    new_lineup = []
                    for player in lineup:
                        player_id = player["player"]["id"]
                        player_name = player["player"]["name"]
                        player_position = player["position"]["name"]
                        jersey_number = player["jersey_number"]
                        new_lineup.append({
                            "player_id": player_id,
                            "player_name": player_name,
                            "position": player_position,
                            "shirt_number": jersey_number
                        })
                    starting[i]["tactics"]["lineup"] = new_lineup
                match[key] = starting
            else:
                df = match[key]
                df = df.fillna("")
                match[key] = df.to_dict(orient="records")
        match["details"] = match_detail.to_dict(orient="records")
        players_keys = players.keys()
        for key in players_keys:
            df = players[key]
            df = df.fillna("")
            players[key] = df.to_dict(orient="records")
        match["players"] = players
        return JSONResponse(content=match)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Match {match_id} not found. error: {e}")
    
    

@router.get("/{match_id}/events")
def get_match_events(match_id: int):
    try:
        events = sb.events(match_id=match_id, split=True)

        eventos = list(events.keys())[1:]  # Omitimos el primero
        data = []
        for event in eventos:
            df = events[event]
            if "location" not in df.columns:
                df["location"] = None

            df_filtered = df[["period", "timestamp", "type", "location", "team"]]
            df_filtered["event_type"] = event
            data.append(df_filtered)

        data = pd.concat(data)
        data = data.sort_values(by=["period", "timestamp"]).reset_index(drop=True)

        # Convertimos a formato JSON serializable
        output = []
        for _, row in data.iterrows():
            location = row["location"]
            location = location if isinstance(location, list) else [None, None]
            output.append({
                "period": row["period"],
                "timestamp": row["timestamp"],
                "event_type": row["event_type"],
                "team": row["team"],
                "x": location[0],
                "y": location[1],
            })

        return {"events": output}
    
    except Exception as e:
        return {"error": str(e)}