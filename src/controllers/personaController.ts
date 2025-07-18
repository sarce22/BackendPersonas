import { Request, Response } from 'express';
import { IAPIResponse, CreatePersonaInput, UpdatePersonaInput, ILoginResponse, LoginInput } from '../types';
import { PersonaModel } from '../models/Persona';
import { RoleModel } from '../models/Role';
import { AppError } from '../middleware/errorHandler';

export class PersonaController {
  /**
   * REGISTRO - Crear una nueva persona
   */
  static async register(req: Request, res: Response<IAPIResponse>): Promise<void> {
    try {
      const personaData: CreatePersonaInput = req.body;

      // Verificar si el correo ya existe
      const existingPersona = await PersonaModel.emailExists(personaData.correo);
      if (existingPersona) {
        throw new AppError('Ya existe una persona con este correo', 409);
      }

      // Verificar que el rol existe
      const role = await RoleModel.findById(personaData.rol_id);
      if (!role) {
        throw new AppError('El rol especificado no existe', 400);
      }

      const newPersona = await PersonaModel.create(personaData);

      res.status(201).json({
        success: true,
        message: 'Persona registrada exitosamente',
        data: {
          id: newPersona.id!,
          nombre: newPersona.nombre,
          apellido: newPersona.apellido,
          correo: newPersona.correo,
          rol: newPersona.rol_nombre
        }
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * LOGIN - Iniciar sesión
   */
  static async login(req: Request, res: Response<IAPIResponse<ILoginResponse>>): Promise<void> {
    try {
      const { correo, contraseña }: LoginInput = req.body;

      // Buscar persona por correo (con contraseña)
      const persona = await PersonaModel.findByEmailWithPassword(correo);
      if (!persona) {
        throw new AppError('Credenciales inválidas', 401);
      }

      // Verificar contraseña (comparación directa - login básico)
      if (persona.contraseña !== contraseña) {
        throw new AppError('Credenciales inválidas', 401);
      }

      res.status(200).json({
        success: true,
        message: 'Inicio de sesión exitoso',
        data: {
          message: 'Login exitoso',
          user: {
            id: persona.id!,
            correo: persona.correo,
            nombre: persona.nombre,
            apellido: persona.apellido,
            rol: persona.rol_nombre || 'sin rol'
          }
        }
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Crear una nueva persona (CRUD)
   */
  static async create(req: Request, res: Response<IAPIResponse>): Promise<void> {
    try {
      const personaData: CreatePersonaInput = req.body;

      // Verificar si el correo ya existe
      const existingPersona = await PersonaModel.emailExists(personaData.correo);
      if (existingPersona) {
        throw new AppError('Ya existe una persona con este correo', 409);
      }

      // Verificar que el rol existe
      const role = await RoleModel.findById(personaData.rol_id);
      if (!role) {
        throw new AppError('El rol especificado no existe', 400);
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

      // Si se está actualizando el correo, verificar que no exista en otra persona
      if (updateData.correo) {
        const emailExists = await PersonaModel.emailExists(updateData.correo, personaId);
        if (emailExists) {
          throw new AppError('Ya existe otra persona con este correo', 409);
        }
      }

      // Si se está actualizando el rol, verificar que existe
      if (updateData.rol_id) {
        const role = await RoleModel.findById(updateData.rol_id);
        if (!role) {
          throw new AppError('El rol especificado no existe', 400);
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
      const conRol = personas.filter(p => p.rol_id).length;
      
      // Estadísticas por rol
      const roleStats = personas.reduce((acc: any, persona) => {
        const rol = persona.rol_nombre || 'Sin rol';
        acc[rol] = (acc[rol] || 0) + 1;
        return acc;
      }, {});

      res.status(200).json({
        success: true,
        message: 'Estadísticas obtenidas exitosamente',
        data: {
          total: totalPersonas,
          conRol,
          porcentajeConRol: totalPersonas > 0 
            ? Math.round((conRol / totalPersonas) * 100) 
            : 0,
          estadisticasPorRol: roleStats
        }
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Obtener personas por rol
   */
  static async getByRole(req: Request, res: Response<IAPIResponse>): Promise<void> {
    try {
      const { role } = req.params;
      
      if (!role) {
        throw new AppError('Nombre del rol requerido', 400);
      }

      const personas = await PersonaModel.findByRole(role);

      res.status(200).json({
        success: true,
        message: `Personas con rol '${role}' obtenidas exitosamente`,
        data: {
          personas,
          total: personas.length,
          rol: role
        }
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Verificar credenciales (endpoint de prueba)
   */
  static async verify(req: Request, res: Response<IAPIResponse>): Promise<void> {
    try {
      const { correo, contraseña }: LoginInput = req.body;

      const persona = await PersonaModel.findByEmailWithPassword(correo);
      if (!persona || persona.contraseña !== contraseña) {
        res.status(401).json({
          success: false,
          message: 'Credenciales inválidas'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Credenciales válidas',
        data: {
          id: persona.id,
          correo: persona.correo,
          nombre: persona.nombre,
          apellido: persona.apellido,
          rol: persona.rol_nombre
        }
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Listar todas las personas (para auth/users)
   */
  static async getUsers(_req: Request, res: Response<IAPIResponse>): Promise<void> {
    try {
      const personas = await PersonaModel.findAll();

      // Mapear para mostrar como "usuarios"
      const users = personas.map(p => ({
        id: p.id,
        correo: p.correo,
        nombre: p.nombre,
        apellido: p.apellido,
        rol: p.rol_nombre,
        created_at: p.created_at
      }));

      res.status(200).json({
        success: true,
        message: 'Usuarios obtenidos exitosamente',
        data: {
          users,
          total: users.length
        }
      });
    } catch (error) {
      throw error;
    }
  }
}