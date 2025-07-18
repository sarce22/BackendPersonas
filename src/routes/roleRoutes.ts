import { Router } from 'express';
import { RoleController } from '../controllers/roleController';
import { validateBody, validateParams } from '../middleware/validation';
import { asyncHandler } from '../middleware/errorHandler';
import { 
  createRoleSchema, 
  updateRoleSchema, 
  idParamSchema 
} from '../utils/validations';

const router = Router();

/**
 * @route   POST /api/roles
 * @desc    Crear un nuevo rol
 * @access  Public
 */
router.post(
  '/',
  validateBody(createRoleSchema),
  asyncHandler(RoleController.create)
);

/**
 * @route   GET /api/roles
 * @desc    Obtener todos los roles
 * @access  Public
 */
router.get(
  '/',
  asyncHandler(RoleController.getAll)
);

/**
 * @route   GET /api/roles/stats
 * @desc    Obtener estadísticas de roles
 * @access  Public
 */
router.get(
  '/stats',
  asyncHandler(RoleController.getStats)
);

/**
 * @route   GET /api/roles/:id
 * @desc    Obtener rol por ID
 * @access  Public
 */
router.get(
  '/:id',
  validateParams(idParamSchema),
  asyncHandler(RoleController.getById)
);

/**
 * @route   PUT /api/roles/:id
 * @desc    Actualizar rol por ID
 * @access  Public
 */
router.put(
  '/:id',
  validateParams(idParamSchema),
  validateBody(updateRoleSchema),
  asyncHandler(RoleController.update)
);

/**
 * @route   DELETE /api/roles/:id
 * @desc    Eliminar rol por ID
 * @access  Public
 */
router.delete(
  '/:id',
  validateParams(idParamSchema),
  asyncHandler(RoleController.delete)
);

export default router;