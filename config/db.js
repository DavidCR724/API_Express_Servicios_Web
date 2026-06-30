import mongoose from 'mongoose';

// Conexión a MongoDB usando la URI definida en las variables de entorno.
// Si no se define MONGODB_URI, se usa una base local por defecto.
const conectarDB = async () => {
    try {
        const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/serviciosweb';
        await mongoose.connect(uri);
        console.log('Conexión a MongoDB establecida correctamente');
    } catch (error) {
        console.error('Error al conectar con MongoDB:', error.message);
        process.exit(1); // Detenemos la app si no hay conexión a la base de datos
    }
};

export default conectarDB;
