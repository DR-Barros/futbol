import { useParams, useNavigate } from "react-router-dom";
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

  // Puedes usarlos para hacer fetch o mostrar info dinámica
  // Recuerda que los params siempre llegan como string, si necesitas números, conviértelos.

  return (
    <div>
      <button
        onClick={() => navigate(-1)}
        style={{ padding: "0.5rem 1rem", backgroundColor: "#007BFF", color: "#fff", border: "none", borderRadius: "4px" }}
      >
        Volver
      </button>
      <h1>Matches for competition {competitionId} in season {seasonId}</h1>
      {/* Aquí puedes hacer fetch de datos usando esos parámetros */}
    </div>
  );
};

export default MatchesPage;
