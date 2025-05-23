const Footer = () => {
  return (
    <footer style={styles.footer}>
      <p>Esta pagina fue creada con fines de aprendizaje usando data de Statbomb</p>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: "#3399ff",
    textAlign: "center" as const,
  }
};

export default Footer;
