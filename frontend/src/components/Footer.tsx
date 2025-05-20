const Footer = () => {
  return (
    <footer style={styles.footer}>
      <p>Esta pagina fue creada con fines de aprendizaje usando data de Statbomb</p>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: "#eee",
    textAlign: "center" as const,
  }
};

export default Footer;
