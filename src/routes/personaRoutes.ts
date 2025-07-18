import { Router } from 'express';
import { PersonaController } from '../controllers/personaController';
import { validateBody, validateParams, validateQuery } from '../middleware/validation';
import { asyncHandler } from '../middleware/errorHandler';
import { 
  createPersonaSchema, 
  updatePersonaSchema, 
  idParamSchema 
} from '../utils/validations';
import Joi from 'joi';

const router = Router();



const searchSchema = Joi.object({
  term: Joi.string().min(1).required().messages({
    'string.min': 'El término de búsqueda debe tener al menos 1 caracter',
    'any.required': 'El término de búsqueda es requerido'
  })
});

/**
 * @route   POST /api/personas
 * @desc    Crear una nueva persona
 * @access  Public
 */
router.post(
  '/',
  validateBody(createPersonaSchema),
  asyncHandler(PersonaController.create)
);

/**
 * @route   GET /api/personas
 * @desc    Obtener todas las personas con paginación y búsqueda
 * @access  Public
 */
router.get(
  '/',
  asyncHandler(PersonaController.getAll)
);

/**
 * @route   GET /api/personas/search
 * @desc    Buscar personas por nombre o apellido
 * @access  Public
 */
router.get(
  '/search',
  validateQuery(searchSchema),
  asyncHandler(PersonaController.search)
);

/**
 * @route   GET /api/personas/stats
 * @desc    Obtener estadísticas de personas
 * @access  Public
 */
router.get(
  '/stats',
  asyncHandler(PersonaController.getStats)
);

/**
 * @route   GET /api/personas/:id
 * @desc    Obtener persona por ID
 * @access  Public
 */
router.get(
  '/:id',
  validateParams(idParamSchema),
  asyncHandler(PersonaController.getById)
);

/**
 * @route   PUT /api/personas/:id
 * @desc    Actualizar persona por ID
 * @access  Public
 */
router.put(
  '/:id',
  validateParams(idParamSchema),
  validateBody(updatePersonaSchema),
  asyncHandler(PersonaController.update)
);

/**
 * @route   DELETE /api/personas/:id
 * @desc    Eliminar persona por ID
 * @access  Public
 */
router.delete(
  '/:id',
  validateParams(idParamSchema),
  asyncHandler(PersonaController.delete)
);

export default router;