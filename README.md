# 👥 API de Gestión de Personas con Roles

![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)
![MySQL](https://img.shields.io/badge/MySQL-8.0+-orange.svg)
![Express](https://img.shields.io/badge/Express-4.18+-lightgrey.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

API RESTful desarrollada con **Node.js**, **TypeScript** y **MySQL** que permite gestionar personas con **autenticación básica** y **sistema de roles**. Implementa un patrón **MVC** limpio y modular, usando una sola tabla `personas` para CRUD y login, más una tabla `roles` para gestión de permisos.

## 🚀 Características

- ✅ **CRUD completo de personas** (Crear, Leer, Actualizar, Eliminar)
- ✅ **Autenticación básica** integrada (registro, login, verificación)
- ✅ **Sistema de roles** (admin, cliente, empleado, etc.)
- ✅ **Arquitectura MVC** bien estructurada y escalable
- ✅ **TypeScript** para tipado fuerte y mejor desarrollo
- ✅ **Validación robusta** con Joi
- ✅ **Base de datos MySQL** con pool de conexiones
- ✅ **Búsqueda y filtrado** de personas por nombre, apellido y rol
- ✅ **Estadísticas** y reportes por roles
- ✅ **Manejo de errores** centralizado
- ✅ **Seguridad** con Helmet, CORS y Rate Limiting
- ✅ **Logs** de requests y errores
- ✅ **Documentación completa** de endpoints

## 🛠️ Tecnologías Utilizadas

### **Backend Core**
- **[Node.js](https://nodejs.org/)** - Runtime de JavaScript
- **[TypeScript](https://www.typescriptlang.org/)** - Superset tipado de JavaScript
- **[Express.js](https://expressjs.com/)** - Framework web minimalista

### **Base de Datos**
- **[MySQL](https://www.mysql.com/)** - Sistema de gestión de base de datos
- **[mysql2](https://github.com/sidorares/node-mysql2)** - Driver MySQL moderno con soporte para Promises

### **Validación y Seguridad**
- **[Joi](https://joi.dev/)** - Validación de esquemas de datos
- **[Helmet](https://helmetjs.github.io/)** - Headers de seguridad HTTP
- **[CORS](https://github.com/expressjs/cors)** - Cross-Origin Resource Sharing
- **[express-rate-limit](https://github.com/express-rate-limit/express-rate-limit)** - Rate limiting

### **Desarrollo**
- **[nodemon](https://nodemon.io/)** - Auto-restart en desarrollo
- **[ts-node](https://typestrong.org/ts-node/)** - Ejecutor de TypeScript
- **[dotenv](https://github.com/motdotla/dotenv)** - Variables de entorno

## 📂 Estructura del Proyecto

```
src/
├── config/
│   └── database.ts          # Configuración de MySQL y pool de conexiones
├── controllers/
│   ├── personaController.ts # Lógica de negocio para personas + autenticación
│   └── roleController.ts    # Lógica de negocio para roles
├── middleware/
│   ├── validation.ts        # Middleware de validación con Joi
│   └── errorHandler.ts      # Manejo centralizado de errores
├── models/
│   ├── Persona.ts           # Modelo de datos para personas (CRUD + Auth)
│   └── Role.ts              # Modelo de datos para roles
├── routes/
│   ├── personaRoutes.ts     # Rutas para personas y autenticación
│   ├── roleRoutes.ts        # Rutas para gestión de roles
│   └── index.ts             # Rutas principales de la API
├── types/
│   └── index.ts             # Interfaces y tipos TypeScript
├── utils/
│   └── validations.ts       # Esquemas de validación Joi
└── index.ts                 # Punto de entrada de la aplicación
```

## 🗄️ Estructura de Base de Datos

### **Tabla: `roles`**
```sql
CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### **Tabla: `personas` (CRUD + Autenticación)**
```sql
CREATE TABLE personas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL,
    contraseña VARCHAR(255) NOT NULL,
    rol_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (rol_id) REFERENCES roles(id)
);
```

## 📄 Script SQL de Inicialización

El archivo `database/init.sql` contiene:

### **🏗️ Estructura Completa**
- ✅ Creación de base de datos `personas_db`
- ✅ Creación de tablas `roles` y `personas`
- ✅ Índices optimizados para consultas
- ✅ Foreign keys para integridad referencial
- ✅ Triggers para timestamps automáticos

### **📊 Datos de Ejemplo**
- ✅ 3 roles por defecto: admin, cliente, empleado
- ✅ 6 personas de ejemplo con diferentes roles
- ✅ Credenciales de prueba para testing

### **🔧 Funcionalidades Avanzadas**
- ✅ Procedimientos almacenados para estadísticas
- ✅ Vistas optimizadas para consultas frecuentes
- ✅ Funciones para búsquedas y conteos
- ✅ Triggers para prevenir eliminación de roles con usuarios

### **🎯 Cómo Usar el Script**

#### **Ejecutar Script Completo**
```bash
# Desde terminal (Linux/Mac/WSL)
mysql -u root -p < database/init.sql

# Desde Windows (CMD)
mysql -u root -p < database\init.sql

# Especificando host y puerto
mysql -h localhost -P 3306 -u root -p < database/init.sql
```

#### **Ejecutar por Secciones**
```sql
-- 1. Solo crear estructura (sin datos)
-- Ejecutar hasta la línea de "Insertar roles por defecto"

-- 2. Solo datos de ejemplo
-- Ejecutar desde "INSERT INTO roles..." hasta el final

-- 3. Solo funciones avanzadas
-- Ejecutar desde "DELIMITER //" hasta el final
```

#### **Resetear Base de Datos**
```sql
-- ⚠️ CUIDADO: Esto eliminará todos los datos
DROP DATABASE IF EXISTS personas_db;

-- Luego ejecutar el script nuevamente
mysql -u root -p < database/init.sql
```

### **🚀 Inicio Rápido con Script SQL**

Para comenzar inmediatamente con datos de prueba:

```bash
# 1. Clonar y configurar
git clone https://github.com/sarce22/BackendPersonas.git
cd BackendPersonas
npm install

# 2. Configurar .env (usar tus credenciales MySQL)
cp .env.example .env

# 3. Ejecutar script SQL (incluye estructura + datos)
mysql -u root -p < database/init.sql

# 4. Iniciar servidor
npm run dev

# 5. Probar login inmediatamente
curl -X POST http://localhost:3000/api/personas/login \
  -H "Content-Type: application/json" \
  -d '{"correo":"admin@test.com","contraseña":"admin123"}'
```

**✅ En menos de 5 minutos tendrás una API completa funcionando con:**
- 3 roles: admin, cliente, empleado
- 6 usuarios de ejemplo listos para login
- Todas las tablas, índices y relaciones configuradas
- Procedimientos y funciones SQL avanzadas

## 🚀 Instalación y Configuración

### **Prerequisitos**
- Node.js >= 16.0.0
- MySQL >= 8.0
- npm o yarn

### **1. Clonar el repositorio**
```bash
git clone https://github.com/sarce22/BackendPersonas.git
cd BackendPersonas
```

### **2. Instalar dependencias**
```bash
npm install
```

### **3. Configurar variables de entorno**
```bash
# Crear archivo de configuración
cp .env.example .env
```

Editar `.env` con tus datos:
```env
NODE_ENV=development
PORT=3000

# Configuración de MySQL
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_password_mysql
DB_NAME=personas_db

# Configuración de CORS (opcional)
CORS_ORIGIN=http://localhost:3000,http://localhost:3001

# Rate limiting (opcional)
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

#### **Verificar instalación de base de datos**
```sql
-- Conectar a la base de datos
mysql -u root -p personas_db

-- Verificar tablas
SHOW TABLES;
-- Debería mostrar: personas, roles

-- Verificar datos de ejemplo
SELECT COUNT(*) FROM roles;    -- Debería mostrar: 3
SELECT COUNT(*) FROM personas; -- Debería mostrar: 6

-- Ver roles disponibles
SELECT * FROM roles;

-- Ver personas con roles
SELECT p.nombre, p.apellido, p.correo, r.nombre AS rol 
FROM personas p 
JOIN roles r ON p.rol_id = r.id;
```

### **5. Ejecutar en desarrollo**
```bash
npm run dev
```

### **6. ¡Probar que funciona!**

Una vez que el servidor esté ejecutándose, puedes probar inmediatamente:

#### **Health Check**
```bash
curl http://localhost:3000/api/health
```

#### **Login con usuario de ejemplo**
```bash
curl -X POST http://localhost:3000/api/personas/login \
  -H "Content-Type: application/json" \
  -d '{
    "correo": "admin@test.com",
    "contraseña": "admin123"
  }'
```

#### **Ver todas las personas**
```bash
curl http://localhost:3000/api/personas
```

#### **Ver todos los roles**
```bash
curl http://localhost:3000/api/roles
```

Si estas llamadas funcionan correctamente, ¡tu API está lista para usar! 🎉

### **7. Build para producción**
```bash
npm run build
npm start
```

## 📡 Endpoints de la API

### **Base URL**: `http://localhost:3000/api`

### **🟢 Endpoints de Utilidad**

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/health` | Health check de la API |
| `GET` | `/` | Información general de la API |

### **🔐 Endpoints de Autenticación**

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/personas/register` | Registrar nueva persona/usuario |
| `POST` | `/personas/login` | Iniciar sesión |
| `POST` | `/personas/verify` | Verificar credenciales |
| `GET` | `/personas/users` | Listar usuarios registrados |

### **👥 Endpoints de Personas (CRUD)**

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/personas` | Crear una nueva persona |
| `GET` | `/personas` | Obtener todas las personas |
| `GET` | `/personas/:id` | Obtener persona por ID |
| `PUT` | `/personas/:id` | Actualizar persona |
| `DELETE` | `/personas/:id` | Eliminar persona |
| `GET` | `/personas/search?term=` | Buscar personas |
| `GET` | `/personas/stats` | Estadísticas de personas |
| `GET` | `/personas/role/:role` | Obtener personas por rol |

### **🛡️ Endpoints de Roles**

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/roles` | Crear un nuevo rol |
| `GET` | `/roles` | Obtener todos los roles |
| `GET` | `/roles/:id` | Obtener rol por ID |
| `PUT` | `/roles/:id` | Actualizar rol |
| `DELETE` | `/roles/:id` | Eliminar rol |
| `GET` | `/roles/stats` | Estadísticas de roles |

## 📝 Ejemplos de Uso

### **Health Check**
```bash
curl http://localhost:3000/api/health
```

### **Registrar Nueva Persona**
```bash
curl -X POST http://localhost:3000/api/personas/register \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan",
    "apellido": "Pérez",
    "correo": "juan.perez@email.com",
    "contraseña": "123456",
    "rol_id": 2
  }'
```

### **Iniciar Sesión**
```bash
curl -X POST http://localhost:3000/api/personas/login \
  -H "Content-Type: application/json" \
  -d '{
    "correo": "juan.perez@email.com",
    "contraseña": "123456"
  }'
```

### **Crear Rol**
```bash
curl -X POST http://localhost:3000/api/roles \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "supervisor"
  }'
```

### **Listar Personas**
```bash
curl http://localhost:3000/api/personas
```

### **Buscar Personas**
```bash
curl "http://localhost:3000/api/personas/search?term=Juan"
```

### **Obtener Personas por Rol**
```bash
curl http://localhost:3000/api/personas/role/admin
```

### **Actualizar Persona**
```bash
curl -X PUT http://localhost:3000/api/personas/1 \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan Carlos",
    "rol_id": 3
  }'
```

### **Eliminar Persona**
```bash
curl -X DELETE http://localhost:3000/api/personas/1
```

### **Ejemplo de Respuesta de Login**
```json
{
  "success": true,
  "message": "Inicio de sesión exitoso",
  "data": {
    "message": "Login exitoso",
    "user": {
      "id": 1,
      "correo": "admin@test.com",
      "nombre": "Admin",
      "apellido": "Sistema",
      "rol": "admin"
    }
  }
}
```

### **Ejemplo de Respuesta de Personas**
```json
{
  "success": true,
  "message": "Personas obtenidas exitosamente",
  "data": {
    "personas": [
      {
        "id": 1,
        "nombre": "Admin",
        "apellido": "Sistema",
        "correo": "admin@test.com",
        "rol_id": 1,
        "created_at": "2024-01-15T10:00:00.000Z",
        "updated_at": "2024-01-15T10:00:00.000Z",
        "rol_nombre": "admin"
      }
    ],
    "total": 1,
    "totalPages": 1,
    "currentPage": 1,
    "hasNext": false,
    "hasPrev": false
  }
}
```


## ⚙️ Variables de Entorno

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| `NODE_ENV` | Entorno de ejecución | `development` |
| `PORT` | Puerto del servidor | `3000` |
| `DB_HOST` | Host de MySQL | `localhost` |
| `DB_PORT` | Puerto de MySQL | `3306` |
| `DB_USER` | Usuario de MySQL | `root` |
| `DB_PASSWORD` | Contraseña de MySQL | - |
| `DB_NAME` | Nombre de la base de datos | `personas_db` |
| `CORS_ORIGIN` | Orígenes permitidos para CORS | - |
| `RATE_LIMIT_WINDOW_MS` | Ventana de rate limiting (ms) | `900000` |
| `RATE_LIMIT_MAX_REQUESTS` | Máximo requests por ventana | `100` |

## 🛡️ Características de Seguridad

- **Helmet** - Headers de seguridad HTTP
- **CORS** - Control de orígenes cruzados
- **Rate Limiting** - Protección contra ataques DDoS
- **Validación de entrada** - Sanitización de datos con Joi
- **Manejo de errores** - Sin exposición de información sensible
- **Integridad referencial** - Foreign keys en base de datos

## 📈 Funcionalidades del Sistema

### **Autenticación Básica**
- Registro de nuevas personas con rol asignado
- Login con correo y contraseña (texto plano)
- Verificación de credenciales
- No usa JWT (sistema básico)

### **Gestión de Roles**
- Crear, leer, actualizar y eliminar roles
- Roles por defecto: admin, cliente, empleado
- Asignación de roles a personas
- Estadísticas por rol

### **Búsqueda Inteligente**
- Búsqueda por nombre o apellido
- Filtrado por rol específico
- Coincidencias parciales
- Resultados ordenados por relevancia

### **Estadísticas Avanzadas**
- Total de personas por rol
- Distribución porcentual de roles
- Personas registradas por periodo
- Resumen ejecutivo del sistema

### **Logging y Monitoreo**
- Logs de requests HTTP
- Logs de errores con stack trace
- Timestamps para debugging
- Health check endpoint

## 📋 Datos de Prueba Incluidos

### **Roles por Defecto:**
- `id: 1` - admin
- `id: 2` - cliente
- `id: 3` - empleado

### **Personas de Ejemplo:**
- **Admin:** `admin@test.com` / `admin123` (rol: admin)
- **Juan:** `juan.perez@email.com` / `123456` (rol: cliente)
- **María:** `maria.gonzalez@email.com` / `maria123` (rol: cliente)
- **Carlos:** `carlos.rodriguez@email.com` / `carlos123` (rol: empleado)
- **Ana:** `ana.martinez@email.com` / `ana123` (rol: cliente)
- **Luis:** `luis.garcia@email.com` / `luis123` (rol: empleado)


## 🧪 Testing

### **Health Check**
```bash
curl http://localhost:3000/api/health
```

### **Test de Autenticación**
```bash
# Registrar
curl -X POST http://localhost:3000/api/personas/register \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Test","apellido":"User","correo":"test@test.com","contraseña":"123","rol_id":2}'

# Login
curl -X POST http://localhost:3000/api/personas/login \
  -H "Content-Type: application/json" \
  -d '{"correo":"test@test.com","contraseña":"123"}'
```


### **Convenciones de Código**
- Usar TypeScript para tipado fuerte
- Seguir el patrón MVC
- Documentar funciones públicas
- Manejar errores apropiadamente
- Escribir mensajes de commit descriptivos

## 🔄 Cambios Principales vs Versión Anterior

- ✅ **Tabla unificada:** Una sola tabla `personas` para CRUD y autenticación
- ✅ **Sistema de roles:** Nueva tabla `roles` con relación FK
- ✅ **Endpoints reorganizados:** Autenticación integrada en `/personas/`
- ✅ **Nuevas funcionalidades:** Filtrado por rol, estadísticas avanzadas
- ✅ **Mejor estructura:** Modelos y controladores optimizados
- ✅ **Validaciones mejoradas:** Joi schemas actualizados para roles

## 🐛 Problemas Conocidos

### **Base de Datos**
- **Error de conexión:** Verificar que MySQL esté ejecutándose y las credenciales sean correctas
- **Tablas no creadas:** Ejecutar manualmente el script `database/init.sql`

### **Aplicación**
- La autenticación es básica (contraseñas en texto plano)
- No hay JWT ni sesiones persistentes
- Los logs se almacenan solo en consola
- Falta implementar paginación avanzada




## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 👨‍💻 Autor

**Sebastian** - [GitHub](https://github.com/sarce22)

## 🙏 Agradecimientos

- [Express.js](https://expressjs.com/) por el excelente framework
- [TypeScript](https://www.typescriptlang.org/) por hacer JavaScript más robusto
- [Joi](https://joi.dev/) por la validación elegante
- [mysql2](https://github.com/sidorares/node-mysql2) por el driver MySQL moderno


