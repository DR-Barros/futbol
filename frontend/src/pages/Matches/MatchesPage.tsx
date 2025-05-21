import { useParams, useNavigate } from "react-router-dom";
import React, { use, useEffect, useState } from "react";
import type { Match } from "../../types/matches";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';


const MatchesPage = () => {
  const { competitionId, seasonId } = useParams<{ competitionId: string; seasonId: string }>();
  const navigate = useNavigate();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!competitionId || !seasonId) {
      setError("Invalid competition or season ID");
      setLoading(false);
      return;
    }
    fetch(`http://localhost:8000/api/v1/competitions/${competitionId}/${seasonId}/matches`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        //ordenar los partidos por fecha
        data.sort((a: Match, b: Match) => {
          const dateA = new Date(`${a.match_date}T${a.kick_off}`);
          const dateB = new Date(`${b.match_date}T${b.kick_off}`);
          return dateA.getTime() - dateB.getTime();
        });
        setMatches(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading matches:", err);
        setMatches([]);
        setError("No hay partidos disponibles");
        setLoading(false);
      });
  }
  , [competitionId, seasonId]);

  if (loading) return <p>Cargando partidos...</p>;
  if (error) return(
    <div>
      <button
        onClick={() => {
          console.log("Navigating to competitions");
          navigate("/competitions");
        }}
        style={{ padding: "0.5rem 1rem", backgroundColor: "#007BFF", color: "#fff", border: "none", borderRadius: "4px" }}
      >
        Volver
      </button>
      <p style={{ color: "red" }}>{error}</p>
    </div>
  )
  if (!matches || matches.length === 0) return (
    <div>
      <button
        onClick={() => {
          console.log("Navigating to competitions");
          navigate("/competitions");
        }}
        style={{ padding: "0.5rem 1rem", backgroundColor: "#007BFF", color: "#fff", border: "none", borderRadius: "4px" }}
      >
        Volver
      </button>
      <p>No se encontraron partidos para esta competición.</p>
    </div>
  )
  return (
    <div>
      <button
        onClick={() => {
          console.log("Navigating to competitions");
          navigate("/competitions");
        }}
        style={{ padding: "0.5rem 1rem", backgroundColor: "#007BFF", color: "#fff", border: "none", borderRadius: "4px" }}
      >
        Volver
      </button>
      <h2>Partidos de la competición: {matches[0].competition} - {matches[0].season}</h2>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Equipo Local</TableCell>
                <TableCell>Resultado</TableCell>
                <TableCell>Equipo Visitante</TableCell>
                <TableCell>Fecha y Hora</TableCell>
                <TableCell>Fase</TableCell>
                <TableCell>Estadio</TableCell>
                <TableCell>Árbitro</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {matches.map((match) => (
                <TableRow key={match.match_id}>
                  <TableCell>{match.home_team}</TableCell>
                  <TableCell>{`${match.home_score} - ${match.away_score}`}</TableCell>
                  <TableCell>{match.away_team}</TableCell>
                  <TableCell>{match.match_date} {match.kick_off}</TableCell>
                  <TableCell>{match.competition_stage} - {match.match_week}</TableCell>
                  <TableCell>{match.stadium}</TableCell>
                  <TableCell>{match.referee}</TableCell>
                  <TableCell>
                    <button
                      onClick={() => navigate(`/match/${match.match_id}/${competitionId}/${seasonId}`)}
                      style={{ padding: "0.5rem 1rem", backgroundColor: "#007BFF", color: "#fff", border: "none", borderRadius: "4px" }}
                    >
                      Ver detalles partido
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
    </div>
  );
};

export default MatchesPage;
