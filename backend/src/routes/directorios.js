import express from "express";
import Directorio from "../models/Directorio.js"; // asegúrate que esté

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const directorios = await Directorio.find();
    res.json(directorios); // ✅ AQUÍ va el cambio
  } catch (error) {
    res.status(500).json({ error: "Error al obtener directorios" });
  }
});

export default router;