import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header style={styles.header}>
      <h1>⚽ FutbolApp</h1>
      <nav>
        <ul style={styles.nav}>
          <li><Link to="/" style={styles.linkButton}>Inicio</Link></li>
          <li><Link to="/competitions" style={styles.linkButton}>Competiciones</Link></li>
          {/* Agrega más enlaces si necesitas */}
        </ul>
      </nav>
    </header>
  );
};

const styles = {
  header: {
    padding: "1rem",
    backgroundColor: "#222",
    color: "white",
    display: "flex",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  nav: {
    display: "flex",
    gap: "1rem",
    listStyle: "none",
  },
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
