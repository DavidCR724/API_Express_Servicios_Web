import express from 'express';
import {v4 as uuidv4} from 'uuid';

const app = express();

app.use(express.json());

let usuarios = [
    {
        id: uuidv4(),
        usuario: "Admin",
        password: "123456",
        rol: "administrador"
    }
];

app.get('/usuarios', (req, res) => {
    res.json(usuarios); 
});

/*
======= MÉTODO GET CON PARÁMETRO (id) =======

app.get('/usuarios/:id', (req, res) => {
    const { id } = req.params; // Extraemos el ID de la URL [cite: 152]
    const usuarioEncontrado = usuarios.find(user => user.id === id); // Buscamos coincidencia [cite: 169]

    if (!usuarioEncontrado) {
        return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }
    res.json(usuarioEncontrado);
});
*/

app.post('/usuarios', (req, res) => {
    const { usuario, password, rol } = req.body; // Capturamos los datos enviados [cite: 171]

    const nuevoUsuario = {
        id: uuidv4(), // Generamos el ID automáticamente [cite: 143]
        usuario,
        password,
        rol
    };

    usuarios.push(nuevoUsuario); // Lo guardamos en el arreglo [cite: 136]
    res.status(201).json({ mensaje: "Usuario creado exitosamente", usuario: nuevoUsuario });
});

app.put('/usuarios/:id', (req, res) => {
    const { id } = req.params; // ID a buscar [cite: 82]
    const { usuario, password, rol } = req.body; // Nuevos datos [cite: 171]

    const index = usuarios.findIndex(user => user.id === id); // Buscamos su posición [cite: 82]

    if (index === -1) {
        return res.status(404).json({ mensaje: "Usuario no encontrado para actualizar" });
    }

    // Actualizamos el objeto en esa posición [cite: 83]
    usuarios[index] = {
        ...usuarios[index], // Mantenemos el ID original [cite: 83]
        usuario: usuario || usuarios[index].usuario,
        password: password || usuarios[index].password,
        rol: rol || usuarios[index].rol
    };

    res.json({ mensaje: "Usuario actualizado", usuario: usuarios[index] });
});

app.delete('/usuarios/:id', (req, res) => {
    const { id } = req.params; // ID del usuario a borrar [cite: 157]

    // Sobrescribimos el arreglo excluyendo al usuario con ese ID [cite: 158]
    const usuariosFiltrados = usuarios.filter(user => user.id !== id);

    if (usuarios.length === usuariosFiltrados.length) {
        return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    usuarios = usuariosFiltrados;
    res.json({ mensaje: "Usuario eliminado exitosamente" });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});