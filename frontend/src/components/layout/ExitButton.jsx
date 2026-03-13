import { useEffect, useState } from "react";

function ExitButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleExit = () => {
    // Redirige a Google y bloquea el historial
    window.location.replace("https://www.google.com");

    // Manipula el historial para que no se pueda volver atrás
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = () => {
      window.location.replace("https://www.google.com");
    };
  };

  return (
    <button
      onClick={handleExit}
      style={{
        position: "fixed",
        bottom: "1rem",
        right: "1rem",
        backgroundColor: "#6b21a8", 
        color: "#fff",
        padding: "0.5rem 1rem",
        border: "none",
        borderRadius: "50px",
        cursor: "pointer",
        fontSize: "0.85rem",
        fontWeight: "600",
        zIndex: 9999,
        boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 0.6s ease, transform 0.6s ease",
      }}
      aria-label="Salir"
      title="Salir"
    >
      Salir
    </button>
  );
}

export default ExitButton;