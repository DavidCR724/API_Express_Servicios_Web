import express from 'express';
import Usuario from '../models/Usuario.js';
import { generarToken, JWT_EXPIRES } from '../middleware/auth.js';

const router = express.Router();

// POST /auth/login
// Body: { usuario, password }  ->  { token }
// Ruta PÚBLICA: es la única forma de obtener un token para el resto de la API.
router.post('/login', async (req, res) => {
    try {
        const { usuario, password } = req.body;
        if (!usuario || !password) {
            return res.status(400).json({ mensaje: 'usuario y password son obligatorios' });
        }

        // Buscamos el usuario y comparamos el password contra el hash bcrypt.
        // Usamos el mismo mensaje para "no existe" y "password incorrecto" para
        // no revelar cuál de los dos falló.
        const encontrado = await Usuario.findOne({ usuario });
        const passwordOk = encontrado && (await encontrado.compararPassword(password));

        if (!passwordOk) {
            return res.status(401).json({ mensaje: 'Credenciales inválidas' });
        }

        const token = generarToken({
            id: encontrado._id,
            usuario: encontrado.usuario,
            rol: encontrado.rol
        });

        res.json({
            mensaje: 'Inicio de sesión exitoso',
            token,
            expiraEn: JWT_EXPIRES
        });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al iniciar sesión', error: error.message });
    }
});

export default router;
