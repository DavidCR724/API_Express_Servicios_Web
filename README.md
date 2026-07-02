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
seed.js               Script para poblar la BD con datos de ejemplo
.env.example          Plantilla de variables de entorno
```

## Requisitos

- **Node.js 20 o superior** (recomendado) y **npm**. Funciona también en Node 18,
  ya que el código incluye un *polyfill* para la Web Crypto API que bcrypt necesita.
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

### 1. Instalar Node.js 20+ (si no está instalado)

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
node -v   # debe mostrar v20 o superior
```

> Se recomienda Node 20 LTS. Si en el servidor solo hay Node 18, la API igual
> funciona: el modelo de usuarios activa un *polyfill* de `crypto` para bcrypt.

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

### 7. (Opcional) Cargar datos de ejemplo (seed)

El proyecto incluye un script que **vacía** las colecciones y las llena con datos de
prueba (3 usuarios con password encriptado, 4 artículos y 3 clientes):

```bash
npm run seed
```

MongoDB crea la base de datos y las colecciones **automáticamente** al insertar el
primer documento; no hace falta ningún paso previo (no existe un "db push" como en
otros ORMs). El script es idempotente: puedes ejecutarlo las veces que quieras.

### 8. (Recomendado) Mantenerlo corriendo con PM2

```bash
sudo npm install -g pm2
pm2 start index.js --name api-servicios
pm2 save
pm2 startup        # ejecuta el comando que te imprima para que arranque al reiniciar
```

Comandos útiles: `pm2 logs api-servicios`, `pm2 restart api-servicios`, `pm2 list`.

### 9. Abrir el puerto en el firewall (si aplica)

```bash
sudo ufw allow 3000/tcp
```

---

## Probar la API (cliente)

Reemplaza `<IP_SERVIDOR>` por la IP del servidor Ubuntu (o `localhost` si pruebas en la misma máquina).
El `<ID>` se obtiene del `GET` de la lista. Si no corriste el *seed* (paso 7), las colecciones
inician vacías: primero crea registros con `POST`.

> **Importante — `localhost` no sirve entre máquinas.** Si tu cliente (HTTPie, Postman…)
> está en otra computadora que el servidor (por ejemplo, HTTPie en Windows y la API en
> una VM Ubuntu con IP `192.168.1.110`), usa la **IP del servidor**, no `localhost`:
> `http://192.168.1.110:3000/usuarios`. `localhost` siempre apunta a la propia máquina
> del cliente. El servidor ya escucha en todas las interfaces (`0.0.0.0`), así que es
> alcanzable desde la red sin cambios.

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

### Con HTTPie (app de escritorio)

1. **New Request** → elige el método (GET, POST, PUT, DELETE) en el desplegable.
2. URL: `http://<IP_SERVIDOR>:3000/usuarios` (o `/articulos`, `/clientes`).
3. Solo para `POST`/`PUT`: pestaña **Body** → **JSON** y escribe el objeto con los campos
   de esa colección. HTTPie agrega el header `Content-Type: application/json` solo.
4. **Send**. La respuesta (status + JSON) aparece a la derecha.
5. Para `GET (uno)`/`PUT`/`DELETE`, agrega el `id` al final de la URL (`/usuarios/<ID>`),
   copiándolo de un `GET` a la lista.

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

---

## Solución de problemas

### `crypto is not defined` al crear/actualizar usuarios

bcryptjs v3 usa la Web Crypto API global (`globalThis.crypto`), que en **Node 18** no
está activada por defecto. El código ya incluye un *polyfill* en `models/Usuario.js`
que lo resuelve. Si aun así aparece, actualiza a **Node 20+** (paso 1) o verifica que
tu copia del repo esté al día (`git pull`).

### `connection refused` o *timeout* desde HTTPie/Postman

El cliente no alcanza al servidor. Revisa en orden:

1. **URL correcta:** usa la IP del servidor, no `localhost` (ver nota arriba).
2. **Puerto abierto (desde Windows, PowerShell):**
   ```powershell
   Test-NetConnection <IP_SERVIDOR> -Port 3000
   ```
   Si `TcpTestSucceeded : True`, la red está bien; el problema es otro.
3. **El servidor escucha en todas las interfaces (en el Ubuntu):**
   ```bash
   ss -tlnp | grep 3000
   ```
   Debe mostrar `0.0.0.0:3000` o `*:3000` (no `127.0.0.1:3000`).
4. **Firewall del servidor:** `sudo ufw allow 3000/tcp`.
5. **Red de la VM:** que la IP esté en el mismo rango que el cliente (ej. `192.168.1.x`)
   indica adaptador en modo **puente (Bridged)**, lo correcto. En modo **NAT** hay que
   configurar reenvío de puertos.

### `Error al conectar con MongoDB`

El servicio de base de datos no responde. Revisa que `mongod` esté corriendo
(`sudo systemctl status mongod`) o que la `MONGODB_URI` de Atlas sea correcta.
