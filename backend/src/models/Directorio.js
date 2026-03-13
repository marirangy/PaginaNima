import mongoose from 'mongoose';

const directorioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  especialidad: { type: String },
  tipo: { type: String },
  telefono: [{ type: String }],   
  correo: { type: String },
  direccion: { type: String },
  posicion: {
    lat: { type: Number },
    lng: { type: Number }
  }
});


export default mongoose.model('Directorio', directorioSchema, 'directorios');