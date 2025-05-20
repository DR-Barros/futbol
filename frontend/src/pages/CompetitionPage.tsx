import { useEffect, useState } from "react";
import type { Competition } from "../types/competition";
import { useNavigate } from "react-router-dom";

const CompetitionsPage = () => {
     const [competitions, setCompetitions] = useState<Competition[]>([]);
     const [loading, setLoading] = useState(true);
     const navigate = useNavigate();

     useEffect(() => {
     fetch("http://localhost:8000/api/v1/competitions") // Ajusta el endpoint si es necesario
          .then((res) => res.json())
          .then((data) => {
          if (!Array.isArray(data)) {
               console.error("Data is not an array:", data);
               setLoading(false);
               return;
          }
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
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
               <th>ID</th>
               <th>Nombre</th>
               <th>Temporada</th>
               <th>País</th>
               <th></th>
          </tr>
          </thead>
          <tbody>
               {competitions.map((c) => (
               <tr
                    key={`${c.competition_id}-${c.season_id}`}
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate(`/matches/${c.competition_id}/${c.season_id}`)}
                    >
                    <td>{c.competition_id}</td>
                    <td>{c.competition_name}</td>
                    <td>{c.season_name}</td>
                    <td>{c.country_name}</td>
                    <td>
                         <button
                         onClick={() => navigate(`/matches/${c.competition_id}/${c.season_id}`)}
                         style={{ padding: "0.5rem 1rem", backgroundColor: "#007BFF", color: "#fff", border: "none", borderRadius: "4px" }}
                         >
                         Ver partidos
                         </button>
                    </td>
               </tr>
               ))}
          </tbody>
      </table>
    </div>
  );
};

export default CompetitionsPage;
