import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { testConnection, initializeTables } from './config/database';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import routes from './routes';

// Cargar variables de entorno
dotenv.config();

// Crear aplicación Express
const app = express();
const PORT = process.env.PORT || 3000;

/**
 * Configuración de middlewares de seguridad
 */
// Helmet para headers de seguridad
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS
const corsOptions = {
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-requested-with'],
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutos
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // máximo 100 requests por ventana
  message: {
    success: false,
    message: 'Demasiadas peticiones desde esta IP, inténtalo de nuevo más tarde',
    error: 'Rate limit exceeded'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    res.status(429).json({
      success: false,
      message: 'Demasiadas peticiones desde esta IP, inténtalo de nuevo más tarde',
      error: 'Rate limit exceeded'
    });
  }
});
app.use('/api', limiter);

/**
 * Configuración de middlewares de parsing
 */
app.use(express.json({ 
  limit: '10mb',
  type: 'application/json'
}));
app.use(express.urlencoded({ 
  extended: true, 
  limit: '10mb'
}));

/**
 * Middleware de logging básico
 */
app.use((req, _res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl} - IP: ${req.ip}`);
  next();
});

/**
 * Rutas principales
 */
app.use('/api', routes);

// Ruta raíz
app.get('/', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'API de Gestión de Personas - Servidor funcionando',
    data: {
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      apiUrl: '/api',
      healthCheck: '/api/health'
    }
  });
});

/**
 * Middlewares de manejo de errores (deben ir al final)
 */
app.use(notFoundHandler);
app.use(errorHandler);

/**
 * Función para iniciar el servidor
 */
const startServer = async (): Promise<void> => {
  try {
    console.log('🚀 Iniciando servidor...');
    
    // Probar conexión a la base de datos
    await testConnection();
    
    // Inicializar tablas
    await initializeTables();
    
    // Iniciar servidor
    app.listen(PORT, () => {
      console.log('🎉 Servidor iniciado exitosamente');
      console.log(`📡 Servidor ejecutándose en puerto ${PORT}`);
      console.log(`🌐 URL: http://localhost:${PORT}`);
      console.log(`🔍 API Base URL: http://localhost:${PORT}/api`);
      console.log(`💚 Health Check: http://localhost:${PORT}/api/health`);
      console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log('─'.repeat(50));
    });
    
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

/**
 * Manejo de errores no capturados
 */
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Iniciar servidor
startServer();

export default app;