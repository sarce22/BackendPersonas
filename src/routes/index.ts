import { Router, Request, Response } from 'express';
import { IAPIResponse } from '../types';
import authRoutes from './auth.routes';
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
 * @desc    Información general de la API
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
        auth: '/api/auth',
        personas: '/api/personas',
        roles: '/api/roles',
        health: '/api/health'
      },
      authEndpoints: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        verify: 'POST /api/auth/verify',
        users: 'GET /api/auth/users'
      },
      personasEndpoints: {
        register: 'POST /api/personas/register',
        login: 'POST /api/personas/login',
        verify: 'POST /api/personas/verify',
        users: 'GET /api/personas/users',
        create: 'POST /api/personas',
        getAll: 'GET /api/personas',
        getById: 'GET /api/personas/:id',
        update: 'PUT /api/personas/:id',
        delete: 'DELETE /api/personas/:id',
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

/**
 * @route   /api/auth/*
 * @desc    Rutas de autenticación
 */
router.use('/auth', authRoutes);

/**
 * @route   /api/personas/*
 * @desc    Rutas de gestión de personas
 */
router.use('/personas', personaRoutes);

/**
 * @route   /api/roles/*
 * @desc    Rutas de gestión de roles
 */
router.use('/roles', roleRoutes);

export default router;
