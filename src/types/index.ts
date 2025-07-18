import { Request } from 'express';

// Interface para Usuario (login básico)
export interface IUser {
  id?: number;
  email: string;
  password: string;
  nombre: string;
  created_at?: Date;
  updated_at?: Date;
}

// Interface para Persona (CRUD)
export interface IPersona {
  id?: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  fecha_nacimiento?: Date;
  direccion?: string;
  created_at?: Date;
  updated_at?: Date;
}

// Interface para respuestas de API
export interface IAPIResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// Interface para respuesta de login
export interface ILoginResponse {
  message: string;
  user: {
    id: number;
    email: string;
    nombre: string;
  };
}

// Types para validaciones
export type CreateUserInput = Omit<IUser, 'id' | 'created_at' | 'updated_at'>;
export type CreatePersonaInput = Omit<IPersona, 'id' | 'created_at' | 'updated_at'>;
export type UpdatePersonaInput = Partial<CreatePersonaInput>;

// Interface para configuración de base de datos
export interface IDBConfig {
  host: string;
  user: string;
  password: string;
  database: string;
  port: number;
}