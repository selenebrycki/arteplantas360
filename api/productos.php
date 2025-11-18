<?php
/* ===============================
   ARCHIVO: api/productos.php
   DESCRIPCIÓN: API REST para operaciones CRUD de productos
   MÉTODOS: GET, POST, PUT, DELETE
   =============================== */

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

require_once '../config/db.php';

$method = $_SERVER['REQUEST_METHOD'];
$request = isset($_GET['action']) ? $_GET['action'] : '';

try {
    switch ($method) {
        case 'GET':
            if ($request === 'all') {
                // Obtener todos los productos visibles
                obtenerProductos();
            } elseif ($request === 'id' && isset($_GET['id'])) {
                // Obtener producto por ID
                obtenerProductoPorId($_GET['id']);
            } elseif ($request === 'admin') {
                // Obtener todos los productos (admin)
                obtenerProductosAdmin();
            } else {
                json_response('error', 'Acción no válida');
            }
            break;
            
        case 'POST':
            // Crear nuevo producto
            crearProducto();
            break;
            
        case 'PUT':
            // Actualizar producto
            actualizarProducto();
            break;
            
        case 'DELETE':
            // Eliminar producto
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

function obtenerProductos() {
    global $connection;
    
    $query = "SELECT id, nombre, precio, imagen, categoria, descripcion, stock 
              FROM productos WHERE visible = TRUE ORDER BY nombre ASC";
    
    $result = $connection->query($query);
    
    if (!$result) {
        json_response('error', 'Error en la consulta: ' . $connection->error);
    }
    
    $productos = [];
    while ($row = $result->fetch_assoc()) {
        $productos[] = $row;
    }
    
    json_response('success', 'Productos obtenidos correctamente', $productos);
}

function obtenerProductosAdmin() {
    global $connection;
    
    $query = "SELECT id, nombre, precio, imagen, categoria, descripcion, stock, visible, fecha_creacion 
              FROM productos ORDER BY fecha_creacion DESC";
    
    $result = $connection->query($query);
    
    if (!$result) {
        json_response('error', 'Error en la consulta: ' . $connection->error);
    }
    
    $productos = [];
    while ($row = $result->fetch_assoc()) {
        $productos[] = $row;
    }
    
    json_response('success', 'Productos obtenidos correctamente', $productos);
}

function obtenerProductoPorId($id) {
    global $connection;
    
    $id = sanitize_input($id);
    $query = "SELECT * FROM productos WHERE id = $id";
    
    $result = $connection->query($query);
    
    if (!$result) {
        json_response('error', 'Error en la consulta: ' . $connection->error);
    }
    
    $producto = $result->fetch_assoc();
    
    if (!$producto) {
        json_response('error', 'Producto no encontrado');
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
        json_response('error', 'Nombre y precio son requeridos');
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
    }
    
    $query = "DELETE FROM productos WHERE id=$id";
    
    if ($connection->query($query)) {
        json_response('success', 'Producto eliminado correctamente');
    } else {
        json_response('error', 'Error al eliminar producto: ' . $connection->error);
    }
}

?>
