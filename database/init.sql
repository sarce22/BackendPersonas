-- Crear base de datos
CREATE DATABASE IF NOT EXISTS personas_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Usar la base de datos
USE personas_db;

-- Tabla de usuarios para login básico
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de personas
CREATE TABLE IF NOT EXISTS personas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    telefono VARCHAR(20),
    fecha_nacimiento DATE,
    direccion TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_nombre (nombre),
    INDEX idx_apellido (apellido),
    INDEX idx_created_at (created_at),
    INDEX idx_nombre_apellido (nombre, apellido)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Datos de ejemplo para usuarios (contraseñas en texto plano para demo)
INSERT INTO users (email, password, nombre) VALUES 
('admin@test.com', 'admin123', 'Administrador'),
('juan@test.com', '123456', 'Juan Pérez'),
('maria@test.com', 'maria123', 'María González')
ON DUPLICATE KEY UPDATE nombre=VALUES(nombre);

-- Datos de ejemplo para personas
INSERT INTO personas (nombre, apellido, email, telefono, fecha_nacimiento, direccion) VALUES 
('Juan', 'Pérez', 'juan.perez@email.com', '+57 300 123 4567', '1990-05-15', 'Calle 123 #45-67, Bogotá'),
('María', 'González', 'maria.gonzalez@email.com', '+57 310 234 5678', '1985-08-22', 'Carrera 45 #12-34, Medellín'),
('Carlos', 'Rodríguez', 'carlos.rodriguez@email.com', '+57 320 345 6789', '1992-12-10', 'Avenida 68 #23-45, Cali'),
('Ana', 'Martínez', 'ana.martinez@email.com', '+57 301 456 7890', '1988-03-07', 'Calle 85 #15-28, Barranquilla'),
('Luis', 'García', 'luis.garcia@email.com', '+57 311 567 8901', '1995-11-30', 'Carrera 13 #45-67, Cartagena')
ON DUPLICATE KEY UPDATE nombre=VALUES(nombre);

-- Procedimiento para obtener estadísticas
DELIMITER //
CREATE PROCEDURE IF NOT EXISTS GetPersonasStats()
BEGIN
    SELECT 
        COUNT(*) as total_personas,
        COUNT(telefono) as con_telefono,
        COUNT(direccion) as con_direccion,
        COUNT(fecha_nacimiento) as con_fecha_nacimiento,
        ROUND((COUNT(fecha_nacimiento) / COUNT(*)) * 100, 2) as porcentaje_completos
    FROM personas;
END //
DELIMITER ;

-- Vista para personas con información completa
CREATE OR REPLACE VIEW personas_completas AS
SELECT 
    p.*,
    CASE 
        WHEN p.telefono IS NOT NULL AND p.direccion IS NOT NULL AND p.fecha_nacimiento IS NOT NULL 
        THEN 'Completo'
        ELSE 'Incompleto'
    END as estado_completitud,
    TIMESTAMPDIFF(YEAR, p.fecha_nacimiento, CURDATE()) as edad
FROM personas p;

-- Función para buscar personas
DELIMITER //
CREATE FUNCTION IF NOT EXISTS BuscarPersonas(termino VARCHAR(100))
RETURNS TEXT
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE resultado TEXT DEFAULT '';
    
    SELECT GROUP_CONCAT(CONCAT(nombre, ' ', apellido) SEPARATOR ', ')
    INTO resultado
    FROM personas 
    WHERE nombre LIKE CONCAT('%', termino, '%') 
       OR apellido LIKE CONCAT('%', termino, '%');
    
    RETURN COALESCE(resultado, 'No se encontraron personas');
END //
DELIMITER ;

-- Trigger para actualizar updated_at automáticamente
DELIMITER //
CREATE TRIGGER IF NOT EXISTS update_personas_timestamp 
    BEFORE UPDATE ON personas 
    FOR EACH ROW 
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END //
DELIMITER ;

DELIMITER //
CREATE TRIGGER IF NOT EXISTS update_users_timestamp 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END //
DELIMITER ;