import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Colección Usuarios { _id, usuario, password, rol }
const usuarioSchema = new mongoose.Schema({
    usuario: { type: String, required: true },
    password: { type: String, required: true },
    rol: { type: String, required: true }
});

// Antes de guardar, encriptamos el password (solo si cambió).
// Esto cubre tanto la creación (POST) como la actualización (PUT) vía save().
usuarioSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Método auxiliar para comparar un password en texto plano contra el encriptado.
usuarioSchema.methods.compararPassword = function (passwordPlano) {
    return bcrypt.compare(passwordPlano, this.password);
};

export default mongoose.model('Usuario', usuarioSchema);
