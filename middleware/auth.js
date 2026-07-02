import jwt from 'jsonwebtoken';

// Secreto y tiempo de vida del token. Se configuran por variables de entorno;
// el secreto DEBE cambiarse en producción (ver .env.example).
const JWT_SECRET = process.env.JWT_SECRET || 'cambia_este_secreto_en_produccion';
const JWT_EXPIRES = process.env.JWT_EXPIRES || '5m'; // 5 minutos de vida

// Genera un token firmado con los datos del usuario.
export const generarToken = (payload) =>
    jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });

// Middleware: exige un token JWT válido en el header
//   Authorization: Bearer <token>
// Si falta, es inválido o expiró, corta la petición con 401.
export const verificarToken = (req, res, next) => {
    const header = req.headers.authorization || '';
    const [tipo, token] = header.split(' ');

    if (tipo !== 'Bearer' || !token) {
        return res.status(401).json({
            mensaje: 'Token no proporcionado. Envía el header Authorization: Bearer <token>'
        });
    }

    try {
        // Guardamos los datos del usuario para que las rutas puedan usarlos.
        req.usuario = jwt.verify(token, JWT_SECRET);
        next();
    } catch (error) {
        const expirado = error.name === 'TokenExpiredError';
        return res.status(401).json({
            mensaje: expirado
                ? 'Token expirado, vuelve a iniciar sesión'
                : 'Token inválido'
        });
    }
};

export { JWT_EXPIRES };
