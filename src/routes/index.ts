import { Router, Request, Response } from 'express';
import { IAPIResponse } from '../types';
import personaRoutes from './personaRoutes';

const router = Router();

/**
 * @route   GET /api/health
 * @desc    Health check endpoint
 * @access  Public
 */
router.get('/health', (_req: Request, res: Response<IAPIResponse>) => {
  res.status(200).json({
    success: true,
    message: 'API funcionando correctamente',
    data: {
      status: 'OK',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development'
    }
  });
});

/**
 * @route   GET /api
 * @desc    API información básica
 * @access  Public
 */
router.get('/', (_req: Request, res: Response<IAPIResponse>) => {
  res.status(200).json({
    success: true,
    message: 'API de Gestión de Personas',
    data: {
      version: '1.0.0',
      description: 'API RESTful para gestión de personas',
      endpoints: {
        personas: '/api/personas',
        health: '/api/health'
      },
      documentation: {
        swagger: '/api/docs', // Para futuras implementaciones
        postman: '/api/postman' // Para futuras implementaciones
      }
    }
  });
});

// Rutas de personas
router.use('/personas', personaRoutes);

export default router;