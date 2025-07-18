import { pool } from '../config/database';
import { IRole } from '../types';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export class RoleModel {
  /**
   * Crear un nuevo rol
   */
  static async create(nombre: string): Promise<IRole> {
    const [result] = await pool.execute<ResultSetHeader>(
      'INSERT INTO roles (nombre) VALUES (?)',
      [nombre]
    );
    
    const newRole = await this.findById(result.insertId);
    if (!newRole) {
      throw new Error('Error al crear el rol');
    }
    
    return newRole;
  }

  /**
   * Obtener todos los roles
   */
  static async findAll(): Promise<IRole[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM roles ORDER BY nombre'
    );
    return rows as IRole[];
  }

  /**
   * Buscar rol por ID
   */
  static async findById(id: number): Promise<IRole | null> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM roles WHERE id = ?',
      [id]
    );
    
    if (rows.length === 0) return null;
    
    return rows[0] as IRole;
  }

  /**
   * Buscar rol por nombre
   */
  static async findByName(nombre: string): Promise<IRole | null> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM roles WHERE nombre = ?',
      [nombre]
    );
    
    if (rows.length === 0) return null;
    
    return rows[0] as IRole;
  }

  /**
   * Verificar si existe un rol con el nombre
   */
  static async nameExists(nombre: string): Promise<boolean> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT COUNT(*) as count FROM roles WHERE nombre = ?',
      [nombre]
    );
    
    return (rows[0] as any).count > 0;
  }

  /**
   * Actualizar rol
   */
  static async update(id: number, nombre: string): Promise<IRole | null> {
    const [result] = await pool.execute<ResultSetHeader>(
      'UPDATE roles SET nombre = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [nombre, id]
    );
    
    if (result.affectedRows === 0) {
      return null;
    }
    
    return this.findById(id);
  }

  /**
   * Eliminar rol
   */
  static async delete(id: number): Promise<boolean> {
    const [result] = await pool.execute<ResultSetHeader>(
      'DELETE FROM roles WHERE id = ?',
      [id]
    );
    
    return result.affectedRows > 0;
  }

  /**
   * Contar total de roles
   */
  static async count(): Promise<number> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT COUNT(*) as count FROM roles'
    );
    
    return (rows[0] as any).count;
  }
}