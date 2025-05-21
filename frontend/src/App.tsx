import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CompetitionPage from "./pages/CompetitionPage";
import MatchesPage from "./pages/Matches/MatchesPage"
import MatchPage from "./pages/Match/MatchPage";

function App() {
  return (
    <Router>
      <Header />
      <main style={{ padding: "1rem" }}>
        <Routes>
          <Route path="/" element={<h2>Bienvenido a FutbolApp</h2>} />
          <Route path="/competitions" element={<CompetitionPage />} />
          <Route path="/matches/:competitionId/:seasonId" element={<MatchesPage />} />
          <Route path="/match/:matchId/:competitionId/:seasonId" element={<MatchPage />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
