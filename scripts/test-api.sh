#!/usr/bin/env bash
# Prueba CRUD (POST, GET, PUT, DELETE) de la API con HTTPie.
# Requiere: httpie (comando `http`) y jq.
#   sudo apt-get install -y httpie jq
#
# Uso:
#   ./scripts/test-api.sh
#   BASE_URL=http://192.168.1.110:3000 ./scripts/test-api.sh
#
# Por cada colección crea un registro, lo consulta, lo actualiza y lo elimina,
# dejando la base de datos como estaba (el script limpia lo que crea).
set -euo pipefail

BASE_URL="${BASE_URL:-http://192.168.1.110:3000}"

# probar <recurso> <campo> <campos-POST...> -- <campos-PUT...>
#   <campo> = clave del objeto en la respuesta: usuario / articulo / cliente
probar () {
  local recurso="$1" campo="$2" url="$BASE_URL/$1"
  shift 2

  # Separamos los campos del POST y del PUT usando "--" como divisor.
  local crear=() actualizar=() destino="crear"
  for arg in "$@"; do
    if [[ "$arg" == "--" ]]; then destino="actualizar"; continue; fi
    if [[ "$destino" == "crear" ]]; then crear+=("$arg"); else actualizar+=("$arg"); fi
  done

  echo ""
  echo "===== /$recurso ====="

  echo "POST   $url"
  local id
  id=$(http --check-status --ignore-stdin POST "$url" "${crear[@]}" | jq -r ".$campo._id")
  echo "  creado _id = $id"

  echo "GET    $url"
  http --check-status --ignore-stdin GET "$url" > /dev/null && echo "  OK (lista)"

  echo "GET    $url/$id"
  http --check-status --ignore-stdin GET "$url/$id" > /dev/null && echo "  OK (uno)"

  echo "PUT    $url/$id"
  http --check-status --ignore-stdin PUT "$url/$id" "${actualizar[@]}" > /dev/null && echo "  OK (actualizado)"

  echo "DELETE $url/$id"
  http --check-status --ignore-stdin DELETE "$url/$id" > /dev/null && echo "  OK (eliminado)"

  echo "GET    $url/$id   (se espera 404)"
  if http --check-status --ignore-stdin GET "$url/$id" > /dev/null 2>&1; then
    echo "  ¡Ojo! el registro todavía existe"
  else
    echo "  OK, ya no existe (404)"
  fi
}

echo "Probando API en $BASE_URL"

probar usuarios usuario \
  usuario=pgomez password=clave123 rol=vendedor \
  -- usuario=pgomez rol=administrador

# En HTTPie, `campo:=valor` (con :=) envía el valor como número, no como texto.
probar articulos articulo \
  articulo="Webcam HD" descripcion="1080p con microfono" precio:=750 \
  -- articulo="Webcam HD Pro" descripcion="1080p actualizada" precio:=699

probar clientes cliente \
  nombre="Pedro Gomez" telefono=9511112233 \
  -- nombre="Pedro Gomez" telefono=9510000000

echo ""
echo "Pruebas completadas."
