// src/services/api.js

// 🔹 URL del backend en Render
export const API_URL = import.meta.env.VITE_API_URL || "https://paginanima.onrender.com";

// Verificación opcional
if (!API_URL) {
  console.error("⚠️ VITE_API_URL no está definida, usando URL por defecto:", API_URL);
}

// Función base para fetch
async function fetchData(endpoint, errorMsg) {
  const res = await fetch(`${API_URL}${endpoint}`);

  if (!res.ok) {
    throw new Error(errorMsg);
  }

  return res.json();
}

// Función para obtener Centros
export function getCentros() {
  return fetchData("/api/centros", "Error al obtener centros");
}

// Función para obtener FAQs
export function getFaqs() {
  return fetchData("/api/faqs", "Error al obtener FAQs");
}

// Función para obtener Testimonios
export function getTestimonios() {
  return fetchData("/api/testimonios", "Error al obtener testimonios");
}

// Función para obtener Directorios
export function getDirectorios() {
  return fetchData("/api/directorios", "Error al obtener directorios");
}