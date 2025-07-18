import Joi from 'joi';

// Esquema para registro de persona/usuario
export const registerSchema = Joi.object({
  correo: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Debe ser un correo válido',
      'any.required': 'El correo es requerido'
    }),
  contraseña: Joi.string()
    .min(3)
    .required()
    .messages({
      'string.min': 'La contraseña debe tener al menos 3 caracteres',
      'any.required': 'La contraseña es requerida'
    }),
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
  rol_id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.base': 'El ID del rol debe ser un número',
      'number.integer': 'El ID del rol debe ser un número entero',
      'number.positive': 'El ID del rol debe ser un número positivo',
      'any.required': 'El rol es requerido'
    })
});

// Esquema para login
export const loginSchema = Joi.object({
  correo: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Debe ser un correo válido',
      'any.required': 'El correo es requerido'
    }),
  contraseña: Joi.string()
    .required()
    .messages({
      'any.required': 'La contraseña es requerida'
    })
});

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
  correo: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Debe ser un correo válido',
      'any.required': 'El correo es requerido'
    }),
  contraseña: Joi.string()
    .min(3)
    .required()
    .messages({
      'string.min': 'La contraseña debe tener al menos 3 caracteres',
      'any.required': 'La contraseña es requerida'
    }),
  rol_id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.base': 'El ID del rol debe ser un número',
      'number.integer': 'El ID del rol debe ser un número entero',
      'number.positive': 'El ID del rol debe ser un número positivo',
      'any.required': 'El rol es requerido'
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
  correo: Joi.string()
    .email()
    .optional()
    .messages({
      'string.email': 'Debe ser un correo válido'
    }),
  contraseña: Joi.string()
    .min(3)
    .optional()
    .messages({
      'string.min': 'La contraseña debe tener al menos 3 caracteres'
    }),
  rol_id: Joi.number()
    .integer()
    .positive()
    .optional()
    .messages({
      'number.base': 'El ID del rol debe ser un número',
      'number.integer': 'El ID del rol debe ser un número entero',
      'number.positive': 'El ID del rol debe ser un número positivo'
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

// Esquema para crear rol
export const createRoleSchema = Joi.object({
  nombre: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.min': 'El nombre del rol debe tener al menos 2 caracteres',
      'string.max': 'El nombre del rol no puede exceder 50 caracteres',
      'any.required': 'El nombre del rol es requerido'
    })
});

// Esquema para actualizar rol
export const updateRoleSchema = Joi.object({
  nombre: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.min': 'El nombre del rol debe tener al menos 2 caracteres',
      'string.max': 'El nombre del rol no puede exceder 50 caracteres',
      'any.required': 'El nombre del rol es requerido'
    })
});

// Esquema para parámetros de rol
export const roleParamSchema = Joi.object({
  role: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.min': 'El nombre del rol debe tener al menos 2 caracteres',
      'string.max': 'El nombre del rol no puede exceder 50 caracteres',
      'any.required': 'El nombre del rol es requerido'
    })
});