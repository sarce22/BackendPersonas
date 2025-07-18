import { pool } from '../config/database';
import { IPersona, CreatePersonaInput, UpdatePersonaInput } from '../types';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export class PersonaModel {
  /**
   * Crear una nueva persona
   */
  static async create(personaData: CreatePersonaInput): Promise<IPersona> {
    const { nombre, apellido, correo, contraseña, rol_id } = personaData;
    
    const [result] = await pool.execute<ResultSetHeader>(
      `INSERT INTO personas (nombre, apellido, correo, contraseña, rol_id) 
       VALUES (?, ?, ?, ?, ?)`,
      [nombre, apellido, correo, contraseña, rol_id]
    );
    
    const newPersona = await this.findById(result.insertId);
    if (!newPersona) {
      throw new Error('Error al crear la persona');
    }
    
    return newPersona;
  }

  /**
   * Obtener todas las personas (método simple sin parámetros)
   */
  static async getAll(): Promise<IPersona[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT p.*, r.nombre as rol_nombre 
       FROM personas p 
       LEFT JOIN roles r ON p.rol_id = r.id 
       ORDER BY p.created_at DESC`
    );
    return rows as IPersona[];
  }

  /**
   * Obtener todas las personas con roles
   */
  static async findAll(limit?: number, offset?: number): Promise<IPersona[]> {
    // Caso 1: Sin límite ni offset - usar query simple
    if (limit === undefined && offset === undefined) {
      const [rows] = await pool.query<RowDataPacket[]>(
        `SELECT p.*, r.nombre as rol_nombre 
         FROM personas p 
         LEFT JOIN roles r ON p.rol_id = r.id 
         ORDER BY p.created_at DESC`
      );
      return rows as IPersona[];
    }
    
    // Caso 2: Solo con límite
    if (limit !== undefined && offset === undefined) {
      const [rows] = await pool.execute<RowDataPacket[]>(
        `SELECT p.*, r.nombre as rol_nombre 
         FROM personas p 
         LEFT JOIN roles r ON p.rol_id = r.id 
         ORDER BY p.created_at DESC LIMIT ?`,
        [limit]
      );
      return rows as IPersona[];
    }
    
    // Caso 3: Con límite y offset
    if (limit !== undefined && offset !== undefined) {
      const [rows] = await pool.execute<RowDataPacket[]>(
        `SELECT p.*, r.nombre as rol_nombre 
         FROM personas p 
         LEFT JOIN roles r ON p.rol_id = r.id 
         ORDER BY p.created_at DESC LIMIT ? OFFSET ?`,
        [limit, offset]
      );
      return rows as IPersona[];
    }
    
    // Caso por defecto
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT p.*, r.nombre as rol_nombre 
       FROM personas p 
       LEFT JOIN roles r ON p.rol_id = r.id 
       ORDER BY p.created_at DESC`
    );
    return rows as IPersona[];
  }

  /**
   * Buscar persona por ID
   */
  static async findById(id: number): Promise<IPersona | null> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT p.id, p.nombre, p.apellido, p.correo, p.rol_id, 
              p.created_at, p.updated_at, r.nombre as rol_nombre
       FROM personas p 
       LEFT JOIN roles r ON p.rol_id = r.id 
       WHERE p.id = ?`,
      [id]
    );
    
    if (rows.length === 0) return null;
    
    return rows[0] as IPersona;
  }

  /**
   * Buscar persona por correo (sin contraseña)
   */
  static async findByCorreo(correo: string): Promise<IPersona | null> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT p.id, p.nombre, p.apellido, p.correo, p.rol_id, 
              p.created_at, p.updated_at, r.nombre as rol_nombre
       FROM personas p 
       LEFT JOIN roles r ON p.rol_id = r.id 
       WHERE p.correo = ?`,
      [correo]
    );
    
    if (rows.length === 0) return null;
    
    return rows[0] as IPersona;
  }

  /**
   * Buscar persona por correo CON contraseña (para login)
   */
  static async findByCorreoWithContraseña(correo: string): Promise<IPersona | null> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT p.*, r.nombre as rol_nombre
       FROM personas p 
       LEFT JOIN roles r ON p.rol_id = r.id 
       WHERE p.correo = ?`,
      [correo]
    );
    
    if (rows.length === 0) return null;
    
    return rows[0] as IPersona;
  }

  /**
   * Buscar personas por nombre o apellido
   */
  static async searchByName(searchTerm: string): Promise<IPersona[]> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT p.id, p.nombre, p.apellido, p.correo, p.rol_id, 
              p.created_at, p.updated_at, r.nombre as rol_nombre
       FROM personas p 
       LEFT JOIN roles r ON p.rol_id = r.id 
       WHERE p.nombre LIKE ? OR p.apellido LIKE ? 
       ORDER BY p.nombre, p.apellido`,
      [`%${searchTerm}%`, `%${searchTerm}%`]
    );
    
    return rows as IPersona[];
  }

  /**
   * Actualizar persona
   */
  static async update(id: number, personaData: UpdatePersonaInput): Promise<IPersona | null> {
    const { nombre, apellido, correo, contraseña, rol_id } = personaData;
    const updates: string[] = [];
    const values: any[] = [];
    
    if (nombre !== undefined) {
      updates.push('nombre = ?');
      values.push(nombre);
    }
    
    if (apellido !== undefined) {
      updates.push('apellido = ?');
      values.push(apellido);
    }
    
    if (correo !== undefined) {
      updates.push('correo = ?');
      values.push(correo);
    }
    
    if (contraseña !== undefined) {
      updates.push('contraseña = ?');
      values.push(contraseña);
    }
    
    if (rol_id !== undefined) {
      updates.push('rol_id = ?');
      values.push(rol_id);
    }
    
    if (updates.length === 0) {
      return this.findById(id);
    }
    
    values.push(id);
    
    const [result] = await pool.execute<ResultSetHeader>(
      `UPDATE personas SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      values
    );
    
    if (result.affectedRows === 0) {
      return null;
    }
    
    return this.findById(id);
  }

  /**
   * Eliminar persona
   */
  static async delete(id: number): Promise<boolean> {
    const [result] = await pool.execute<ResultSetHeader>(
      'DELETE FROM personas WHERE id = ?',
      [id]
    );
    
    return result.affectedRows > 0;
  }

  /**
   * Verificar si existe una persona con el correo
   */
  static async CorreoExists(correo: string, excludeId?: number): Promise<boolean> {
    let query = 'SELECT COUNT(*) as count FROM personas WHERE correo = ?';
    const params: any[] = [correo];
    
    if (excludeId) {
      query += ' AND id != ?';
      params.push(excludeId);
    }
    
    const [rows] = await pool.execute<RowDataPacket[]>(query, params);
    
    return (rows[0] as any).count > 0;
  }

  /**
   * Contar total de personas
   */
  static async count(): Promise<number> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT COUNT(*) as count FROM personas'
    );
    
    return (rows[0] as any).count;
  }

  /**
   * Obtener personas con paginación
   */
  static async findWithPagination(page: number = 1, limit: number = 10): Promise<{
    personas: IPersona[];
    total: number;
    totalPages: number;
    currentPage: number;
    hasNext: boolean;
    hasPrev: boolean;
  }> {
    // Asegurar que page y limit sean números válidos
    const validPage = Math.max(1, Math.floor(page));
    const validLimit = Math.max(1, Math.min(100, Math.floor(limit)));
    const offset = (validPage - 1) * validLimit;
    
    const [personas, total] = await Promise.all([
      this.findAll(validLimit, offset),
      this.count()
    ]);
    
    const totalPages = Math.ceil(total / validLimit);
    
    return {
      personas,
      total,
      totalPages,
      currentPage: validPage,
      hasNext: validPage < totalPages,
      hasPrev: validPage > 1
    };
  }

  /**
   * Obtener personas por rol
   */
  static async findByRole(roleName: string): Promise<IPersona[]> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT p.id, p.nombre, p.apellido, p.correo, p.rol_id, 
              p.created_at, p.updated_at, r.nombre as rol_nombre
       FROM personas p 
       INNER JOIN roles r ON p.rol_id = r.id 
       WHERE r.nombre = ?
       ORDER BY p.nombre, p.apellido`,
      [roleName]
    );
    
    return rows as IPersona[];
  }
}