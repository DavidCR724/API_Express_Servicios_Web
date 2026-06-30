import express from 'express';
import Articulo from '../models/Articulo.js';

const router = express.Router();

// GET sin parámetro: todos los artículos
router.get('/', async (req, res) => {
    try {
        const articulos = await Articulo.find();
        res.json(articulos);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener los artículos', error: error.message });
    }
});

// GET con parámetro: un artículo por su id
router.get('/:id', async (req, res) => {
    try {
        const articulo = await Articulo.findById(req.params.id);
        if (!articulo) {
            return res.status(404).json({ mensaje: 'Artículo no encontrado' });
        }
        res.json(articulo);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener el artículo', error: error.message });
    }
});

// POST: crear un artículo
router.post('/', async (req, res) => {
    try {
        const { articulo, descripcion, precio } = req.body;
        const nuevoArticulo = new Articulo({ articulo, descripcion, precio });
        await nuevoArticulo.save();
        res.status(201).json({ mensaje: 'Artículo creado exitosamente', articulo: nuevoArticulo });
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al crear el artículo', error: error.message });
    }
});

// PUT: actualizar un artículo por su id
router.put('/:id', async (req, res) => {
    try {
        const { articulo, descripcion, precio } = req.body;
        const articuloActualizado = await Articulo.findByIdAndUpdate(
            req.params.id,
            { articulo, descripcion, precio },
            { new: true, runValidators: true }
        );
        if (!articuloActualizado) {
            return res.status(404).json({ mensaje: 'Artículo no encontrado para actualizar' });
        }
        res.json({ mensaje: 'Artículo actualizado', articulo: articuloActualizado });
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al actualizar el artículo', error: error.message });
    }
});

// DELETE: eliminar un artículo por su id
router.delete('/:id', async (req, res) => {
    try {
        const articuloEliminado = await Articulo.findByIdAndDelete(req.params.id);
        if (!articuloEliminado) {
            return res.status(404).json({ mensaje: 'Artículo no encontrado' });
        }
        res.json({ mensaje: 'Artículo eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar el artículo', error: error.message });
    }
});

export default router;
