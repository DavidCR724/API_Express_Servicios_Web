import 'dotenv/config';
import express from 'express';
import conectarDB from './config/db.js';
import usuariosRouter from './routes/usuarios.js';
import articulosRouter from './routes/articulos.js';
import clientesRouter from './routes/clientes.js';

const app = express();

app.use(express.json());

// Conexión a la base de datos MongoDB
conectarDB();

// Rutas de cada colección
app.use('/usuarios', usuariosRouter);
app.use('/articulos', articulosRouter);
app.use('/clientes', clientesRouter);

const PORT = process.env.PORT || 3000; // Puerto configurable por variable de entorno
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
