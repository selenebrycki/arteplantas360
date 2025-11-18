<?php
/* ===============================
   ARCHIVO: api/auth.php
   DESCRIPCIÓN: API REST para autenticación de administradores
   MÉTODOS: POST (login), GET (verify)
   =============================== */

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

require_once '../config/db.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? $_GET['action'] : '';

try {
    switch ($method) {
        case 'POST':
            if ($action === 'login') {
                loginAdmin();
            } else {
                json_response('error', 'Acción no válida');
            }
            break;
            
        case 'GET':
            if ($action === 'verify') {
                verifySession();
            } else {
                json_response('error', 'Acción no válida');
            }
            break;
            
        default:
            json_response('error', 'Método HTTP no permitido');
    }
} catch (Exception $e) {
    json_response('error', 'Error: ' . $e->getMessage());
}

/* ===============================
   FUNCIÓN: loginAdmin
   DESCRIPCIÓN: Autentica un usuario administrador
   =============================== */
function loginAdmin() {
    global $connection;
    
    $data = json_decode(file_get_contents("php://input"), true);
    
    $usuario = sanitize_input($data['usuario'] ?? '');
    $password = sanitize_input($data['password'] ?? '');
    
    if (empty($usuario) || empty($password)) {
        json_response('error', 'Usuario y contraseña son requeridos');
    }
    
    // Buscar usuario en la base de datos
    $query = "SELECT id, usuario, email FROM usuarios_admin 
              WHERE usuario = '$usuario' AND contraseña = SHA2('$password', 256) 
              AND estado = TRUE";
    
    $result = $connection->query($query);
    
    if (!$result) {
        json_response('error', 'Error en la consulta: ' . $connection->error);
    }
    
    $user = $result->fetch_assoc();
    
    if (!$user) {
        json_response('error', 'Usuario o contraseña incorrectos');
    }
    
    // Generar token para la sesión
    $token = bin2hex(random_bytes(32));
    $expiration = date('Y-m-d H:i:s', strtotime('+24 hours'));
    
    // Guardar sesión en BD
    $insert_session = "INSERT INTO admin_sesiones (usuario_id, token, fecha_expiracion) 
                       VALUES (" . $user['id'] . ", '$token', '$expiration')";
    
    if ($connection->query($insert_session)) {
        // Actualizar último acceso
        $update_access = "UPDATE usuarios_admin SET ultimo_acceso = CURRENT_TIMESTAMP 
                          WHERE id = " . $user['id'];
        $connection->query($update_access);
        
        json_response('success', 'Autenticación exitosa', [
            'token' => $token,
            'usuario' => $user['usuario'],
            'email' => $user['email']
        ]);
    } else {
        json_response('error', 'Error al crear la sesión: ' . $connection->error);
    }
}

/* ===============================
   FUNCIÓN: verifySession
   DESCRIPCIÓN: Verifica si una sesión es válida
   =============================== */
function verifySession() {
    global $connection;
    
    $token = isset($_GET['token']) ? sanitize_input($_GET['token']) : '';
    
    if (empty($token)) {
        json_response('error', 'Token no proporcionado');
    }
    
    // Buscar sesión activa
    $query = "SELECT us.usuario, us.email, asv.fecha_expiracion
              FROM admin_sesiones asv
              JOIN usuarios_admin us ON asv.usuario_id = us.id
              WHERE asv.token = '$token' 
              AND asv.fecha_expiracion > CURRENT_TIMESTAMP
              AND us.estado = TRUE";
    
    $result = $connection->query($query);
    
    if (!$result) {
        json_response('error', 'Error en la consulta: ' . $connection->error);
    }
    
    $session = $result->fetch_assoc();
    
    if (!$session) {
        json_response('error', 'Sesión inválida o expirada');
    }
    
    json_response('success', 'Sesión válida', $session);
}

?>
