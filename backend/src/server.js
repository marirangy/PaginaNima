import mongoose from 'mongoose';
import Centro from './models/Centro.js';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import directoriosRouter from './routes/directorios.js';
import faqsRouter from './routes/faqs.js';
import testimoniosRouter from './routes/testimonios.js';

dotenv.config();

const app = express();

// 🔥 CONFIGURACIÓN DE CORS (IMPORTANTE)
const allowedOrigins = [
  "http://localhost:5173", // desarrollo local (Vite)
  "https://pagina-nima.vercel.app" // 👈 CAMBIA esto por tu URL real
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // permite Postman o pruebas
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("❌ No permitido por CORS"));
    }
  }
}));

// 🔥 MIDDLEWARES
app.use(express.json());

// 🔍 Verificar URI
console.log('🔍 URI de conexión:', process.env.MONGO_URI);

// 🔗 Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Conectado a MongoDB Atlas'))
  .catch(err => console.error('❌ Error de conexión:', err));

// ✅ Ruta raíz
app.get('/', (req, res) => {
  res.send('Backend desplegado correctamente 🚀');
});

// ✅ Ruta de salud
app.get('/api/health', (req, res) => {
  res.json({ message: 'NIMA Backend is running!' });
});

// ✅ Centros
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

// 🚀 Servidor
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});