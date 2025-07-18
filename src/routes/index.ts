import { Router, Request, Response } from 'express';
import { IAPIResponse } from '../types';
import personaRoutes from './personaRoutes';
import roleRoutes from './roleRoutes';

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
    message: 'API de Gestión de Personas con Roles',
    data: {
      version: '1.0.0',
      description: 'API RESTful para gestión de personas con autenticación básica y sistema de roles',
      endpoints: {
        personas: '/api/personas',
        roles: '/api/roles',
        health: '/api/health'
      },
      personasEndpoints: {
        // Autenticación
        register: 'POST /api/personas/register',
        login: 'POST /api/personas/login',
        verify: 'POST /api/personas/verify',
        users: 'GET /api/personas/users',
        // CRUD
        create: 'POST /api/personas',
        getAll: 'GET /api/personas',
        getById: 'GET /api/personas/:id',
        update: 'PUT /api/personas/:id',
        delete: 'DELETE /api/personas/:id',
        // Búsqueda y filtros
        search: 'GET /api/personas/search?term=',
        stats: 'GET /api/personas/stats',
        byRole: 'GET /api/personas/role/:role'
      },
      rolesEndpoints: {
        create: 'POST /api/roles',
        getAll: 'GET /api/roles',
        getById: 'GET /api/roles/:id',
        update: 'PUT /api/roles/:id',
        delete: 'DELETE /api/roles/:id',
        stats: 'GET /api/roles/stats'
      }
    }
  });
});

// Rutas de personas (incluye autenticación y CRUD)
router.use('/personas', personaRoutes);

// Rutas de roles
router.use('/roles', roleRoutes);

export default router;