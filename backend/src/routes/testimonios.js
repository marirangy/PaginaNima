import express from "express";
import Testimonio from "../models/Testimonio.js";

const router = express.Router();


router.get("/", async (req, res) => {
  try {
    const testimonios = await Testimonio.find();
    res.json(testimonios);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener testimonios", error });
  }
});

export default router;
