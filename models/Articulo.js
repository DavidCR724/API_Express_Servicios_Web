import mongoose from 'mongoose';

// Colección Articulos { _id, articulo, descripcion, precio }
const articuloSchema = new mongoose.Schema({
    articulo: { type: String, required: true },
    descripcion: { type: String },
    precio: { type: Number, required: true }
});

export default mongoose.model('Articulo', articuloSchema);
