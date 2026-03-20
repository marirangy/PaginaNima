import React, { useState, useEffect } from "react";
import TestimoniosCarousel from "../components/TestimoniosCarousel";
import { getTestimonios } from "../services/api";

function Testimonios() {
  const [testimonios, setTestimonios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTestimonios()
      .then((data) => {
        console.log("TESTIMONIOS:", data);
        setTestimonios(data);
      })
      .catch((err) => {
        console.error("Error al obtener testimonios:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="page-container">
      <h1>Testimonios</h1>

      {loading ? (
        <p>Cargando testimonios...</p>
      ) : testimonios.length === 0 ? (
        <p>No hay testimonios disponibles</p>
      ) : (
        <TestimoniosCarousel testimonios={testimonios} />
      )}
    </div>
  );
}

export default Testimonios;