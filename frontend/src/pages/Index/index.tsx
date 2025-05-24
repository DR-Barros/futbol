import { Card, Typography, List, ListItem, ListItemText, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const features = [
  "⚽ Consulta partidos de diversas competiciones y temporadas.",
  "📊 Explora estadísticas de jugadores y equipos.",
  "🗺️ Juega con tácticas en un diagrama Voronoi interactivo.",
];

const Index = () => {
  const navigate = useNavigate();

  return (
    <div>
      <Card
        style={{
          maxWidth: 600,
          margin: "0 auto",
          padding: "2rem 2.5rem",
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
          borderRadius: 16,
        }}
      >
        <Typography variant="h4" component="h2" style={{ textAlign: "center", marginBottom: 24 }}>
          Bienvenido a FutbolApp <span role="img" aria-label="fútbol">🏟️</span>
        </Typography>
        <Typography style={{ fontSize: 16, marginBottom: 24 }}>
          FutbolApp es una plataforma donde puedes consultar estadísticas, resultados y noticias sobre tus equipos y ligas de fútbol favoritas.
          Actualmente, la información de partidos disponible corresponde únicamente a los que están en la base de datos de StatBomb.
        </Typography>
        <List>
          {features.map((item, idx) => (
            <ListItem key={idx} style={{ border: "none", paddingLeft: 0 }}>
              <ListItemText
                primary={<span style={{ fontSize: 15 }}>{item}</span>}
                style={{ margin: 0 }}
              />
            </ListItem>
          ))}
        </List>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          style={{ marginTop: 32, marginBottom: 16, fontWeight: 600, fontSize: 16 }}
          onClick={() => navigate("/competitions")}
          startIcon={<span role="img" aria-label="trofeo">🏆</span>}
        >
          Ver competiciones
        </Button>
        <Typography style={{ fontWeight: 500, marginTop: 8, textAlign: "center" }}>
          ¡Empieza a explorar y mantente al día con todo lo relacionado al fútbol! <span role="img" aria-label="balón">⚽</span>
        </Typography>
      </Card>
    </div>
  );
};

export default Index;