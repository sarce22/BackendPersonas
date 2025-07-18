import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { validateBody } from '../middleware/validation';
import { asyncHandler } from '../middleware/errorHandler';
import { registerSchema, loginSchema } from '../utils/validations';

const router = Router();

/**
 * @route   POST /api/auth/register
 * @desc    Registrar nuevo usuario
 * @access  Public
 */
router.post(
  '/register',
  validateBody(registerSchema),
  asyncHandler(AuthController.register)
);

/**
 * @route   POST /api/auth/login
 * @desc    Iniciar sesión
 * @access  Public
 */
router.post(
  '/login',
  validateBody(loginSchema),
  asyncHandler(AuthController.login)
);

/**
 * @route   POST /api/auth/verify
 * @desc    Verificar credenciales (endpoint de prueba)
 * @access  Public
 */
router.post(
  '/verify',
  validateBody(loginSchema),
  asyncHandler(AuthController.verify)
);

/**
 * @route   GET /api/auth/users
 * @desc    Listar usuarios registrados
 * @access  Public
 */
router.get(
  '/users',
  asyncHandler(AuthController.getUsers)
);

export default router;