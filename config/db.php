<?php
/* ===============================
   ARCHIVO: config/db.php
   DESCRIPCIÓN: Configuración de conexión a base de datos MySQL
   USO: Se importa en todos los archivos que necesitan acceder a la BD
   =============================== */

// Configuración de conexión MySQL
$db_host = 'localhost';
$db_user = 'root';
$db_password = 'root';
$db_name = 'arteplantas';

$connection = mysqli_connect($db_host, $db_user, $db_password, $db_name);

// Verificar conexión
if (!$connection) {
    http_response_code(500);
    die(json_encode(['error' => 'Error de conexión a base de datos: ' . mysqli_connect_error()]));
}

// Configurar charset a UTF-8
mysqli_set_charset($connection, "utf8mb4");

// Función para preparar datos para consultas seguras
function sanitize_input($data) {
    global $connection;
    return mysqli_real_escape_string($connection, trim($data));
}

// Función para retornar respuestas JSON
function json_response($status, $message, $data = null) {
    $response = [
        'status' => $status,
        'message' => $message
    ];
    
    if ($data !== null) {
        $response['data'] = $data;
    }
    
    header('Content-Type: application/json');
    echo json_encode($response);
    exit;
}

?>
