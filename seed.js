import 'dotenv/config';
import mongoose from 'mongoose';

import Usuario from './models/Usuario.js';
import Articulo from './models/Articulo.js';
import Cliente from './models/Cliente.js';

// Script de "siembra" (seed) de la base de datos.
// MongoDB crea la base de datos y las colecciones automáticamente al insertar
// el primer documento, por lo que no hace falta ningún paso previo de migración.
//
// Uso:  npm run seed
// (Vacía las colecciones y las vuelve a llenar con datos de ejemplo.)

const usuarios = [
    { usuario: 'admin', password: 'admin123', rol: 'administrador' },
    { usuario: 'jperez', password: 'juan123', rol: 'vendedor' },
    { usuario: 'mlopez', password: 'maria123', rol: 'cliente' }
];

const articulos = [
    { articulo: 'Teclado mecánico', descripcion: 'Switches azules, retroiluminado', precio: 899.99 },
    { articulo: 'Mouse inalámbrico', descripcion: 'Sensor óptico 1600 DPI', precio: 349.5 },
    { articulo: 'Monitor 24"', descripcion: 'Full HD 1080p, 75 Hz', precio: 2499 },
    { articulo: 'Audífonos', descripcion: 'Con micrófono y cancelación de ruido', precio: 599 }
];

const clientes = [
    { nombre: 'Ana García', telefono: '9511234567' },
    { nombre: 'Carlos Ramírez', telefono: '9517654321' },
    { nombre: 'Lucía Hernández', telefono: '9519998888' }
];

const sembrar = async () => {
    try {
        const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/serviciosweb';
        await mongoose.connect(uri);
        console.log('Conexión a MongoDB establecida correctamente');

        // Limpiamos las colecciones para que el seed sea repetible (idempotente).
        await Promise.all([
            Usuario.deleteMany({}),
            Articulo.deleteMany({}),
            Cliente.deleteMany({})
        ]);
        console.log('Colecciones vaciadas');

        // Usuarios: usamos create() para que se dispare el hook pre('save')
        // y las contraseñas queden encriptadas con bcrypt.
        await Usuario.create(usuarios);
        console.log(`Usuarios insertados: ${usuarios.length}`);

        // Artículos y clientes no requieren hooks, insertMany es suficiente.
        await Articulo.insertMany(articulos);
        console.log(`Artículos insertados: ${articulos.length}`);

        await Cliente.insertMany(clientes);
        console.log(`Clientes insertados: ${clientes.length}`);

        console.log('Base de datos sembrada correctamente ✔');
    } catch (error) {
        console.error('Error al sembrar la base de datos:', error.message);
        process.exitCode = 1;
    } finally {
        await mongoose.disconnect();
        console.log('Conexión cerrada');
    }
};

sembrar();
