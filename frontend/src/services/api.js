// src/services/api.js
export const API_URL = import.meta.env.VITE_API_URL;

// Función para obtener Centros
export async function getCentros() {
  const res = await fetch(`${API_URL}/api/centros`);
  return res.json();
}

// Función para obtener FAQs
export async function getFaqs() {
  const res = await fetch(`${API_URL}/api/faqs`);
  return res.json();
}

// Función para obtener Testimonios
export async function getTestimonios() {
  const res = await fetch(`${API_URL}/api/testimonios`);
  return res.json();
}

// Función para obtener Directorios
export async function getDirectorios() {
  const res = await fetch(`${API_URL}/api/directorios`);
  return res.json();
}