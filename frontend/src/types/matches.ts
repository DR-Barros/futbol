export interface Match {
  match_id: number;
  match_date: string; 
  kick_off: string;
  home_team: string;
  away_team: string;
  home_score: number;
  away_score: number;
  home_managers: string;
  away_managers: string;
  referee: string;
  stadium: string;
  competition: string;
  competition_stage: string;
  season: string;
  match_week: number;
  match_status: string;
  match_status_360: string;
  data_version: string;
  shot_fidelity_version: string;
  xy_fidelity_version: string;
  last_updated: string; 
  last_updated_360: string; 
}

export interface Lineup {
    team: string;
    tactics: {
        formation: string;
        lineup: {
            player_id: number;
            player_name: string;
            position: string;
            shirt_number: number;
        }[];
    }
}

export interface Player {
    player_id: number;
    player_name: string;
    player_nickname: string;
    jersey_number: number;
    country: string;
    positions: {
        position_id: number;
        position: string;
        from: string;
        to: string;
        from_period: string;
        to_period: string;
        strat_reason: string;
        end_reason: string;
    }[];
    cards: {
        card_type: string;
        period: number;
        reason: string;
        time: string;
    }[];
}