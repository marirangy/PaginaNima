// src/services/api.js

// 🔹 URL del backend en Render
// Se toma de la variable de entorno VITE_API_URL (Vercel), si no existe usa la URL por defecto
export const API_URL = import.meta.env.VITE_API_URL || "https://paginanima.onrender.com";

// 🔹 Verificación opcional
if (!API_URL) {
  console.warn("⚠️ VITE_API_URL no está definida, usando URL por defecto:", API_URL);
}

// 🔹 Función base para fetch
async function fetchData(endpoint, errorMsg) {
  try {
    const res = await fetch(`${API_URL}${endpoint}`);

    if (!res.ok) {
      throw new Error(`${errorMsg} (HTTP ${res.status})`);
    }

    return await res.json();
  } catch (err) {
    console.error(`❌ Error en fetch ${endpoint}:`, err.message);
    throw err; // para que los componentes que llaman puedan manejarlo
  }
}

// 🔹 Funciones específicas de cada recurso

export function getCentros() {
  return fetchData("/api/centros", "Error al obtener centros");
}

export function getFaqs() {
  return fetchData("/api/faqs", "Error al obtener FAQs");
}

export function getTestimonios() {
  return fetchData("/api/testimonios", "Error al obtener testimonios");
}

export function getDirectorios() {
  return fetchData("/api/directorios", "Error al obtener directorios");
}