import { Request, Response } from 'express';
import { IAPIResponse, CreatePersonaInput, UpdatePersonaInput } from '../types';
import { PersonaModel } from '../models/Persona';
import { AppError } from '../middleware/errorHandler';

export class PersonaController {
  /**
   * Crear una nueva persona
   */
  static async create(req: Request, res: Response<IAPIResponse>): Promise<void> {
    try {
      const personaData: CreatePersonaInput = req.body;

      // Verificar si el email ya existe
      const existingPersona = await PersonaModel.emailExists(personaData.email);
      if (existingPersona) {
        throw new AppError('Ya existe una persona con este email', 409);
      }

      const newPersona = await PersonaModel.create(personaData);

      res.status(201).json({
        success: true,
        message: 'Persona creada exitosamente',
        data: newPersona
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Obtener todas las personas
   */
  static async getAll(req: Request, res: Response<IAPIResponse>): Promise<void> {
    try {
      const search = req.query.search as string;

      // Si hay término de búsqueda, buscar por nombre/apellido
      if (search && search.trim()) {
        const personas = await PersonaModel.searchByName(search.trim());
        res.status(200).json({
          success: true,
          message: 'Búsqueda completada',
          data: {
            personas,
            total: personas.length,
            search: search.trim()
          }
        });
        return;
      }

      // SIEMPRE usar el método simple sin paginación por ahora
      const personas = await PersonaModel.getAll();
      const total = personas.length;

      res.status(200).json({
        success: true,
        message: 'Personas obtenidas exitosamente',
        data: {
          personas,
          total,
          totalPages: 1,
          currentPage: 1,
          hasNext: false,
          hasPrev: false
        }
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Obtener persona por ID
   */
  static async getById(req: Request, res: Response<IAPIResponse>): Promise<void> {
    try {
      const { id } = req.params;
      
      if (!id) {
        throw new AppError('ID de persona requerido', 400);
      }
      
      const personaId = parseInt(id);
      
      if (isNaN(personaId)) {
        throw new AppError('ID de persona inválido', 400);
      }

      const persona = await PersonaModel.findById(personaId);
      if (!persona) {
        throw new AppError('Persona no encontrada', 404);
      }

      res.status(200).json({
        success: true,
        message: 'Persona obtenida exitosamente',
        data: persona
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Actualizar persona
   */
  static async update(req: Request, res: Response<IAPIResponse>): Promise<void> {
    try {
      const { id } = req.params;
      
      if (!id) {
        throw new AppError('ID de persona requerido', 400);
      }
      
      const personaId = parseInt(id);
      
      if (isNaN(personaId)) {
        throw new AppError('ID de persona inválido', 400);
      }
      
      const updateData: UpdatePersonaInput = req.body;

      // Verificar si la persona existe
      const existingPersona = await PersonaModel.findById(personaId);
      if (!existingPersona) {
        throw new AppError('Persona no encontrada', 404);
      }

      // Si se está actualizando el email, verificar que no exista en otra persona
      if (updateData.email) {
        const emailExists = await PersonaModel.emailExists(updateData.email, personaId);
        if (emailExists) {
          throw new AppError('Ya existe otra persona con este email', 409);
        }
      }

      const updatedPersona = await PersonaModel.update(personaId, updateData);
      if (!updatedPersona) {
        throw new AppError('Error al actualizar la persona', 500);
      }

      res.status(200).json({
        success: true,
        message: 'Persona actualizada exitosamente',
        data: updatedPersona
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Eliminar persona
   */
  static async delete(req: Request, res: Response<IAPIResponse>): Promise<void> {
    try {
      const { id } = req.params;
      
      if (!id) {
        throw new AppError('ID de persona requerido', 400);
      }
      
      const personaId = parseInt(id);
      
      if (isNaN(personaId)) {
        throw new AppError('ID de persona inválido', 400);
      }

      // Verificar si la persona existe
      const existingPersona = await PersonaModel.findById(personaId);
      if (!existingPersona) {
        throw new AppError('Persona no encontrada', 404);
      }

      const deleted = await PersonaModel.delete(personaId);
      if (!deleted) {
        throw new AppError('Error al eliminar la persona', 500);
      }

      res.status(200).json({
        success: true,
        message: 'Persona eliminada exitosamente',
        data: {
          id: personaId,
          deleted: true
        }
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Buscar personas por nombre o apellido
   */
  static async search(req: Request, res: Response<IAPIResponse>): Promise<void> {
    try {
      const { term } = req.query;
      
      if (!term || typeof term !== 'string') {
        throw new AppError('Término de búsqueda requerido', 400);
      }

      const personas = await PersonaModel.searchByName(term);

      res.status(200).json({
        success: true,
        message: 'Búsqueda completada',
        data: {
          personas,
          total: personas.length,
          searchTerm: term
        }
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Obtener estadísticas de personas
   */
  static async getStats(_req: Request, res: Response<IAPIResponse>): Promise<void> {
    try {
      const totalPersonas = await PersonaModel.count();
      const personas = await PersonaModel.findAll();

      // Calcular estadísticas básicas
      const conTelefono = personas.filter(p => p.telefono).length;
      const conDireccion = personas.filter(p => p.direccion).length;
      const conFechaNacimiento = personas.filter(p => p.fecha_nacimiento).length;

      res.status(200).json({
        success: true,
        message: 'Estadísticas obtenidas exitosamente',
        data: {
          total: totalPersonas,
          conTelefono,
          conDireccion,
          conFechaNacimiento,
          porcentajeCompletos: totalPersonas > 0 
            ? Math.round((conFechaNacimiento / totalPersonas) * 100) 
            : 0
        }
      });
    } catch (error) {
      throw error;
    }
  }
}