/* ===============================
   SCRIPT: setup.sql
   DESCRIPCIÓN: Script para crear la base de datos
   =============================== */

-- Creación base de datos
CREATE DATABASE IF NOT EXISTS arteplantas;
USE arteplantas;

-- Tabla de productos
CREATE TABLE IF NOT EXISTS productos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(255) NOT NULL,
    precio DECIMAL(10, 2) NOT NULL,
    imagen VARCHAR(255) NOT NULL,
    categoria VARCHAR(100) NOT NULL,
    descripcion TEXT,
    stock INT DEFAULT 0,
    visible BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de usuarios administradores
CREATE TABLE IF NOT EXISTS usuarios_admin (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    estado TINYINT(1) DEFAULT 1,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ultimo_acceso TIMESTAMP NULL
)   
    DEFAULT CHARSET=utf8mb4
     COLLATE=utf8mb4_unicode_ci;

-- Insertar usuario administrador por defecto
INSERT INTO usuarios_admin (usuario, password, email)
VALUES ('admin', '$2y$10$kNxz1lATUyI0y87Li7oyxufgE8jTbeEa0n4eKVMt4HEEzfEK1DfNK', 'admin@arteplantas.com');

--Ese hash corresponde a la contraseña: arteplantas1988

-- Inserción de productos
INSERT INTO productos (nombre, precio, imagen, categoria, descripcion, stock, visible) VALUES
('Cattleya Violeta', 32500, 'assets/images/Cattleya.jpg', 'orquideas',
 'La Cattleya Violeta es una orquídea de gran elegancia, conocida por sus flores de color púrpura intenso y pétalos amplios. Es ideal como planta ornamental de interior y requiere luz brillante pero indirecta, junto con riegos moderados y un ambiente bien ventilado. Perfecta para quienes buscan una flor exótica y de presencia sofisticada.',
 10, TRUE),

('Cactus y Suculentas', 2500, 'assets/images/cactusSuculentas.jpg', 'cactus',
 'Este conjunto de cactus y suculentas ofrece una variedad de formas, colores y texturas ideales para decorar interiores o jardines pequeños. Son plantas muy resistentes, de bajo mantenimiento y que toleran bien la falta de riego. Perfectas para principiantes o para quienes desean incorporar naturaleza sin demandar cuidados intensivos.',
 15, TRUE),

('Ramo Romántico', 30000, 'assets/images/ramoRomantico.jpg', 'ramos',
 'El Ramo Romántico combina delicadas flores en tonos pastel que transmiten suavidad y calidez. Diseñado con una selección armónica de especies frescas, es perfecto para aniversarios, sorpresas especiales o momentos que requieren un gesto elegante y emocional. Su composición cuidadosamente equilibrada lo convierte en un regalo inolvidable.',
 8, TRUE),

('Ramo de Rosas ', 70000, 'assets/images/ramoRosas2.jpg', 'ramos',
 'Este ramo de rosas rojas destaca por su estilo clásico y su simbolismo universal de amor, admiración y pasión. Las rosas son seleccionadas por su frescura y tamaño, logrando una presentación impecable. Ideal para celebraciones, declaraciones románticas o cualquier ocasión que amerite un detalle de categoría.',
 12, TRUE),

('Molinetes', 6000, 'assets/images/molinetes.jpg', 'accesorios',
 'Los molinetes decorativos aportan movimiento, alegría y color a cualquier jardín o maceta exterior. Están fabricados con materiales livianos y resistentes al viento, lo que les permite girar con facilidad incluso con brisas suaves. Son un complemento perfecto para espacios verdes y una opción divertida para decorar.',
 25, TRUE);
