import { Request, Response } from 'express';
import { IAPIResponse, ILoginResponse, CreateUserInput } from '../types';
import { UserModel } from '../models/User';
import { AppError } from '../middleware/errorHandler';

export class AuthController {
  /**
   * Registro de nuevo usuario
   */
  static async register(req: Request, res: Response<IAPIResponse>): Promise<void> {
    try {
      const userData: CreateUserInput = req.body;

      // Verificar si el email ya existe
      const existingUser = await UserModel.emailExists(userData.email);
      if (existingUser) {
        throw new AppError('El email ya está registrado', 409);
      }

      // Crear el usuario (contraseña en texto plano - solo para demo)
      const newUser = await UserModel.create(userData);

      res.status(201).json({
        success: true,
        message: 'Usuario registrado exitosamente',
        data: {
          id: newUser.id!,
          email: newUser.email,
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
      const { email, password } = req.body;

      // Buscar usuario por email (con contraseña)
      const user = await UserModel.findByEmailWithPassword(email);
      if (!user) {
        throw new AppError('Credenciales inválidas', 401);
      }

      // Verificar contraseña (comparación directa - solo para demo)
      if (user.password !== password) {
        throw new AppError('Credenciales inválidas', 401);
      }

      res.status(200).json({
        success: true,
        message: 'Inicio de sesión exitoso',
        data: {
          message: 'Login exitoso',
          user: {
            id: user.id!,
            email: user.email,
            nombre: user.nombre
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
      const users = await UserModel.findAll();

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
      const { email, password } = req.body;

      const user = await UserModel.findByEmailWithPassword(email);
      if (!user || user.password !== password) {
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
          email: user.email,
          nombre: user.nombre
        }
      });
    } catch (error) {
      throw error;
    }
  }
}