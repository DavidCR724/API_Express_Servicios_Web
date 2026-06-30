# API Express + MongoDB - Servicios Web

API REST construida con **Node.js + Express 5**, base de datos **MongoDB** y el ORM **Mongoose**.
Gestiona 3 colecciones con CRUD completo (GET, POST, PUT, DELETE). El password de los usuarios
se guarda **encriptado** con bcrypt.

## Colecciones

| Colección  | Campos                                    |
|------------|-------------------------------------------|
| Usuarios   | `_id`, `usuario`, `password`, `rol`       |
| Articulos  | `_id`, `articulo`, `descripcion`, `precio`|
| Clientes   | `_id`, `nombre`, `telefono`               |

> El `_id` lo genera MongoDB automáticamente. El password se almacena encriptado (bcrypt).

## Estructura del proyecto

```
config/db.js          Conexión a MongoDB
models/               Esquemas Mongoose (Usuario, Articulo, Cliente)
routes/               Rutas CRUD de cada colección
index.js              Punto de entrada (conecta BD + monta rutas)
.env.example          Plantilla de variables de entorno
```

## Requisitos

- **Node.js 18 o superior** y **npm**
- **MongoDB** (local o MongoDB Atlas)
- **git**

## Endpoints

Mismo patrón para las 3 rutas: `/usuarios`, `/articulos`, `/clientes`.

| Método | Ruta              | Descripción                          |
|--------|-------------------|--------------------------------------|
| GET    | `/recurso`        | Lista todos (sin parámetro)          |
| GET    | `/recurso/:id`    | Obtiene uno por su `id` (parámetro)  |
| POST   | `/recurso`        | Crea un registro                     |
| PUT    | `/recurso/:id`    | Actualiza un registro por su `id`    |
| DELETE | `/recurso/:id`    | Elimina un registro por su `id`      |

Bodies (JSON) para POST/PUT:

- **Usuarios:** `{ "usuario", "password", "rol" }`
- **Articulos:** `{ "articulo", "descripcion", "precio" }`
- **Clientes:** `{ "nombre", "telefono" }`

## Variables de entorno

Copia `.env.example` a `.env` y ajusta los valores.

| Variable      | Por defecto                                  | Descripción                  |
|---------------|----------------------------------------------|------------------------------|
| `PORT`        | `3000`                                       | Puerto donde escucha la API  |
| `MONGODB_URI` | `mongodb://127.0.0.1:27017/serviciosweb`     | Cadena de conexión a MongoDB |

---

## Deploy en servidor Ubuntu

### 1. Instalar Node.js 18+ (si no está instalado)

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
node -v   # debe mostrar v18 o superior
```

### 2. Instalar y arrancar MongoDB

**Opción A — MongoDB local** (instalar el motor en el mismo servidor):

```bash
sudo apt-get install -y gnupg curl
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | \
  sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | \
  sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl enable --now mongod
sudo systemctl status mongod   # debe aparecer "active (running)"
```

Con esto, la base de datos `serviciosweb` se crea **sola** la primera vez que la API
inserta un documento. No hace falta crearla a mano.

**Opción B — MongoDB Atlas** (base de datos en la nube): crea un cluster gratuito en
<https://www.mongodb.com/atlas>, obtén la cadena de conexión y úsala en `MONGODB_URI`
(paso 5).

### 3. Clonar el repositorio

```bash
git clone https://github.com/DavidCR724/API_Express_Servicios_Web.git
cd API_Express_Servicios_Web
```

### 4. Instalar dependencias

```bash
npm install
```

### 5. Configurar las variables de entorno

```bash
cp .env.example .env
nano .env          # ajusta MONGODB_URI si usas Atlas; con MongoDB local déjalo como está
```

### 6. Levantar el servidor

```bash
npm start
```

Deberías ver:

```
Conexión a MongoDB establecida correctamente
Servidor corriendo en el puerto 3000
```

> Si ves "Error al conectar con MongoDB", revisa que el servicio `mongod` esté corriendo
> (`sudo systemctl status mongod`) o que la `MONGODB_URI` de Atlas sea correcta.

### 7. (Recomendado) Mantenerlo corriendo con PM2

```bash
sudo npm install -g pm2
pm2 start index.js --name api-servicios
pm2 save
pm2 startup        # ejecuta el comando que te imprima para que arranque al reiniciar
```

Comandos útiles: `pm2 logs api-servicios`, `pm2 restart api-servicios`, `pm2 list`.

### 8. Abrir el puerto en el firewall (si aplica)

```bash
sudo ufw allow 3000/tcp
```

---

## Probar la API (cliente)

Reemplaza `<IP_SERVIDOR>` por la IP del servidor Ubuntu (o `localhost` si pruebas en la misma máquina).
El `<ID>` se obtiene del `GET` de la lista. Las colecciones inician vacías: primero crea registros con `POST`.

### Con HTTPie

```bash
# ---- Usuarios ----
http GET    http://<IP_SERVIDOR>:3000/usuarios
http POST   http://<IP_SERVIDOR>:3000/usuarios usuario=Juan password=abc123 rol=editor
http GET    http://<IP_SERVIDOR>:3000/usuarios/<ID>
http PUT    http://<IP_SERVIDOR>:3000/usuarios/<ID> rol=administrador
http DELETE http://<IP_SERVIDOR>:3000/usuarios/<ID>

# ---- Articulos ----
http POST   http://<IP_SERVIDOR>:3000/articulos articulo=Laptop descripcion="Core i5" precio:=12000
http GET    http://<IP_SERVIDOR>:3000/articulos

# ---- Clientes ----
http POST   http://<IP_SERVIDOR>:3000/clientes nombre=Maria telefono=9511234567
http GET    http://<IP_SERVIDOR>:3000/clientes
```

> En HTTPie, `precio:=12000` con `:=` envía el valor como número (no como texto).

### Con cURL

```bash
# Crear usuario
curl -X POST http://<IP_SERVIDOR>:3000/usuarios \
  -H "Content-Type: application/json" \
  -d '{"usuario":"Juan","password":"abc123","rol":"editor"}'

# Listar usuarios
curl http://<IP_SERVIDOR>:3000/usuarios

# Crear artículo
curl -X POST http://<IP_SERVIDOR>:3000/articulos \
  -H "Content-Type: application/json" \
  -d '{"articulo":"Laptop","descripcion":"Core i5","precio":12000}'

# Crear cliente
curl -X POST http://<IP_SERVIDOR>:3000/clientes \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Maria","telefono":"9511234567"}'
```

### Con Postman

1. URL: `http://<IP_SERVIDOR>:3000/usuarios` (o `/articulos`, `/clientes`).
2. Para `POST`/`PUT`: pestaña **Body** → **raw** → tipo **JSON**, y envía el objeto con los campos de esa colección.
3. Para `GET (uno)`/`PUT`/`DELETE`: agrega el `id` al final de la URL (`/usuarios/<ID>`).

> Nota: al consultar un usuario verás el `password` encriptado (hash bcrypt), lo que confirma que la encriptación funciona.
