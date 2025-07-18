# API de Gestión de Personas

API RESTful desarrollada con Node.js, TypeScript y MySQL que permite gestionar personas con un sistema CRUD completo. Implementa un patrón MVC limpio y modular.

## 🚀 Características

- **CRUD completo de personas** (Crear, Leer, Actualizar, Eliminar)
- **Arquitectura MVC** bien estructurada
- **Validación de datos** con Joi
- **Seguridad** con Helmet, CORS y Rate Limiting
- **Base de datos MySQL** con pool de conexiones
- **TypeScript** para tipado fuerte
- **Manejo de errores** centralizado
- **Paginación y búsqueda** de personas

## 📋 Requisitos Previos

- Node.js >= 16.0.0
- MySQL >= 8.0
- npm o yarn

## 🛠️ Instalación

1. **Clonar el repositorio**
```bash
git clone <tu-repositorio>
cd personas-api
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
```

Edita el archivo `.env` con tus datos:
```env
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=tu_usuario_mysql
DB_PASSWORD=tu_password_mysql
DB_NAME=personas_db
```

4. **Configurar base de datos**

Ejecuta el script SQL de inicialización:
```bash
mysql -u tu_usuario -p < database/init.sql
```

O ejecuta manualmente en MySQL:
```sql
CREATE DATABASE personas_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

5. **Compilar TypeScript**
```bash
npm run build
```

6. **Iniciar servidor**

Desarrollo:
```bash
npm run dev
```

Producción:
```bash
npm start
```

## 📚 Endpoints de la API

### Personas

| Método | Endpoint | Descripción | Acceso |
|--------|----------|-------------|--------|
| POST | `/api/personas` | Crear persona | Público |
| GET | `/api/personas` | Listar personas | Público |
| GET | `/api/personas/:id` | Obtener persona | Público |
| PUT | `/api/personas/:id` | Actualizar persona | Público |
| DELETE | `/api/personas/:id` | Eliminar persona | Público |
| GET | `/api/personas/search?term=` | Buscar personas | Público |
| GET | `/api/personas/stats` | Estadísticas | Público |

### Utilidad

| Método | Endpoint | Descripción | Acceso |
|--------|----------|-------------|--------|
| GET | `/api/health` | Health check | Público |
| GET | `/api` | Info de la API | Público |

## 📝 Ejemplos de Uso

### Crear Persona
```bash
curl -X POST http://localhost:3000/api/personas \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan",
    "apellido": "Pérez",
    "email": "juan@ejemplo.com",
    "telefono": "+57 300 123 4567",
    "fecha_nacimiento": "1990-05-15",
    "direccion": "Calle 123 #45-67"
  }'
```

### Listar Personas con Paginación
```bash
curl -X GET "http://localhost:3000/api/personas?page=1&limit=10"
```

### Buscar Personas
```bash
curl -X GET "http://localhost:3000/api/personas/search?term=Juan"
```

### Obtener Persona por ID
```bash
curl -X GET http://localhost:3000/api/personas/1
```

### Actualizar Persona
```bash
curl -X PUT http://localhost:3000/api/personas/1 \
  -H "Content-Type: application/json" \
  -d '{
    "telefono": "+57 300 999 8888"
  }'
