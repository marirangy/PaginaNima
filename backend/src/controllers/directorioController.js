import Directorio from '../models/Directorio.js';

export const listarDirectorios = async (req, res) => {
  try {
    const datos = await Centro.find();
    res.json(datos);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener directorios" });
  }
};