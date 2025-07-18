import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { IAPIResponse } from '@/types';

/**
 * Tipos de validación
 */
type ValidationType = 'body' | 'params' | 'query';

/**
 * Middleware factory para validar datos usando esquemas Joi
 */
export const validate = (schema: Joi.ObjectSchema, type: ValidationType = 'body') => {
  return (req: Request, res: Response<IAPIResponse>, next: NextFunction): void => {
    try {
      let dataToValidate: any;
      
      switch (type) {
        case 'body':
          dataToValidate = req.body;
          break;
        case 'params':
          dataToValidate = req.params;
          break;
        case 'query':
          dataToValidate = req.query;
          break;
        default:
          dataToValidate = req.body;
      }

      const { error, value } = schema.validate(dataToValidate, {
        abortEarly: false, // Retorna todos los errores, no solo el primero
        stripUnknown: true, // Elimina campos no definidos en el esquema
        convert: true // Convierte tipos automáticamente
      });

      if (error) {
        const errorMessages = error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        }));

        res.status(400).json({
          success: false,
          message: 'Errores de validación',
          error: 'Validation failed',
          data: {
            errors: errorMessages
          }
        });
        return;
      }

      // Reemplazar los datos originales con los valores validados y procesados
      switch (type) {
        case 'body':
          req.body = value;
          break;
        case 'params':
          req.params = value;
          break;
        case 'query':
          req.query = value;
          break;
      }

      next();
    } catch (err) {
      console.error('Error en middleware de validación:', err);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: 'Internal validation error'
      });
    }
  };
};

/**
 * Middleware específico para validar el body
 */
export const validateBody = (schema: Joi.ObjectSchema) => {
  return validate(schema, 'body');
};

/**
 * Middleware específico para validar parámetros
 */
export const validateParams = (schema: Joi.ObjectSchema) => {
  return validate(schema, 'params');
};

/**
 * Middleware específico para validar query parameters
 */
export const validateQuery = (schema: Joi.ObjectSchema) => {
  return validate(schema, 'query');
};