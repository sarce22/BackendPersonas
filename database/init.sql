-- Crear base de datos
CREATE DATABASE IF NOT EXISTS personas_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Usar la base de datos
USE personas_db;

-- Tabla de roles
CREATE TABLE IF NOT EXISTS roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_nombre (nombre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de personas (CRUD + Autenticación)
CREATE TABLE IF NOT EXISTS personas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL,
    contraseña VARCHAR(255) NOT NULL,
    rol_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (rol_id) REFERENCES roles(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    INDEX idx_correo (correo),
    INDEX idx_nombre (nombre),
    INDEX idx_apellido (apellido),
    INDEX idx_rol_id (rol_id),
    INDEX idx_created_at (created_at),
    INDEX idx_nombre_apellido (nombre, apellido)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertar roles por defecto
INSERT INTO roles (nombre) VALUES 
('admin'),
('cliente'),
('empleado')
ON DUPLICATE KEY UPDATE nombre=VALUES(nombre);

-- Datos de ejemplo para personas
INSERT INTO personas (nombre, apellido, correo, contraseña, rol_id) VALUES 
('Admin', 'Sistema', 'admin@test.com', 'admin123', (SELECT id FROM roles WHERE nombre = 'admin')),
('Juan', 'Pérez', 'juan.perez@email.com', '123456', (SELECT id FROM roles WHERE nombre = 'cliente')),
('María', 'González', 'maria.gonzalez@email.com', 'maria123', (SELECT id FROM roles WHERE nombre = 'cliente')),
('Carlos', 'Rodríguez', 'carlos.rodriguez@email.com', 'carlos123', (SELECT id FROM roles WHERE nombre = 'empleado')),
('Ana', 'Martínez', 'ana.martinez@email.com', 'ana123', (SELECT id FROM roles WHERE nombre = 'cliente')),
('Luis', 'García', 'luis.garcia@email.com', 'luis123', (SELECT id FROM roles WHERE nombre = 'empleado'))
ON DUPLICATE KEY UPDATE nombre=VALUES(nombre);

-- Procedimiento para obtener estadísticas de personas
DELIMITER //
CREATE PROCEDURE IF NOT EXISTS GetPersonasStats()
BEGIN
    SELECT 
        COUNT(*) as total_personas,
        COUNT(CASE WHEN r.nombre = 'admin' THEN 1 END) as total_admins,
        COUNT(CASE WHEN r.nombre = 'cliente' THEN 1 END) as total_clientes,
        COUNT(CASE WHEN r.nombre = 'empleado' THEN 1 END) as total_empleados,
        ROUND((COUNT(CASE WHEN r.nombre = 'admin' THEN 1 END) / COUNT(*)) * 100, 2) as porcentaje_admins
    FROM personas p
    LEFT JOIN roles r ON p.rol_id = r.id;
END //
DELIMITER ;

-- Procedimiento para obtener estadísticas de roles
DELIMITER //
CREATE PROCEDURE IF NOT EXISTS GetRolesStats()
BEGIN
    SELECT 
        r.id,
        r.nombre as rol_nombre,
        COUNT(p.id) as total_personas,
        ROUND((COUNT(p.id) / (SELECT COUNT(*) FROM personas)) * 100, 2) as porcentaje
    FROM roles r
    LEFT JOIN personas p ON r.id = p.rol_id
    GROUP BY r.id, r.nombre
    ORDER BY total_personas DESC;
END //
DELIMITER ;

-- Vista para personas con información de roles
CREATE OR REPLACE VIEW personas_con_roles AS
SELECT 
    p.id,
    p.nombre,
    p.apellido,
    p.correo,
    p.rol_id,
    r.nombre as rol_nombre,
    p.created_at,
    p.updated_at
FROM personas p
LEFT JOIN roles r ON p.rol_id = r.id;

-- Función para buscar personas por rol
DELIMITER //
CREATE FUNCTION IF NOT EXISTS BuscarPersonasPorRol(rol_nombre VARCHAR(50))
RETURNS TEXT
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE resultado TEXT DEFAULT '';
    
    SELECT GROUP_CONCAT(CONCAT(p.nombre, ' ', p.apellido) SEPARATOR ', ')
    INTO resultado
    FROM personas p
    INNER JOIN roles r ON p.rol_id = r.id
    WHERE r.nombre = rol_nombre;
    
    RETURN COALESCE(resultado, 'No se encontraron personas con este rol');
END //
DELIMITER ;

-- Función para contar personas por rol
DELIMITER //
CREATE FUNCTION IF NOT EXISTS ContarPersonasPorRol(rol_nombre VARCHAR(50))
RETURNS INT
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE total INT DEFAULT 0;
    
    SELECT COUNT(*)
    INTO total
    FROM personas p
    INNER JOIN roles r ON p.rol_id = r.id
    WHERE r.nombre = rol_nombre;
    
    RETURN total;
END //
DELIMITER ;

-- Trigger para actualizar updated_at automáticamente en personas
DELIMITER //
CREATE TRIGGER IF NOT EXISTS update_personas_timestamp 
    BEFORE UPDATE ON personas 
    FOR EACH ROW 
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END //
DELIMITER ;

-- Trigger para actualizar updated_at automáticamente en roles
DELIMITER //
CREATE TRIGGER IF NOT EXISTS update_roles_timestamp 
    BEFORE UPDATE ON roles 
    FOR EACH ROW 
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END //
DELIMITER ;

-- Trigger para evitar eliminar roles que tienen personas asignadas
DELIMITER //
CREATE TRIGGER IF NOT EXISTS prevent_role_deletion_with_users
    BEFORE DELETE ON roles
    FOR EACH ROW
BEGIN
    DECLARE user_count INT;
    
    SELECT COUNT(*) INTO user_count
    FROM personas
    WHERE rol_id = OLD.id;
    
    IF user_count > 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'No se puede eliminar un rol que tiene personas asignadas';
    END IF;
END //
DELIMITER ;