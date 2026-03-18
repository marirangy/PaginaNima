import mongoose from 'mongoose';
import Centro from './models/Centro.js';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import directoriosRouter from './routes/directorios.js';
import faqsRouter from './routes/faqs.js';
import testimoniosRouter from './routes/testimonios.js';

dotenv.config();

console.log('🔍 URI de conexión:', process.env.MONGO_URI);

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Conectado a MongoDB Atlas'))
  .catch(err => console.error('❌ Error de conexión:', err));

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Ruta raíz
app.get('/', (req, res) => {
  res.send('Backend desplegado correctamente 🚀');
});

// Ruta de salud
app.get('/api/health', (req, res) => {
  res.json({ message: 'NIMA Backend is running!' });
});

// Rutas de Centros
app.get('/api/centros', async (req, res) => {
  try {
    const centros = await Centro.find();
    res.json(centros);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener los centros' });
  }
});

// Rutas de Directorios
app.use('/api/directorios', directoriosRouter);

// Rutas de FAQs
app.use('/api/faqs', faqsRouter);

// Rutas de Testimonios
app.use('/api/testimonios', testimoniosRouter);

// 👉 Exporta la app para Vercel
export default app;