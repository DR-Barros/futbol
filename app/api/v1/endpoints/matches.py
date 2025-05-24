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
            if key == "bad_behaviours":
                df = match[key]
                if "location" not in df.columns:
                    df["location"] = None
                df = df[["period", "timestamp", "type", "location", "team", "player", "bad_behaviour_card"]]
                df = df.fillna("")
                match[key] = df.to_dict(orient="records")
            elif key == "ball_receipts":
                df = match[key]
                if "location" not in df.columns:
                    df["location"] = None
                df = df[["period", "timestamp", "type", "location", "team", "player", "ball_receipt_outcome", "under_pressure"]]
                df = df.fillna("")
                match[key] = df.to_dict(orient="records")
            elif key == "ball_recoverys":
                df = match[key]
                if "location" not in df.columns:
                    df["location"] = None
                df = df[["period", "timestamp", "type", "location", "team", "player", "under_pressure", "ball_recovery_offensive", "ball_recovery_recovery_failure"]]
                df = df.fillna("")
                match[key] = df.to_dict(orient="records")
            elif key == "blocks":
                df = match[key]
                if "location" not in df.columns:
                    df["location"] = None
                df = df[["period", "timestamp", "type", "location", "team", "player", "counterpress"]]
                df = df.fillna("")
                match[key] = df.to_dict(orient="records")
            elif key == "carrys":
                df = match[key]
                if "location" not in df.columns:
                    df["location"] = None
                df = df[["period", "timestamp", "type", "location", "team", "player", "duration", "carry_end_location", "under_pressure"]]
                df = df.fillna("")
                match[key] = df.to_dict(orient="records")
            elif key == "clearances":
                df = match[key]
                if "location" not in df.columns:
                    df["location"] = None
                df = df[["period", "timestamp", "type", "location", "team", "player", "clearance_body_part", "out", "clearance_aerial_won", "under_pressure"]]
                df = df.fillna("")
                match[key] = df.to_dict(orient="records")
            elif key == "dispossesseds":
                df = match[key]
                if "location" not in df.columns:
                    df["location"] = None
                df = df[["period", "timestamp", "type", "location", "team", "player", "under_pressure"]]
                df = df.fillna("")
                match[key] = df.to_dict(orient="records")
            elif key == "dribbled_pasts":
                df = match[key]
                if "location" not in df.columns:
                    df["location"] = None
                df = df[["period", "timestamp", "type", "location", "team", "player", "counterpress"]]
                df = df.fillna("")
                match[key] = df.to_dict(orient="records")
            elif key == "dribbles":
                df = match[key]
                if "location" not in df.columns:
                    df["location"] = None
                df = df[["period", "timestamp", "type", "location", "team", "player", "dribble_nutmeg", "dribble_outcome", "under_pressure","dribble_overrun"]]
                df = df.fillna("")
                match[key] = df.to_dict(orient="records")
            elif key == "duels":
                df = match[key]
                if "location" not in df.columns:
                    df["location"] = None
                df = df[["period", "timestamp", "type", "location", "team", "player", "duel_outcome", "duel_type", "counterpress", "under_pressure"]]
                df = df.fillna("")
                match[key] = df.to_dict(orient="records")
            elif key == "foul_committeds":
                df = match[key]
                if "location" not in df.columns:
                    df["location"] = None
                df = df[["period", "timestamp", "type", "location", "team", "player", "counterpress", "foul_committed_card", "foul_committed_advantage", "foul_committed_type"]]
                df = df.fillna("")
                match[key] = df.to_dict(orient="records")
            elif key == "foul_wons":
                df = match[key]
                if "location" not in df.columns:
                    df["location"] = None
                df = df[["period", "timestamp", "type", "location", "team", "player", "foul_won_advantage", "foul_won_defensive", "under_pressure"]]
                df = df.fillna("")
                match[key] = df.to_dict(orient="records")
            elif key == "goal_keepers":
                df = match[key]
                if "location" not in df.columns:
                    df["location"] = None
                df = df[["period", "timestamp", "type", "location", "team", "player", "goalkeeper_outcome", "goalkeeper_type", "goalkeeper_body_part", "goalkeeper_end_location", "goalkeeper_position", "goalkeeper_technique", "under_pressure"]]
                df = df.fillna("")
                match[key] = df.to_dict(orient="records")
            elif key == "half_ends":
                df = match[key]
                if "location" not in df.columns:
                    df["location"] = None
                df = df[["period", "timestamp", "type", "location", "team"]]
                df = df.fillna("")
                match[key] = df.to_dict(orient="records")
            elif key == "half_starts":
                match[key] = None
            elif key == "injury_stoppages":
                df = match[key]
                if "location" not in df.columns:
                    df["location"] = None
                df = df[["period", "timestamp", "type", "location", "team", "injury_stoppage_in_chain"]]
                df = df.fillna("")
                match[key] = df.to_dict(orient="records")
            elif key == "interceptions":
                df = match[key]
                if "location" not in df.columns:
                    df["location"] = None
                df = df[["period", "timestamp", "type", "location", "team", "player", "interception_outcome", "under_pressure", "counterpress"]]
                df = df.fillna("")
                match[key] = df.to_dict(orient="records")
            elif keys == 'miscontrols':
                df = match[key]
                if "location" not in df.columns:
                    df["location"] = None
                df = df[["period", "timestamp", "type", "location", "team", "player"]]
                df = df.fillna("")
                match[key] = df.to_dict(orient="records")
            elif key == "passes":
                df = match[key]
                if "location" not in df.columns:
                    df["location"] = None
                df = df[[ 'period', 'timestamp', 'type', 'team', 'player',
                    'location', 'duration',
                    'pass_recipient', 'pass_length',  'pass_height',
                    'pass_end_location', 'pass_body_part', 'pass_type',
                    'pass_outcome',  'pass_shot_assist',
                    ]]
                df = df.fillna("")
                match[key] = df.to_dict(orient="records")
            elif key == "player_offs":
                df = match[key]
                if "location" not in df.columns:
                    df["location"] = None
                df = df[["period", "timestamp", "type", "location", "team", "player"]]
                df = df.fillna("")
                match[key] = df.to_dict(orient="records")
            elif key == "player_on":
                df = match[key]
                if "location" not in df.columns:
                    df["location"] = None
                df = df[["period", "timestamp", "type", "location", "team", "player"]]
                df = df.fillna("")
                match[key] = df.to_dict(orient="records")
            elif key == "pressures":
                df = match[key]
                if "location" not in df.columns:
                    df["location"] = None
                df = df[["period", "timestamp", "type", "location", "team", "player", "counterpress"]]
                df = df.fillna("")
                match[key] = df.to_dict(orient="records")
            elif key == "referee_ball_drops":
                df = match[key]
                if "location" not in df.columns:
                    df["location"] = None
                df = df[["period", "timestamp", "type", "location", "team"]]
                df = df.fillna("")
                match[key] = df.to_dict(orient="records")
            elif key == "shields":
                df = match[key]
                if "location" not in df.columns:
                    df["location"] = None
                df = df[["period", "timestamp", "type", "location", "team", "player"]]
                df = df.fillna("")
                match[key] = df.to_dict(orient="records")
            elif key == "shots":
                df = match[key]
                if "location" not in df.columns:
                    df["location"] = None
                df = df[["period", "timestamp", "type", "location", "team", "shot_type", "shot_outcome", "shot_statsbomb_xg", "player", "shot_body_part", 'shot_end_location']] 
                df = df.fillna("")
                match[key] = df.to_dict(orient="records")
            elif key == "starting_xis":
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
            elif key == "substitutions":
                df = match[key]
                if "location" not in df.columns:
                    df["location"] = None
                df = df[["period", "timestamp", "player", "team", "substitution_replacement", "type", "location"]]
                df = df.fillna("")
                match[key] = df.to_dict(orient="records")
            elif key == "tactical_shifts":
                df = match[key]
                if "location" not in df.columns:
                    df["location"] = None
                df = df[["period", "timestamp", "type", "location", "team", "tactics"]]
                df = df.fillna("")
                match[key] = df.to_dict(orient="records")
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