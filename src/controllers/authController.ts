import { Request, Response } from 'express';
import { IAPIResponse, ILoginResponse, CreatePersonaInput } from '../types';
import { PersonaModel } from '../models/Persona';
import { AppError } from '../middleware/errorHandler';

export class AuthController {
  /**
   * Registro de nuevo usuario
   */
  static async register(req: Request, res: Response<IAPIResponse>): Promise<void> {
    try {
      const userData: CreatePersonaInput = req.body;

      // Verificar si el correo ya existe
      const existingUser = await PersonaModel.CorreoExists(userData.correo);
      if (existingUser) {
        throw new AppError('El correo ya está registrado', 409);
      }

      // Crear el usuario (contraseña en texto plano - solo para demo)
      const newUser = await PersonaModel.create(userData);

      res.status(201).json({
        success: true,
        message: 'Usuario registrado exitosamente',
        data: {
          id: newUser.id!,
          correo: newUser.correo,
          nombre: newUser.nombre
        }
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Inicio de sesión básico
   */
  static async login(req: Request, res: Response<IAPIResponse<ILoginResponse>>): Promise<void> {
    try {
      const { correo, contraseña } = req.body;

      // Buscar usuario por correo (con contraseña)
      const user = await PersonaModel.findByCorreoWithContraseña(correo);
      if (!user) {
        throw new AppError('Credenciales inválidas', 401);
      }

      // Verificar contraseña (comparación directa - solo para demo)
      if (user.contraseña !== contraseña) {
        throw new AppError('Credenciales inválidas', 401);
      }

      res.status(200).json({
        success: true,
        message: 'Inicio de sesión exitoso',
        data: {
          message: 'Login exitoso',
          user: {
            id: user.id!,
            correo: user.correo,
            nombre: user.nombre,
            apellido: user.apellido,
            rol: String(user.rol_id)
          }
        }
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Listar todos los usuarios registrados
   */
  static async getUsers(_req: Request, res: Response<IAPIResponse>): Promise<void> {
    try {
      const users = await PersonaModel.findAll();

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

  /**
   * Verificar credenciales (endpoint de prueba)
   */
  static async verify(req: Request, res: Response<IAPIResponse>): Promise<void> {
    try {
      const { correo, contraseña } = req.body;

      const user = await PersonaModel.findByCorreoWithContraseña(correo);
      if (!user || user.contraseña !== contraseña) {
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
          id: user.id,
          correo: user.correo,
          nombre: user.nombre
        }
      });
    } catch (error) {
      throw error;
    }
  }
}