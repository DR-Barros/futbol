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
          <li className="header-nav-item"><Link to="/tactics" className="header-button">Tácticas</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
