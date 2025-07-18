// routes/auth.routes.ts
import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { validateBody } from '../middleware/validation';
import { asyncHandler } from '../middleware/errorHandler';
import { registerSchema, loginSchema } from '../utils/validations';

const router = Router();

router.post('/register', validateBody(registerSchema), asyncHandler(AuthController.register));
router.post('/login', validateBody(loginSchema), asyncHandler(AuthController.login));
router.post('/verify', validateBody(loginSchema), asyncHandler(AuthController.verify));
router.get('/users', asyncHandler(AuthController.getUsers));

export default router;
