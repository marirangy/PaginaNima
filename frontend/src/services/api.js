// src/services/api.js
export const API_URL = import.meta.env.VITE_API_URL;

// Función para obtener Centros
export async function getCentros() {
  const res = await fetch(`${API_URL}/api/centros`);
  if (!res.ok) throw new Error("Error al obtener centros");
  return res.json();
}

// Función para obtener FAQs
export async function getFaqs() {
  const res = await fetch(`${API_URL}/api/faqs`);
  if (!res.ok) throw new Error("Error al obtener FAQs");
  return res.json();
}

// Función para obtener Testimonios
export async function getTestimonios() {
  const res = await fetch(`${API_URL}/api/testimonios`);
  if (!res.ok) throw new Error("Error al obtener testimonios");
  return res.json();
}

// Función para obtener Directorios
export async function getDirectorios() {
  const res = await fetch(`${API_URL}/api/directorios`);
  if (!res.ok) throw new Error("Error al obtener directorios");
  return res.json();
}