import React, { useState, useEffect } from "react";
import TestimoniosCarousel from "../components/TestimoniosCarousel"; 
import { getTestimonios } from '../services/api';

function Testimonios() {
  const [testimonios, setTestimonios] = useState([]);

  useEffect(() => {
    getTestimonios()
      .then(setTestimonios)
      .catch(err => console.error('Error al obtener testimonios:', err));
  }, []);

function Testimonios() {
  return (
    <div className="page-container">
      <TestimoniosCarousel />
    </div>
  );
}
}
export default Testimonios;