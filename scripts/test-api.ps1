# Prueba CRUD (POST, GET, PUT, DELETE) de la API.
# Corre en Windows PowerShell sin instalar nada (usa Invoke-RestMethod).
#
# Uso:
#   .\scripts\test-api.ps1
#   .\scripts\test-api.ps1 -BaseUrl http://localhost:3000
#
# Por cada colección crea un registro, lo consulta, lo actualiza y lo elimina,
# dejando la base de datos como estaba (el script limpia lo que crea).

param(
    [string]$BaseUrl = "http://192.168.1.110:3000"
)

$ErrorActionPreference = "Stop"

# Envía una petición JSON. Codifica el body en UTF-8 para no romper acentos.
function Invoke-Json {
    param(
        [string]$Method,
        [string]$Uri,
        $Body
    )
    $params = @{ Method = $Method; Uri = $Uri }
    if ($null -ne $Body) {
        $json = $Body | ConvertTo-Json -Depth 5
        $params.ContentType = "application/json; charset=utf-8"
        $params.Body = [System.Text.Encoding]::UTF8.GetBytes($json)
    }
    return Invoke-RestMethod @params
}

function Test-Crud {
    param(
        [string]$Recurso,       # "usuarios", "articulos", "clientes"
        [string]$Campo,         # clave del objeto en la respuesta: "usuario"/"articulo"/"cliente"
        [hashtable]$Crear,      # body del POST
        [hashtable]$Actualizar  # body del PUT
    )

    $url = "$BaseUrl/$Recurso"
    Write-Host "`n===== /$Recurso =====" -ForegroundColor Cyan

    # POST
    Write-Host "POST   $url" -ForegroundColor Yellow
    $creado = Invoke-Json -Method Post -Uri $url -Body $Crear
    $id = $creado.$Campo._id
    Write-Host "  creado _id = $id" -ForegroundColor Green

    # GET (lista)
    Write-Host "GET    $url" -ForegroundColor Yellow
    $todos = Invoke-Json -Method Get -Uri $url
    Write-Host "  total en la colección = $(@($todos).Count)" -ForegroundColor Green

    # GET (uno)
    Write-Host "GET    $url/$id" -ForegroundColor Yellow
    $uno = Invoke-Json -Method Get -Uri "$url/$id"
    Write-Host "  encontrado: $($uno | ConvertTo-Json -Compress)" -ForegroundColor Green

    # PUT
    Write-Host "PUT    $url/$id" -ForegroundColor Yellow
    $actualizado = Invoke-Json -Method Put -Uri "$url/$id" -Body $Actualizar
    Write-Host "  actualizado: $($actualizado.$Campo | ConvertTo-Json -Compress)" -ForegroundColor Green

    # DELETE
    Write-Host "DELETE $url/$id" -ForegroundColor Yellow
    $eliminado = Invoke-Json -Method Delete -Uri "$url/$id"
    Write-Host "  $($eliminado.mensaje)" -ForegroundColor Green

    # GET tras borrar: se espera 404
    Write-Host "GET    $url/$id   (se espera 404)" -ForegroundColor Yellow
    try {
        Invoke-Json -Method Get -Uri "$url/$id" | Out-Null
        Write-Host "  ¡Ojo! el registro todavía existe" -ForegroundColor Red
    } catch {
        Write-Host "  OK, ya no existe (404)" -ForegroundColor Green
    }
}

Write-Host "Probando API en $BaseUrl" -ForegroundColor Cyan

Test-Crud -Recurso "usuarios" -Campo "usuario" `
    -Crear      @{ usuario = "pgomez"; password = "clave123"; rol = "vendedor" } `
    -Actualizar @{ usuario = "pgomez"; rol = "administrador" }

Test-Crud -Recurso "articulos" -Campo "articulo" `
    -Crear      @{ articulo = "Webcam HD"; descripcion = "1080p con micrófono"; precio = 750 } `
    -Actualizar @{ articulo = "Webcam HD Pro"; descripcion = "1080p actualizada"; precio = 699 }

Test-Crud -Recurso "clientes" -Campo "cliente" `
    -Crear      @{ nombre = "Pedro Gómez"; telefono = "9511112233" } `
    -Actualizar @{ nombre = "Pedro Gómez"; telefono = "9510000000" }

Write-Host "`nPruebas completadas." -ForegroundColor Cyan
