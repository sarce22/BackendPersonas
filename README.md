# 👥 API de Gestión de Personas

![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)
![MySQL](https://img.shields.io/badge/MySQL-8.0+-orange.svg)
![Express](https://img.shields.io/badge/Express-4.18+-lightgrey.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

API RESTful desarrollada con **Node.js**, **TypeScript** y **MySQL** que permite gestionar personas con un sistema CRUD completo. Implementa un patrón **MVC** limpio y modular, perfecto para aprender backend development o como base para proyectos más complejos.

## 🚀 Características

- ✅ **CRUD completo de personas** (Crear, Leer, Actualizar, Eliminar)
- ✅ **Arquitectura MVC** bien estructurada y escalable
- ✅ **TypeScript** para tipado fuerte y mejor desarrollo
- ✅ **Validación robusta** con Joi
- ✅ **Base de datos MySQL** con pool de conexiones
- ✅ **Búsqueda y filtrado** de personas
- ✅ **Estadísticas** y reportes
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
│   └── personaController.ts # Lógica de negocio para personas
├── middleware/
│   ├── validation.ts        # Middleware de validación con Joi
│   └── errorHandler.ts      # Manejo centralizado de errores
├── models/
│   └── Persona.ts           # Modelo de datos para personas
├── routes/
│   ├── personaRoutes.ts     # Definición de rutas para personas
│   └── index.ts             # Rutas principales de la API
├── types/
│   └── index.ts             # Interfaces y tipos TypeScript
├── utils/
│   └── validations.ts       # Esquemas de validación Joi
└── index.ts                 # Punto de entrada de la aplicación
```

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

### **4. Configurar base de datos**
```bash
# Crear base de datos
mysql -u root -p -e "CREATE DATABASE personas_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

### **5. Ejecutar en desarrollo**
```bash
npm run dev
```

### **6. Build para producción**
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

### **👥 Endpoints de Personas**

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/personas` | Crear una nueva persona |
| `GET` | `/personas` | Obtener todas las personas |
| `GET` | `/personas/:id` | Obtener persona por ID |
| `PUT` | `/personas/:id` | Actualizar persona |
| `DELETE` | `/personas/:id` | Eliminar persona |
| `GET` | `/personas/search?term=` | Buscar personas |
| `GET` | `/personas/stats` | Estadísticas de personas |

## 📝 Ejemplos de Uso

### **Health Check**
```bash
curl http://localhost:3000/api/health
```

### **Crear Persona**
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

### **Listar Personas**
```bash
curl http://localhost:3000/api/personas
```

### **Buscar Personas**
```bash
curl "http://localhost:3000/api/personas/search?term=Juan"
```

### **Actualizar Persona**
```bash
curl -X PUT http://localhost:3000/api/personas/1 \
  -H "Content-Type: application/json" \
  -d '{
    "telefono": "+57 300 999 8888"
  }'
```

### **Eliminar Persona**
```bash
curl -X DELETE http://localhost:3000/api/personas/1
```

## 📊 Estructura de Datos

### **Persona**
```typescript
interface IPersona {
  id?: number;
  nombre: string;          // Requerido
  apellido: string;        // Requerido
  email: string;           // Requerido, único
  telefono?: string;       // Opcional
  fecha_nacimiento?: Date; // Opcional
  direccion?: string;      // Opcional
  created_at?: Date;       // Auto-generado
  updated_at?: Date;       // Auto-generado
}
```

### **Ejemplo de Respuesta**
```json
{
  "success": true,
  "message": "Persona creada exitosamente",
  "data": {
    "id": 1,
    "nombre": "Juan",
    "apellido": "Pérez",
    "email": "juan.perez@email.com",
    "telefono": "+57 300 123 4567",
    "fecha_nacimiento": "1990-05-15T00:00:00.000Z",
    "direccion": "Calle 123 #45-67, Bogotá",
    "created_at": "2024-01-15T10:30:00.000Z",
    "updated_at": "2024-01-15T10:30:00.000Z"
  }
}
```

## 🔧 Scripts Disponibles

```bash
npm run dev          # Ejecutar en modo desarrollo con hot-reload
npm run build        # Compilar TypeScript a JavaScript
npm start           # Ejecutar versión compilada (producción)
npm run build:watch # Compilar en modo watch
npm run clean       # Limpiar carpeta dist
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

## 📈 Funcionalidades Adicionales

### **Búsqueda Inteligente**
- Búsqueda por nombre o apellido
- Coincidencias parciales
- Resultados ordenados por relevancia

### **Estadísticas**
- Total de personas
- Personas con teléfono
- Personas con dirección
- Personas con fecha de nacimiento
- Porcentaje de perfiles completos

### **Logging**
- Logs de requests HTTP
- Logs de errores con stack trace
- Timestamps para debugging

## 🧪 Testing

### **Health Check**
```bash
curl http://localhost:3000/api/health
```

### **Probar todos los endpoints**
Revisa la [Guía de Testing](docs/TESTING.md) para ejemplos completos de cURL y Postman.

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

### **Convenciones de Código**
- Usar TypeScript para tipado fuerte
- Seguir el patrón MVC
- Documentar funciones públicas
- Manejar errores apropiadamente
- Escribir mensajes de commit descriptivos


## 🐛 Problemas Conocidos

- La paginación está temporalmente deshabilitada debido a problemas con parámetros de MySQL
- Los logs se almacenan solo en consola (sin persistencia)

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 👨‍💻 Autor

**Sebastian** - [GitHub](https://github.com/sarce22)

## 🙏 Agradecimientos

- [Express.js](https://expressjs.com/) por el excelente framework
- [TypeScript](https://www.typescriptlang.org/) por hacer JavaScript más robusto
- [Joi](https://joi.dev/) por la validación elegante
- [mysql2](https://github.com/sidorares/node-mysql2) por el driver MySQL moderno

---

⭐ Si este proyecto te ayudó, dale una estrella en GitHub

📞 ¿Preguntas? Abre un [issue](https://github.com/sarce22/BackendPersonas/issues)