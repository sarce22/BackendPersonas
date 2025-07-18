import { pool } from '../config/database';
import { IPersona, CreatePersonaInput, UpdatePersonaInput } from '../types';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export class PersonaModel {
  /**
   * Crear una nueva persona
   */
  static async create(personaData: CreatePersonaInput): Promise<IPersona> {
    const { nombre, apellido, email, telefono, fecha_nacimiento, direccion } = personaData;
    
    const [result] = await pool.execute<ResultSetHeader>(
      `INSERT INTO personas (nombre, apellido, email, telefono, fecha_nacimiento, direccion) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [nombre, apellido, email, telefono || null, fecha_nacimiento || null, direccion || null]
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
      'SELECT * FROM personas ORDER BY created_at DESC'
    );
    return rows as IPersona[];
  }

  /**
   * Obtener todas las personas
   */
  static async findAll(limit?: number, offset?: number): Promise<IPersona[]> {
    // Caso 1: Sin límite ni offset - usar query simple
    if (limit === undefined && offset === undefined) {
      const [rows] = await pool.query<RowDataPacket[]>(
        'SELECT * FROM personas ORDER BY created_at DESC'
      );
      return rows as IPersona[];
    }
    
    // Caso 2: Solo con límite
    if (limit !== undefined && offset === undefined) {
      const [rows] = await pool.execute<RowDataPacket[]>(
        'SELECT * FROM personas ORDER BY created_at DESC LIMIT ?',
        [limit]
      );
      return rows as IPersona[];
    }
    
    // Caso 3: Con límite y offset
    if (limit !== undefined && offset !== undefined) {
      const [rows] = await pool.execute<RowDataPacket[]>(
        'SELECT * FROM personas ORDER BY created_at DESC LIMIT ? OFFSET ?',
        [limit, offset]
      );
      return rows as IPersona[];
    }
    
    // Caso por defecto
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM personas ORDER BY created_at DESC'
    );
    return rows as IPersona[];
  }

  /**
   * Buscar persona por ID
   */
  static async findById(id: number): Promise<IPersona | null> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM personas WHERE id = ?',
      [id]
    );
    
    if (rows.length === 0) return null;
    
    return rows[0] as IPersona;
  }

  /**
   * Buscar persona por email
   */
  static async findByEmail(email: string): Promise<IPersona | null> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM personas WHERE email = ?',
      [email]
    );
    
    if (rows.length === 0) return null;
    
    return rows[0] as IPersona;
  }

  /**
   * Buscar personas por nombre o apellido
   */
  static async searchByName(searchTerm: string): Promise<IPersona[]> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT * FROM personas 
       WHERE nombre LIKE ? OR apellido LIKE ? 
       ORDER BY nombre, apellido`,
      [`%${searchTerm}%`, `%${searchTerm}%`]
    );
    
    return rows as IPersona[];
  }

  /**
   * Actualizar persona
   */
  static async update(id: number, personaData: UpdatePersonaInput): Promise<IPersona | null> {
    const { nombre, apellido, email, telefono, fecha_nacimiento, direccion } = personaData;
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
    
    if (email !== undefined) {
      updates.push('email = ?');
      values.push(email);
    }
    
    if (telefono !== undefined) {
      updates.push('telefono = ?');
      values.push(telefono || null);
    }
    
    if (fecha_nacimiento !== undefined) {
      updates.push('fecha_nacimiento = ?');
      values.push(fecha_nacimiento || null);
    }
    
    if (direccion !== undefined) {
      updates.push('direccion = ?');
      values.push(direccion || null);
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
   * Verificar si existe una persona con el email
   */
  static async emailExists(email: string, excludeId?: number): Promise<boolean> {
    let query = 'SELECT COUNT(*) as count FROM personas WHERE email = ?';
    const params: any[] = [email];
    
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
}