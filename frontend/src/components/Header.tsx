import { Link } from "react-router-dom";
import "./Header.css";

const Header = () => {
  return (
    <header className="header">
      <h1>⚽ FutbolApp</h1>
      <nav>
        <ul className="header-nav">
          <li className="header-nav-item"><Link to="/" className="header-button">Inicio</Link></li>
          <li className="header-nav-item"><Link to="/competitions" className="header-button">Competiciones</Link></li>
        </ul>
      </nav>
    </header>
  );
};

const styles = {
  linkButton: {
    display: "inline-block",
    padding: "0.5rem 1rem",
    backgroundColor: "#007bff",
    color: "white",
    borderRadius: "4px",
    textDecoration: "none",
    fontWeight: "bold",
    border: "none",
    cursor: "pointer",
    transition: "background-color 0.3s",
  } as React.CSSProperties,
};

export default Header;
