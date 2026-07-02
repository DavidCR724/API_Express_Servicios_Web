import 'dotenv/config';
import express from 'express';
import conectarDB from './config/db.js';
import authRouter from './routes/auth.js';
import usuariosRouter from './routes/usuarios.js';
import articulosRouter from './routes/articulos.js';
import clientesRouter from './routes/clientes.js';
import { verificarToken } from './middleware/auth.js';

const app = express();

app.use(express.json());

// Conexión a la base de datos MongoDB
conectarDB();

// Ruta pública: login para obtener el token JWT.
app.use('/auth', authRouter);

// Rutas de cada colección. Protegidas: exigen un token JWT válido.
// Ninguna petición pasa sin que el usuario haya iniciado sesión.
app.use('/usuarios', verificarToken, usuariosRouter);
app.use('/articulos', verificarToken, articulosRouter);
app.use('/clientes', verificarToken, clientesRouter);

const PORT = process.env.PORT || 3000; // Puerto configurable por variable de entorno
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
