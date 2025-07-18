import mysql from 'mysql2/promise';
import { IDBConfig } from '../types';
import dotenv from 'dotenv';

// Cargar variables de entorno ANTES de usarlas
dotenv.config();

// Configuración de la base de datos
const dbConfig: IDBConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'personas_db',
  port: parseInt(process.env.DB_PORT || '3306')
};

// Pool de conexiones para mejor rendimiento
export const pool = mysql.createPool({
  host: dbConfig.host,
  user: dbConfig.user,
  password: dbConfig.password,
  database: dbConfig.database,
  port: dbConfig.port
});

// Función para probar la conexión
export const testConnection = async (): Promise<void> => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Conexión a MySQL establecida correctamente');
    connection.release();
  } catch (error) {
    console.error('❌ Error al conectar con MySQL:', error);
    process.exit(1);
  }
};

// Función para inicializar las tablas
export const initializeTables = async (): Promise<void> => {
  try {
    // Tabla de roles
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS roles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(50) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_nombre (nombre)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Tabla de personas (unificada con autenticación)
    await pool.execute(`
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
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    console.log('✅ Tablas inicializadas correctamente');

    // Insertar roles por defecto si no existen
    await insertDefaultRoles();

    // Insertar datos de ejemplo si no existen
    await insertSampleData();

  } catch (error) {
    console.error('❌ Error al inicializar tablas:', error);
    throw error;
  }
};

// Función para insertar roles por defecto
const insertDefaultRoles = async (): Promise<void> => {
  try {
    const defaultRoles = ['admin', 'cliente', 'empleado'];

    for (const roleName of defaultRoles) {
      await pool.execute(`
        INSERT IGNORE INTO roles (nombre) VALUES (?)
      `, [roleName]);
    }

    console.log('✅ Roles por defecto insertados correctamente');
  } catch (error) {
    console.error('❌ Error al insertar roles por defecto:', error);
  }
};

// Función para insertar datos de ejemplo
const insertSampleData = async (): Promise<void> => {
  try {
    // Obtener ID del rol admin
    const [adminRoleRows] = await pool.execute(`
      SELECT id FROM roles WHERE nombre = 'admin' LIMIT 1
    `);
    
    // Obtener ID del rol cliente
    const [clienteRoleRows] = await pool.execute(`
      SELECT id FROM roles WHERE nombre = 'cliente' LIMIT 1
    `);

    if ((adminRoleRows as any[]).length > 0 && (clienteRoleRows as any[]).length > 0) {
      const adminRoleId = (adminRoleRows as any[])[0].id;
      const clienteRoleId = (clienteRoleRows as any[])[0].id;

      // Insertar personas de ejemplo
      const samplePersonas = [
        ['Admin', 'Sistema', 'admin@test.com', 'admin123', adminRoleId],
        ['Juan', 'Pérez', 'juan.perez@email.com', '123456', clienteRoleId],
        ['María', 'González', 'maria.gonzalez@email.com', 'maria123', clienteRoleId],
        ['Carlos', 'Rodríguez', 'carlos.rodriguez@email.com', 'carlos123', clienteRoleId],
        ['Ana', 'Martínez', 'ana.martinez@email.com', 'ana123', clienteRoleId]
      ];

      for (const persona of samplePersonas) {
        await pool.execute(`
          INSERT IGNORE INTO personas (nombre, apellido, correo, contraseña, rol_id) 
          VALUES (?, ?, ?, ?, ?)
        `, persona);
      }

      console.log('✅ Datos de ejemplo insertados correctamente');
    }
  } catch (error) {
    console.error('❌ Error al insertar datos de ejemplo:', error);
  }
};