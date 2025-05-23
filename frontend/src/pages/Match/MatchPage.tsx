import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Match, Lineup, Player } from "../../types/matches";
import FormationPitch from "./components/FormationPitch";
import ListPlayer from "./components/ListPlayers";
import FootballField from "./components/FootballField";
import "./MatchPage.css";

const MatchPage = () => {
    const { matchId, competitionId, seasonId } = useParams<{ matchId: string; competitionId: string; seasonId: string }>();
    const navigate = useNavigate();
    const [match, setMatch] = useState<Match | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lineups, setLineups] = useState<Lineup[]>([]);
    const [localPlayers, setLocalPlayers] = useState<Player[]>([]);
    const [awayPlayers, setAwayPlayers] = useState<Player[]>([]);

    useEffect(() => {
        if (!matchId) {
            setError("Invalid match ID");
            setLoading(false);
            return;
        }
        fetch(`http://localhost:8000/api/v1/matches/${matchId}/${competitionId}/${seasonId}`)
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Network response was not ok");
                }
                return res.json();
            })
            .then((data) => {
                setMatch(data.details[0]);
                setLineups(data.starting_xis);
                setLocalPlayers(data.players[data.details[0].home_team]);
                setAwayPlayers(data.players[data.details[0].away_team]);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error loading match:", err);
                setMatch(null);
                setError("Error loading match");
                setLoading(false);
            });
    }, [matchId]);
    if (loading) return <p>Cargando detalles del partido...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;
    if (!match) return <p>No se encontraron detalles del partido.</p>;
    if (!lineups || lineups.length === 0) return <p>No se encontraron alineaciones para este partido.</p>;
    if (lineups.length !== 2) return <p>Se esperaban 2 alineaciones, pero se encontraron {lineups.length}.</p>;
    return (
        <div
            className="match-page"
            style={{
            maxWidth: "1000px",
            margin: "2rem auto",
            padding: "2rem",
            background: "#f9f9f9",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
        >
            <button
            onClick={() => {
                console.log("Navigating to matches");
                navigate(`/matches/${competitionId}/${seasonId}`);
            }}
            style={{ padding: "0.5rem 1rem", backgroundColor: "#007BFF", color: "#fff", border: "none", borderRadius: "4px" }}
            >
                Volver a los partidos
            </button>
            <h2
            style={{
                fontSize: "2rem",
                marginBottom: "1rem",
                textAlign: "center",
                color: "#333",
            }}
            >Detalles del Partido: {match.home_team} {match.home_score} - {match.away_score} {match.away_team}</h2>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3>{match.competition} - {match.season} - {match.competition_stage} - {match.match_week}</h3>
                <h3>{match.match_date} {match.kick_off}</h3>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3>Árbitro: {match.referee}</h3>
                <h3>Estadio: {match.stadium}</h3>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3>Entrenadores: {match.home_managers} - {match.away_managers}</h3>
            </div>
            <FootballField matchId={Number(matchId)} homeTeam={match.home_team} awayTeam={match.away_team} />
            <h3>Alineaciones</h3>
            <div className="match-page__lineups">
                <ListPlayer players={localPlayers} />
                <FormationPitch lineup={lineups} />
                <ListPlayer players={awayPlayers} />
            </div>
        </div>
    );
}

export default MatchPage;