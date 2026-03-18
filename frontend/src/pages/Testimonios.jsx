import React, { useState, useEffect } from "react";
import TestimoniosCarousel from "../components/TestimoniosCarousel";
import { getTestimonios } from "../services/api";

function Testimonios() {
  const [testimonios, setTestimonios] = useState([]);

  useEffect(() => {
    getTestimonios()
      .then((data) => {
        console.log("TESTIMONIOS:", data); // 👈 debug
        setTestimonios(data);
      })
      .catch((err) =>
        console.error("Error al obtener testimonios:", err)
      );
  }, []);

  return (
    <div className="page-container">
      <h1>Testimonios</h1>

      {/* 👇 pasamos los datos al componente */}
      <TestimoniosCarousel testimonios={testimonios} />
    </div>
  );
}

export default Testimonios;