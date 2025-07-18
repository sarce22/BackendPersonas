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
    // Tabla de usuarios para login básico
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        nombre VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Tabla de personas
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS personas (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        apellido VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        telefono VARCHAR(20),
        fecha_nacimiento DATE,
        direccion TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    console.log('✅ Tablas inicializadas correctamente');
  } catch (error) {
    console.error('❌ Error al inicializar tablas:', error);
    throw error;
  }
};