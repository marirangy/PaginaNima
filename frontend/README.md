# Nima - Frontend (React + Vite)
El cliente web para la plataforma de Nima. Proporciona la interfaz interactiva general con el componente de Chat Inteligente integrado de manera asíncrona.

## Tecnologías Principales
*   React 18
*   Vite
*   Tailwind CSS v3+

## Configuración y Ejecución Local
1. Copia la plantilla de entorno:
   ```bash
   cp .env.example .env
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

## Variables de Entorno (`.env`)
Todas las variables inician con `VITE_` debido al empaquetador Vite:
*   `VITE_API_URL`: Base URL del backend Express para endpoints `/api/*`. En local: `http://localhost:5000`.
*   `VITE_RASA_URL`: La URL del Webhook de Rasa REST API al cual el Chat enviará los mensajes y POST payload. (En local debe usarse el valor: `http://localhost:5005/webhooks/rest/webhook`)
