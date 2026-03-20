// src/services/api.js

// 🔹 URL del backend en Render
export const API_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || "https://paginanima.onrender.com";

// 🔍 DEBUG (MUY IMPORTANTE)
console.log("🌐 API_URL usada:", API_URL);

// 🔹 Función base para fetch
async function fetchData(endpoint, errorMsg) {
  try {
    const url = `${API_URL}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;

    console.log("📡 Fetching:", url); // 👈 DEBUG

    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error(`${errorMsg} (HTTP ${res.status})`);
    }

    const data = await res.json();

    console.log("✅ Respuesta:", data); // 👈 DEBUG

    return data;

  } catch (err) {
    console.error(`❌ Error en fetch ${endpoint}:`, err.message);
    throw err;
  }
}

// 🔹 Funciones específicas
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