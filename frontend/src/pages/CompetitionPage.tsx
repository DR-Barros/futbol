import { useEffect, useState, useRef } from "react";
import type { Competition } from "../types/competition";
import { useNavigate } from "react-router-dom";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const CompetitionsPage = () => {
     const [competitions, setCompetitions] = useState<Competition[]>([]);
     const [loading, setLoading] = useState(true);
     const navigate = useNavigate();
     const isMounted = useRef(false);

     useEffect(() => {
          if (isMounted.current) return; 
          isMounted.current = true; 
          console.log("Loading competitions...");
          fetch("http://localhost:8000/api/v1/competitions")
               .then((res) => res.json())
               .then((data) => {
                    if (!Array.isArray(data)) {
                         console.error("Data is not an array:", data);
                         setLoading(false);
                         return;
                    }
                    console.log("Data loaded:", data);
                    setCompetitions(data);
                    setLoading(false);
               })
               .catch((err) => {
                    console.error("Error loading competitions:", err);
                    setLoading(false);
               });
     }, []); 

  if (loading) return <p>Cargando competiciones...</p>;

  return (
    <div>
          <h2>Competiciones disponibles</h2>
          <TableContainer component={Paper}>
               <Table>
                    <TableHead>
                         <TableRow>
                         <TableCell>Nombre</TableCell>
                         <TableCell>Temporada</TableCell>
                         <TableCell>País</TableCell>
                         <TableCell>Genero</TableCell>
                         <TableCell>Juvenil</TableCell>
                         <TableCell>Internacional</TableCell>
                         <TableCell></TableCell>
                         </TableRow>
                    </TableHead>
                    <TableBody>
                         {competitions.map((c) => (
                         <TableRow
                              key={`${c.competition_id}-${c.season_id}`}
                              style={{ cursor: "pointer" }}
                              onClick={() => navigate(`/matches/${c.competition_id}/${c.season_id}`)}
                         >
                              <TableCell>{c.competition_name}</TableCell>
                              <TableCell>{c.season_name}</TableCell>
                              <TableCell>{c.country_name}</TableCell>
                              <TableCell>{c.competition_gender}</TableCell>
                              <TableCell>{c.competition_youth ? "Sí" : "No"}</TableCell>
                              <TableCell>{c.competition_international ? "Sí" : "No"}</TableCell>
                              <TableCell>
                              <button
                              onClick={() => navigate(`/matches/${c.competition_id}/${c.season_id}`)}
                              style={{ padding: "0.5rem 1rem", backgroundColor: "#007BFF", color: "#fff", border: "none", borderRadius: "4px" }}
                              >
                              Ver partidos
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

export default CompetitionsPage;
