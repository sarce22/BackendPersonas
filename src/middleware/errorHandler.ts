import { Request, Response, NextFunction } from 'express';
import { IAPIResponse } from '../types';

/**
 * Clase personalizada para errores de la aplicación
 */
export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Middleware global para manejo de errores
 */
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response<IAPIResponse>,
  _next: NextFunction
): void => {
  console.error('Error capturado:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  // Error personalizado de la aplicación
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      error: err.isOperational ? err.message : 'Internal server error'
    });
    return;
  }

  // Errores específicos de MySQL
  if ('code' in err) {
    const mysqlError = err as any;
    
    switch (mysqlError.code) {
      case 'ER_DUP_ENTRY':
        res.status(409).json({
          success: false,
          message: 'Ya existe un registro con estos datos',
          error: 'Duplicate entry'
        });
        return;
        
      case 'ER_NO_REFERENCED_ROW_2':
        res.status(400).json({
          success: false,
          message: 'Referencia inválida en los datos',
          error: 'Invalid reference'
        });
        return;
        
      case 'ECONNREFUSED':
        res.status(503).json({
          success: false,
          message: 'Error de conexión a la base de datos',
          error: 'Database connection failed'
        });
        return;
    }
  }

  // Error de sintaxis JSON
  if (err instanceof SyntaxError && 'body' in err) {
    res.status(400).json({
      success: false,
      message: 'JSON inválido en el cuerpo de la petición',
      error: 'Invalid JSON syntax'
    });
    return;
  }

  // Error genérico del servidor
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
};

/**
 * Middleware para manejar rutas no encontradas
 */
export const notFoundHandler = (
  req: Request,
  res: Response<IAPIResponse>
): void => {
  res.status(404).json({
    success: false,
    message: `Ruta ${req.method} ${req.originalUrl} no encontrada`,
    error: 'Route not found'
  });
};

/**
 * Wrapper para funciones async que permite capturar errores automáticamente
 */
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};