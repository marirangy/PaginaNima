const API_URL = import.meta.env.VITE_API_URL;

export const getDirectorios = async () => {
  const response = await fetch(`${API_URL}/api/directorios`);

  if (!response.ok) {
    throw new Error("Error al obtener directorios");
  }

  return response.json();
};
