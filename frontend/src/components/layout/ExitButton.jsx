import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * ExitButton
 * Props:
 *  - external (boolean): si true redirige a Google y bloquea volver atrás
 *                         si false redirige dentro de la SPA
 */
function ExitButton({ external = false }) {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  // 🔹 Animación de aparición
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleExit = () => {
    if (external) {
      // 🔹 Redirige a Google y bloquea volver atrás
      window.location.replace("https://www.google.com");

      // Bloquea botón atrás
      window.history.pushState(null, "", window.location.href);
      window.onpopstate = () => {
        window.location.replace("https://www.google.com");
      };
    } else {
      // 🔹 Redirige dentro de React SPA sin recargar la página
      navigate("/", { replace: true });
    }
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