import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CompetitionPage from "./pages/CompetitionPage";
import MatchesPage from "./pages/Matches/MatchesPage"
import MatchPage from "./pages/Match/MatchPage";
import Index from "./pages/Index";
import TacticsPage from "./pages/tactics/TacticsPage";

function App() {
  return (
    <Router>
      <Header />
      <main style={{ padding: "1rem" }}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/competitions" element={<CompetitionPage />} />
          <Route path="/matches/:competitionId/:seasonId" element={<MatchesPage />} />
          <Route path="/match/:matchId/:competitionId/:seasonId" element={<MatchPage />} />
          <Route path="/tactics" element={<TacticsPage />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
