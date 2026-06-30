import express from 'express';
import Cliente from '../models/Cliente.js';

const router = express.Router();

// GET sin parámetro: todos los clientes
router.get('/', async (req, res) => {
    try {
        const clientes = await Cliente.find();
        res.json(clientes);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener los clientes', error: error.message });
    }
});

// GET con parámetro: un cliente por su id
router.get('/:id', async (req, res) => {
    try {
        const cliente = await Cliente.findById(req.params.id);
        if (!cliente) {
            return res.status(404).json({ mensaje: 'Cliente no encontrado' });
        }
        res.json(cliente);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener el cliente', error: error.message });
    }
});

// POST: crear un cliente
router.post('/', async (req, res) => {
    try {
        const { nombre, telefono } = req.body;
        const nuevoCliente = new Cliente({ nombre, telefono });
        await nuevoCliente.save();
        res.status(201).json({ mensaje: 'Cliente creado exitosamente', cliente: nuevoCliente });
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al crear el cliente', error: error.message });
    }
});

// PUT: actualizar un cliente por su id
router.put('/:id', async (req, res) => {
    try {
        const { nombre, telefono } = req.body;
        const clienteActualizado = await Cliente.findByIdAndUpdate(
            req.params.id,
            { nombre, telefono },
            { new: true, runValidators: true }
        );
        if (!clienteActualizado) {
            return res.status(404).json({ mensaje: 'Cliente no encontrado para actualizar' });
        }
        res.json({ mensaje: 'Cliente actualizado', cliente: clienteActualizado });
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al actualizar el cliente', error: error.message });
    }
});

// DELETE: eliminar un cliente por su id
router.delete('/:id', async (req, res) => {
    try {
        const clienteEliminado = await Cliente.findByIdAndDelete(req.params.id);
        if (!clienteEliminado) {
            return res.status(404).json({ mensaje: 'Cliente no encontrado' });
        }
        res.json({ mensaje: 'Cliente eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar el cliente', error: error.message });
    }
});

export default router;
