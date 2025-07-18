import Joi from 'joi';

// Esquema para crear persona
export const createPersonaSchema = Joi.object({
  nombre: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.min': 'El nombre debe tener al menos 2 caracteres',
      'string.max': 'El nombre no puede exceder 100 caracteres',
      'any.required': 'El nombre es requerido'
    }),
  apellido: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.min': 'El apellido debe tener al menos 2 caracteres',
      'string.max': 'El apellido no puede exceder 100 caracteres',
      'any.required': 'El apellido es requerido'
    }),
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Debe ser un email válido',
      'any.required': 'El email es requerido'
    }),
  telefono: Joi.string()
    .optional()
    .allow('')
    .max(20)
    .messages({
      'string.max': 'El teléfono no puede exceder 20 caracteres'
    }),
  fecha_nacimiento: Joi.date()
    .optional()
    .max('now')
    .messages({
      'date.max': 'La fecha de nacimiento no puede ser futura'
    }),
  direccion: Joi.string()
    .optional()
    .allow('')
    .max(500)
    .messages({
      'string.max': 'La dirección no puede exceder 500 caracteres'
    })
});

// Esquema para actualizar persona
export const updatePersonaSchema = Joi.object({
  nombre: Joi.string()
    .min(2)
    .max(100)
    .optional()
    .messages({
      'string.min': 'El nombre debe tener al menos 2 caracteres',
      'string.max': 'El nombre no puede exceder 100 caracteres'
    }),
  apellido: Joi.string()
    .min(2)
    .max(100)
    .optional()
    .messages({
      'string.min': 'El apellido debe tener al menos 2 caracteres',
      'string.max': 'El apellido no puede exceder 100 caracteres'
    }),
  email: Joi.string()
    .email()
    .optional()
    .messages({
      'string.email': 'Debe ser un email válido'
    }),
  telefono: Joi.string()
    .optional()
    .allow('')
    .max(20)
    .messages({
      'string.max': 'El teléfono no puede exceder 20 caracteres'
    }),
  fecha_nacimiento: Joi.date()
    .optional()
    .max('now')
    .messages({
      'date.max': 'La fecha de nacimiento no puede ser futura'
    }),
  direccion: Joi.string()
    .optional()
    .allow('')
    .max(500)
    .messages({
      'string.max': 'La dirección no puede exceder 500 caracteres'
    })
});

// Esquema para parámetros de ID
export const idParamSchema = Joi.object({
  id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.base': 'El ID debe ser un número',
      'number.integer': 'El ID debe ser un número entero',
      'number.positive': 'El ID debe ser un número positivo',
      'any.required': 'El ID es requerido'
    })
});