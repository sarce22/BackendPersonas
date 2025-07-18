import { pool } from '../config/database';
import { IUser, CreateUserInput } from '../types';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export class UserModel {
  /**
   * Crear un nuevo usuario
   */
  static async create(userData: CreateUserInput): Promise<IUser> {
    const { email, password, nombre } = userData;
    
    const [result] = await pool.execute<ResultSetHeader>(
      'INSERT INTO users (email, password, nombre) VALUES (?, ?, ?)',
      [email, password, nombre]
    );
    
    const newUser = await this.findById(result.insertId);
    if (!newUser) {
      throw new Error('Error al crear el usuario');
    }
    
    return newUser;
  }

  /**
   * Buscar usuario por ID
   */
  static async findById(id: number): Promise<IUser | null> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT id, email, nombre, created_at, updated_at FROM users WHERE id = ?',
      [id]
    );
    
    if (rows.length === 0) return null;
    
    return rows[0] as IUser;
  }

  /**
   * Buscar usuario por email
   */
  static async findByEmail(email: string): Promise<IUser | null> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT id, email, nombre, created_at, updated_at FROM users WHERE email = ?',
      [email]
    );
    
    if (rows.length === 0) return null;
    
    return rows[0] as IUser;
  }

  /**
   * Buscar usuario por email con contraseña (para login)
   */
  static async findByEmailWithPassword(email: string): Promise<IUser | null> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT id, email, password, nombre, created_at, updated_at FROM users WHERE email = ?',
      [email]
    );
    
    if (rows.length === 0) return null;
    
    return rows[0] as IUser;
  }

  /**
   * Verificar si existe un usuario con el email
   */
  static async emailExists(email: string): Promise<boolean> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT COUNT(*) as count FROM users WHERE email = ?',
      [email]
    );
    
    return (rows[0] as any).count > 0;
  }

  /**
   * Obtener todos los usuarios (sin contraseñas)
   */
  static async findAll(): Promise<IUser[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT id, email, nombre, created_at, updated_at FROM users ORDER BY created_at DESC'
    );
    
    return rows as IUser[];
  }
}