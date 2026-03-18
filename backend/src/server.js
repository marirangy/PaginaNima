import mongoose from 'mongoose';
import Centro from './models/Centro.js';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import directoriosRouter from './routes/directorios.js';
import faqsRouter from './routes/faqs.js';
import testimoniosRouter from './routes/testimonios.js';

dotenv.config();

// 🔍 Verificar URI (opcional)
console.log('🔍 URI de conexión:', process.env.MONGO_URI);

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Conectado a MongoDB Atlas'))
  .catch(err => console.error('❌ Error de conexión:', err));

const app = express();

// 🔥 MIDDLEWARES (orden correcto)
app.use(cors());
app.use(express.json());

// ✅ Ruta raíz
app.get('/', (req, res) => {
  res.send('Backend desplegado correctamente 🚀');
});

// ✅ Ruta de salud
app.get('/api/health', (req, res) => {
  res.json({ message: 'NIMA Backend is running!' });
});

// ✅ Rutas de Centros
app.get('/api/centros', async (req, res) => {
  try {
    const centros = await Centro.find();
    res.json(centros);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener los centros' });
  }
});

// ✅ Rutas externas
app.use('/api/directorios', directoriosRouter);
app.use('/api/faqs', faqsRouter);
app.use('/api/testimonios', testimoniosRouter);

// 🚀 IMPORTANTE: levantar servidor (esto es lo que te faltaba)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});