<?php
/* ===============================
   ARCHIVO: api/admin-productos.php
   DESCRIPCIÓN: API REST para CRUD de productos con autenticación admin
   MÉTODOS: GET, POST, PUT, DELETE
   =============================== */

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

require_once '../config/db.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? $_GET['action'] : '';

try {
    switch ($method) {
        case 'GET':
            if ($action === 'all') {
                obtenerTodosLosProductos();
            } elseif ($action === 'id' && isset($_GET['id'])) {
                obtenerProductoPorId($_GET['id']);
            } else {
                json_response('error', 'Acción no válida');
            }
            break;
            
        case 'POST':
            crearProducto();
            break;
            
        case 'PUT':
            actualizarProducto();
            break;
            
        case 'DELETE':
            if (isset($_GET['id'])) {
                eliminarProducto($_GET['id']);
            } else {
                json_response('error', 'ID de producto no proporcionado');
            }
            break;
            
        default:
            json_response('error', 'Método HTTP no permitido');
    }
} catch (Exception $e) {
    json_response('error', 'Error: ' . $e->getMessage());
}

/* ===============================
   FUNCIONES GET
   =============================== */

function obtenerTodosLosProductos() {
    global $connection;
    
    $query = "SELECT id, nombre, precio, imagen, categoria, descripcion, stock, visible, fecha_creacion 
              FROM productos ORDER BY fecha_creacion DESC";
    
    $result = $connection->query($query);
    
    if (!$result) {
        json_response('error', 'Error en la consulta: ' . $connection->error);
        return;
    }
    
    $productos = [];
    while ($row = $result->fetch_assoc()) {
        $productos[] = $row;
    }
    
    json_response('success', 'Productos obtenidos correctamente', $productos);
}

function obtenerProductoPorId($id) {
    global $connection;
    
    $id = intval($id);
    $query = "SELECT * FROM productos WHERE id = $id";
    
    $result = $connection->query($query);
    
    if (!$result) {
        json_response('error', 'Error en la consulta: ' . $connection->error);
        return;
    }
    
    $producto = $result->fetch_assoc();
    
    if (!$producto) {
        json_response('error', 'Producto no encontrado');
        return;
    }
    
    json_response('success', 'Producto obtenido correctamente', $producto);
}

/* ===============================
   FUNCIONES POST (Crear)
   =============================== */

function crearProducto() {
    global $connection;
    
    $data = json_decode(file_get_contents("php://input"), true);
    
    $nombre = sanitize_input($data['nombre'] ?? '');
    $precio = floatval($data['precio'] ?? 0);
    $imagen = sanitize_input($data['imagen'] ?? '');
    $categoria = sanitize_input($data['categoria'] ?? '');
    $descripcion = sanitize_input($data['descripcion'] ?? '');
    $stock = intval($data['stock'] ?? 0);
    $visible = isset($data['visible']) ? (bool)$data['visible'] : true;
    
    if (empty($nombre) || $precio <= 0) {
        json_response('error', 'Nombre y precio son requeridos y deben ser válidos');
        return;
    }
    
    $visible = $visible ? 1 : 0;
    
    $query = "INSERT INTO productos (nombre, precio, imagen, categoria, descripcion, stock, visible) 
              VALUES ('$nombre', $precio, '$imagen', '$categoria', '$descripcion', $stock, $visible)";
    
    if ($connection->query($query)) {
        $producto_id = $connection->insert_id;
        json_response('success', 'Producto creado correctamente', ['id' => $producto_id]);
    } else {
        json_response('error', 'Error al crear producto: ' . $connection->error);
    }
}

/* ===============================
   FUNCIONES PUT (Actualizar)
   =============================== */

function actualizarProducto() {
    global $connection;
    
    $data = json_decode(file_get_contents("php://input"), true);
    
    $id = intval($data['id'] ?? 0);
    
    if ($id <= 0) {
        json_response('error', 'ID de producto no válido');
        return;
    }
    
    $nombre = sanitize_input($data['nombre'] ?? '');
    $precio = floatval($data['precio'] ?? 0);
    $imagen = sanitize_input($data['imagen'] ?? '');
    $categoria = sanitize_input($data['categoria'] ?? '');
    $descripcion = sanitize_input($data['descripcion'] ?? '');
    $stock = intval($data['stock'] ?? 0);
    $visible = isset($data['visible']) ? (bool)$data['visible'] : true;
    $visible = $visible ? 1 : 0;
    
    $query = "UPDATE productos SET 
              nombre='$nombre', 
              precio=$precio, 
              imagen='$imagen', 
              categoria='$categoria', 
              descripcion='$descripcion', 
              stock=$stock, 
              visible=$visible,
              fecha_actualizacion=CURRENT_TIMESTAMP 
              WHERE id=$id";
    
    if ($connection->query($query)) {
        json_response('success', 'Producto actualizado correctamente');
    } else {
        json_response('error', 'Error al actualizar producto: ' . $connection->error);
    }
}

/* ===============================
   FUNCIONES DELETE (Eliminar)
   =============================== */

function eliminarProducto($id) {
    global $connection;
    
    $id = intval($id);
    
    if ($id <= 0) {
        json_response('error', 'ID de producto no válido');
        return;
    }
    
    $query = "DELETE FROM productos WHERE id=$id";
    
    if ($connection->query($query)) {
        json_response('success', 'Producto eliminado correctamente');
    } else {
        json_response('error', 'Error al eliminar producto: ' . $connection->error);
    }
}

?>
