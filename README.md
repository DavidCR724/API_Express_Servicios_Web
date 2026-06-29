# API Express - CRUD de Usuarios

API REST sencilla construida con **Node.js + Express 5** que gestiona usuarios en memoria
(GET, POST, PUT, DELETE).

## Requisitos

- **Node.js 18 o superior** y **npm**
- **git**

## Endpoints

| Método | Ruta             | Descripción                         | Body (JSON)                          |
|--------|------------------|-------------------------------------|--------------------------------------|
| GET    | `/usuarios`      | Lista todos los usuarios            | —                                    |
| POST   | `/usuarios`      | Crea un usuario                     | `{ "usuario", "password", "rol" }`   |
| PUT    | `/usuarios/:id`  | Actualiza un usuario por su `id`    | `{ "usuario", "password", "rol" }`   |
| DELETE | `/usuarios/:id`  | Elimina un usuario por su `id`      | —                                    |

> Los datos viven en memoria: al reiniciar el servidor se restablecen al usuario `Admin` inicial.

## Variables de entorno

| Variable | Por defecto | Descripción                |
|----------|-------------|----------------------------|
| `PORT`   | `3000`      | Puerto donde escucha la API |

---

## Deploy en servidor Ubuntu

### 1. Instalar Node.js 18+ (si no está instalado)

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
node -v   # debe mostrar v18 o superior
```

### 2. Clonar el repositorio

```bash
git clone https://github.com/DavidCR724/API_Express_Servicios_Web.git
cd API_Express_Servicios_Web
```

### 3. Instalar dependencias

```bash
npm install
```

### 4. Levantar el servidor

```bash
npm start
```

Deberías ver: `Servidor corriendo en el puerto 3000`.

Para usar otro puerto:

```bash
PORT=8080 npm start
```

### 5. (Recomendado) Mantenerlo corriendo con PM2

`npm start` se detiene al cerrar la terminal. Para que el servicio quede activo
permanentemente, usa **PM2**:

```bash
sudo npm install -g pm2
pm2 start index.js --name api-usuarios
pm2 save
pm2 startup        # ejecuta el comando que te imprima para que arranque al reiniciar
```

Comandos útiles de PM2:

```bash
pm2 logs api-usuarios     # ver logs
pm2 restart api-usuarios  # reiniciar
pm2 stop api-usuarios     # detener
pm2 list                  # ver estado
```

### 6. Abrir el puerto en el firewall (si aplica)

```bash
sudo ufw allow 3000/tcp
```

---

## Probar la API (cliente)

Reemplaza `<IP_SERVIDOR>` por la IP del servidor Ubuntu (o `localhost` si pruebas en la misma máquina).

### Con HTTPie

```bash
# Listar usuarios
http GET http://<IP_SERVIDOR>:3000/usuarios

# Crear usuario
http POST http://<IP_SERVIDOR>:3000/usuarios usuario=Juan password=abc123 rol=editor

# Actualizar usuario (usa un id real obtenido del GET)
http PUT http://<IP_SERVIDOR>:3000/usuarios/<ID> rol=administrador

# Eliminar usuario
http DELETE http://<IP_SERVIDOR>:3000/usuarios/<ID>
```

### Con cURL

```bash
# Listar
curl http://<IP_SERVIDOR>:3000/usuarios

# Crear
curl -X POST http://<IP_SERVIDOR>:3000/usuarios \
  -H "Content-Type: application/json" \
  -d '{"usuario":"Juan","password":"abc123","rol":"editor"}'

# Actualizar
curl -X PUT http://<IP_SERVIDOR>:3000/usuarios/<ID> \
  -H "Content-Type: application/json" \
  -d '{"rol":"administrador"}'

# Eliminar
curl -X DELETE http://<IP_SERVIDOR>:3000/usuarios/<ID>
```

### Con Postman

1. Crea una request con la URL `http://<IP_SERVIDOR>:3000/usuarios`.
2. Para `POST`/`PUT`: pestaña **Body** → **raw** → tipo **JSON**, y envía el objeto con `usuario`, `password`, `rol`.
3. Para `PUT`/`DELETE`: agrega el `id` al final de la URL (`/usuarios/<ID>`).
