import { Request } from 'express';

// Interface para Rol
export interface IRole {
  id?: number;
  nombre: string;
  created_at?: Date;
  updated_at?: Date;
}

// Interface para Persona (CRUD + Login)
export interface IPersona {
  id?: number;
  nombre: string;
  apellido: string;
  correo: string;
  contraseña: string;
  rol_id: number;
  created_at?: Date;
  updated_at?: Date;
  // Campos virtuales para joins
  rol_nombre?: string;
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
    correo: string;
    nombre: string;
    apellido: string;
    rol: string;
  };
}

// Types para validaciones
export type CreatePersonaInput = Omit<IPersona, 'id' | 'created_at' | 'updated_at'>;
export type UpdatePersonaInput = Partial<Omit<CreatePersonaInput, 'contraseña'>> & {
  contraseña?: string;
};
export type LoginInput = {
  correo: string;
  contraseña: string;
};
export type RegisterInput = CreatePersonaInput;

// Interface para configuración de base de datos
export interface IDBConfig {
  host: string;
  user: string;
  password: string;
  database: string;
  port: number;
}