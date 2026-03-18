import mongoose from 'mongoose';
import Directorio from '../models/Directorio.js';

export const listarDirectorios = async (req, res) => {
  try {
    const dbName = mongoose.connection.name;
    const collections = await mongoose.connection.db.listCollections().toArray();

    const datos = await Directorio.find();

    res.json({
      dbActual: dbName,
      colecciones: collections.map(c => c.name),
      cantidad: datos.length,
      datos: datos
    });

  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};