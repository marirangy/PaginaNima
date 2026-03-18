// server.js
import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import Centro from './models/Centro.js';
import directoriosRouter from './routes/directorios.js';
import faqsRouter from './routes/faqs.js';
import testimoniosRouter from './routes/testimonios.js';

dotenv.config();

const app = express();

// 🔹 CORS configurado para frontend de Vercel
// Si FRONTEND_URL no está definido, permite todos (solo para desarrollo)
const FRONTEND_URL = process.env.FRONTEND_URL || '*';
app.use(cors({
  origin: FRONTEND_URL
}));

// 🔹 Middlewares
app.use(express.json());

// 🔍 Conexión a MongoDB Atlas
if (!process.env.MONGO_URI) {
  console.error('❌ ERROR: MONGO_URI no está definida');
  process.exit(1); // Termina la app si no hay URI
}

console.log('🔍 URI de conexión a MongoDB:', process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('✅ Conectado a MongoDB Atlas'))
  .catch(err => {
    console.error('❌ Error de conexión a MongoDB:', err);
    process.exit(1);
  });

// ✅ Ruta raíz
app.get('/', (req, res) => {
  res.send('Backend desplegado correctamente 🚀');
});

// ✅ Ruta de salud
app.get('/api/health', (req, res) => {
  res.json({ message: 'NIMA Backend is running!' });
});

// ✅ Rutas de Centros, Directorios, FAQs y Testimonios
// Centros - usando modelo directamente
app.get('/api/centros', async (req, res) => {
  try {
    const centros = await Centro.find();
    res.json(centros);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener los centros' });
  }
});

// Rutas externas
app.use('/api/directorios', directoriosRouter);
app.use('/api/faqs', faqsRouter);
app.use('/api/testimonios', testimoniosRouter);

// 🚀 Servidor escucha en el puerto de Render
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});