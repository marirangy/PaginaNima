const API_URL = import.meta.env.VITE_API_URL;

export const getCentros = async () => {
  const response = await fetch(`${API_URL}/api/centros`);

  if (!response.ok) {
    throw new Error("Error al obtener centros");
  }

  return response.json();
};