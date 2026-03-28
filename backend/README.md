# Nima - Backend (Express + MongoDB)
La API de Node.js encargada de administrar la información estructurada de base de datos de la plataforma Nima, como consultas a los centros de atención y módulos paralelos al Chatbot.

## Tecnologías Principales
*   Node.js (16+)
*   Express
*   Mongoose (Motor para MongoDB)
*   dotenv (Manejo de credenciales)

## Configuración y Ejecución Local
1. Copia la plantilla de variables (.env):
   ```bash
   cp .env.example .env
   ```
2. Modifica el string de `MONGO_URI` dentro del nuevo archivo usando tus verdaderas credenciales locales o de Atlas. Este string NUNCA debe subirse a Git.
3. Instala dependencias:
   ```bash
   npm install
   ```
4. Sirve la APP en modo de desarrollo:
   ```bash
   npm run dev
   ```

## Especificación Variables de Entorno (`.env`)
*   `PORT`: Puerto del servidor local (Por defecto 5000).
*   `MONGO_URI`: String de autenticación con MongoDB (Requerido para que la aplicación arranque).
*   `FRONTEND_URL`: URL oficial que el módulo de CORS permitirá.
