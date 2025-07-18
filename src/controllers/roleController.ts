import { Request, Response } from 'express';
import { IAPIResponse } from '../types';
import { RoleModel } from '../models/Role';
import { AppError } from '../middleware/errorHandler';

export class RoleController {
  /**
   * Crear un nuevo rol
   */
  static async create(req: Request, res: Response<IAPIResponse>): Promise<void> {
    try {
      const { nombre } = req.body;

      if (!nombre || typeof nombre !== 'string') {
        throw new AppError('El nombre del rol es requerido', 400);
      }

      // Verificar si el rol ya existe
      const existingRole = await RoleModel.nameExists(nombre.trim());
      if (existingRole) {
        throw new AppError('Ya existe un rol con este nombre', 409);
      }

      const newRole = await RoleModel.create(nombre.trim());

      res.status(201).json({
        success: true,
        message: 'Rol creado exitosamente',
        data: newRole
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Obtener todos los roles
   */
  static async getAll(_req: Request, res: Response<IAPIResponse>): Promise<void> {
    try {
      const roles = await RoleModel.findAll();

      res.status(200).json({
        success: true,
        message: 'Roles obtenidos exitosamente',
        data: {
          roles,
          total: roles.length
        }
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Obtener rol por ID
   */
  static async getById(req: Request, res: Response<IAPIResponse>): Promise<void> {
    try {
      const { id } = req.params;
      
      if (!id) {
        throw new AppError('ID del rol requerido', 400);
      }
      
      const roleId = parseInt(id);
      
      if (isNaN(roleId)) {
        throw new AppError('ID del rol inválido', 400);
      }

      const role = await RoleModel.findById(roleId);
      if (!role) {
        throw new AppError('Rol no encontrado', 404);
      }

      res.status(200).json({
        success: true,
        message: 'Rol obtenido exitosamente',
        data: role
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Actualizar rol
   */
  static async update(req: Request, res: Response<IAPIResponse>): Promise<void> {
    try {
      const { id } = req.params;
      const { nombre } = req.body;
      
      if (!id) {
        throw new AppError('ID del rol requerido', 400);
      }
      
      const roleId = parseInt(id);
      
      if (isNaN(roleId)) {
        throw new AppError('ID del rol inválido', 400);
      }

      if (!nombre || typeof nombre !== 'string') {
        throw new AppError('El nombre del rol es requerido', 400);
      }

      // Verificar si el rol existe
      const existingRole = await RoleModel.findById(roleId);
      if (!existingRole) {
        throw new AppError('Rol no encontrado', 404);
      }

      // Verificar si ya existe otro rol con el mismo nombre
      const nameExists = await RoleModel.nameExists(nombre.trim());
      if (nameExists) {
        const roleWithName = await RoleModel.findByName(nombre.trim());
        if (roleWithName && roleWithName.id !== roleId) {
          throw new AppError('Ya existe otro rol con este nombre', 409);
        }
      }

      const updatedRole = await RoleModel.update(roleId, nombre.trim());
      if (!updatedRole) {
        throw new AppError('Error al actualizar el rol', 500);
      }

      res.status(200).json({
        success: true,
        message: 'Rol actualizado exitosamente',
        data: updatedRole
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Eliminar rol
   */
  static async delete(req: Request, res: Response<IAPIResponse>): Promise<void> {
    try {
      const { id } = req.params;
      
      if (!id) {
        throw new AppError('ID del rol requerido', 400);
      }
      
      const roleId = parseInt(id);
      
      if (isNaN(roleId)) {
        throw new AppError('ID del rol inválido', 400);
      }

      // Verificar si el rol existe
      const existingRole = await RoleModel.findById(roleId);
      if (!existingRole) {
        throw new AppError('Rol no encontrado', 404);
      }

      // TODO: Verificar si hay personas usando este rol antes de eliminar
      // Por ahora permitimos eliminar cualquier rol

      const deleted = await RoleModel.delete(roleId);
      if (!deleted) {
        throw new AppError('Error al eliminar el rol', 500);
      }

      res.status(200).json({
        success: true,
        message: 'Rol eliminado exitosamente',
        data: {
          id: roleId,
          deleted: true
        }
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Obtener estadísticas de roles
   */
  static async getStats(_req: Request, res: Response<IAPIResponse>): Promise<void> {
    try {
      const totalRoles = await RoleModel.count();
      const roles = await RoleModel.findAll();

      res.status(200).json({
        success: true,
        message: 'Estadísticas de roles obtenidas exitosamente',
        data: {
          total: totalRoles,
          roles: roles.map(r => ({
            id: r.id,
            nombre: r.nombre,
            created_at: r.created_at
          }))
        }
      });
    } catch (error) {
      throw error;
    }
  }
}