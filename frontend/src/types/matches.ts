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
