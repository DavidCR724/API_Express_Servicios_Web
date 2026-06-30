import express from 'express';
import Usuario from '../models/Usuario.js';

const router = express.Router();

// GET sin parámetro: todos los usuarios
router.get('/', async (req, res) => {
    try {
        const usuarios = await Usuario.find();
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener los usuarios', error: error.message });
    }
});

// GET con parámetro: un usuario por su id
router.get('/:id', async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.params.id);
        if (!usuario) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }
        res.json(usuario);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener el usuario', error: error.message });
    }
});

// POST: crear un usuario (el password se encripta en el modelo)
router.post('/', async (req, res) => {
    try {
        const { usuario, password, rol } = req.body;
        const nuevoUsuario = new Usuario({ usuario, password, rol });
        await nuevoUsuario.save();
        res.status(201).json({ mensaje: 'Usuario creado exitosamente', usuario: nuevoUsuario });
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al crear el usuario', error: error.message });
    }
});

// PUT: actualizar un usuario por su id
router.put('/:id', async (req, res) => {
    try {
        const { usuario, password, rol } = req.body;
        const usuarioExistente = await Usuario.findById(req.params.id);
        if (!usuarioExistente) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado para actualizar' });
        }

        // Solo actualizamos los campos enviados
        if (usuario !== undefined) usuarioExistente.usuario = usuario;
        if (rol !== undefined) usuarioExistente.rol = rol;
        if (password !== undefined) usuarioExistente.password = password; // se re-encripta al guardar

        await usuarioExistente.save();
        res.json({ mensaje: 'Usuario actualizado', usuario: usuarioExistente });
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al actualizar el usuario', error: error.message });
    }
});

// DELETE: eliminar un usuario por su id
router.delete('/:id', async (req, res) => {
    try {
        const usuarioEliminado = await Usuario.findByIdAndDelete(req.params.id);
        if (!usuarioEliminado) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }
        res.json({ mensaje: 'Usuario eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar el usuario', error: error.message });
    }
});

export default router;
