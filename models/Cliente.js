import mongoose from 'mongoose';

// Colección Clientes { _id, nombre, telefono }
const clienteSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    telefono: { type: String }
});

export default mongoose.model('Cliente', clienteSchema);
