import mongoose from 'mongoose';

const faqSchema = new mongoose.Schema({
  question: { type: String, required: true },   // La pregunta
  answer:   { type: String, required: true },   // La respuesta
  category: { type: String },                   // Categoría (ej. General, Legal, Emergencias)
  order:    { type: Number, default: 0 },       // Orden para mostrar
  isActive: { type: Boolean, default: true },   // Si está activa o no
  slug:     { type: String }                    // Slug para URL amigable
});

export default mongoose.model('Faq', faqSchema, 'preguntas_frecuentes');