```

### Eliminar Persona
```bash
curl -X DELETE http://localhost:3000/api/personas/1
```

## 🏗️ Estructura del Proyecto

```
src/
├── config/
│   └── database.ts          # Configuración de MySQL
├── controllers/
│   └── personaController.ts # Controlador de personas
├── middleware/
│   ├── validation.ts       # Middleware de validación
│   └── errorHandler.ts     # Middleware de errores
├── models/
│   └── Persona.ts          # Modelo de persona
├── routes/
│   ├── personaRoutes.ts    # Rutas de personas
│   └── index.ts            # Rutas principales
├── types/
│   └── index.ts            # Interfaces y tipos
├── utils/
│   └── validations.ts      # Esquemas de validación
└── index.ts                # Archivo principal
```

## 🔧 Scripts Disponibles

```bash
npm start          # Ejecutar en producción
npm run dev        # Ejecutar en desarrollo
npm run build      # Compilar TypeScript
npm run build:watch # Compilar en modo watch
npm run clean      # Limpiar carpeta dist
```

## 🛡️ Seguridad

- **Helmet** para headers de seguridad
- **CORS** configurado
- **Rate Limiting** para prevenir ataques
- **Validación** de datos de entrada
- **Sanitización** automática

## 📊 Características Avanzadas

- **Paginación** automática en listados
- **Búsqueda** por nombre y apellido
- **Estadísticas** de personas
- **Validación** robusta con mensajes personalizados
- **Manejo de errores** centralizado
- **Logging** de requests
- **Health checks**

## 🚦 Estados de Respuesta

La API siempre responde con el siguiente formato:

```json
{
  "success": boolean,
  "message": string,
  "data": any,
  "error": string (opcional)
}
```

## 🔍 Variables de Entorno

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| `NODE_ENV` | Entorno de ejecución | development |
| `PORT` | Puerto del servidor | 3000 |
| `DB_HOST` | Host de MySQL | localhost |
| `DB_PORT` | Puerto de MySQL | 3306 |
| `DB_USER` | Usuario de MySQL | root |
| `DB_PASSWORD` | Contraseña de MySQL | - |
| `DB_NAME` | Nombre de la base de datos | personas_db |

## 📋 Estructura de Datos

### Persona
```json
{
  "id": 1,
  "nombre": "Juan",
  "apellido": "Pérez",
  "email": "juan@ejemplo.com",
  "telefono": "+57 300 123 4567",
  "fecha_nacimiento": "1990-05-15",
  "direccion": "Calle 123 #45-67",
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z"
}
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo `LICENSE` para más detalles.

## 👥 Autor

Desarrollado con ❤️ por [Tu Nombre]

---

**¿Necesitas ayuda?** Abre un issue en el repositorio o contacta al equipo de desarrollo.

# 🧪 Guía Completa de Testing - API de Personas

## 🔗 **Base URL**
- **Local**: `http://localhost:3000`
- **API Base**: `http://localhost:3000/api`

---

## 📋 **1. ENDPOINTS DE UTILIDAD**

### 🟢 **Health Check**
**GET** `/api/health`

**cURL:**
```bash
curl http://localhost:3000/api/health
```

**Postman:**
- **Método**: GET
- **URL**: `http://localhost:3000/api/health`

**Respuesta esperada:**
```json
{
  "success": true,
  "message": "API funcionando correctamente",
  "data": {
    "status": "OK",
    "timestamp": "2024-01-01T12:00:00.000Z",
    "version": "1.0.0",
    "environment": "development"
  }
}
```

---

### 🟢 **Información de la API**
**GET** `/api`

**cURL:**
```bash
curl http://localhost:3000/api
```

**Postman:**
- **Método**: GET
- **URL**: `http://localhost:3000/api`

---

## 👥 **2. CRUD DE PERSONAS**

### 🟡 **Crear Persona**
**POST** `/api/personas`

**cURL:**
```bash
curl -X POST http://localhost:3000/api/personas \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan",
    "apellido": "Pérez",
    "email": "juan.perez@email.com",
    "telefono": "+57 300 123 4567",
    "fecha_nacimiento": "1990-05-15",
    "direccion": "Calle 123 #45-67, Bogotá"
  }'
```

**Postman:**
- **Método**: POST
- **URL**: `http://localhost:3000/api/personas`
- **Headers**: 
  - `Content-Type: application/json`
- **Body (raw, JSON)**:
```json
{
  "nombre": "Juan",
  "apellido": "Pérez",
  "email": "juan.perez@email.com",
  "telefono": "+57 300 123 4567",
  "fecha_nacimiento": "1990-05-15",
  "direccion": "Calle 123 #45-67, Bogotá"
}
```

**JSON Mínimo (solo campos requeridos):**
```json
{
  "nombre": "Ana",
  "apellido": "García",
  "email": "ana.garcia@email.com"
}
```

---

### 🟢 **Listar Personas (con paginación)**
**GET** `/api/personas`

**cURL:**
```bash
# Listar todas (página 1, 10 por página)
curl http://localhost:3000/api/personas

# Con parámetros de paginación
curl "http://localhost:3000/api/personas?page=1&limit=5"

# Con búsqueda
curl "http://localhost:3000/api/personas?search=Juan"
```

**Postman:**
- **Método**: GET
- **URL**: `http://localhost:3000/api/personas`
- **Query Params** (opcionales):
  - `page`: 1
  - `limit`: 10