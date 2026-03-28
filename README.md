# Nima Platform - PaginaNima

<p align="center">
     Plataforma web de acompañamiento, recursos y directorio para mujeres en situación de violencia.
</p>

<p align="center">
     <img alt="React" src="https://img.shields.io/badge/Frontend-React%2018-20232A?logo=react" />
     <img alt="Vite" src="https://img.shields.io/badge/Bundler-Vite-646CFF?logo=vite" />
     <img alt="Node" src="https://img.shields.io/badge/Backend-Node.js-339933?logo=node.js&logoColor=white" />
     <img alt="Express" src="https://img.shields.io/badge/API-Express-000000?logo=express" />
     <img alt="MongoDB" src="https://img.shields.io/badge/DB-MongoDB-47A248?logo=mongodb&logoColor=white" />
</p>

## Resumen

Este repositorio contiene la app web principal de Nima y se compone de dos módulos:

- `frontend/`: interfaz React + Vite (rutas, vistas, chat UI, mapa, recursos).
- `backend/`: API Node/Express (directorios, FAQs, testimonios, centros).

El frontend consume dos servicios:

- API propia (`backend`).
- chatbot Rasa en el repo hermano `ChatBotPt`.

## Arquitectura

```text
[ Browser ]
          |
          +--> Frontend (React/Vite)
                              |
                              +--> Backend API (Express) ---> MongoDB
                              |
                              +--> Rasa Webhook (ChatBotPt)
```

## Estructura del proyecto

```text
PaginaNima/
     backend/
          src/
               controllers/
               models/
               routes/
     frontend/
          src/
               components/
               pages/
               services/
```

## Quickstart local

## 1) Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

Variables mínimas en `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/nima_db
FRONTEND_URL=http://localhost:5173
```

## 2) Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Variables mínimas en `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000
VITE_RASA_URL=http://localhost:5005/webhooks/rest/webhook
```

## 3) Chatbot (repo paralelo)

Levanta `ChatBotPt` en paralelo para que el chat funcione.

## Endpoints clave

- Health API: `GET /api/health`
- Centros: `GET /api/centros`
- FAQs: `GET /api/faqs`
- Testimonios: `GET /api/testimonios`
- Directorios: `GET /api/directorios`

## Scripts útiles

## Backend

- `npm run dev`: desarrollo con nodemon.
- `npm start`: ejecución estándar.

## Frontend

- `npm run dev`: servidor local de Vite.
- `npm run build`: build de producción.
- `npm run preview`: vista previa del build.

## Nota crítica (falla detectada)

Se detectó un problema donde el frontend seguía apuntando a un backend remoto por falta de variable de entorno.

Causa:

- faltaba `VITE_API_URL` y se tomaba un fallback no deseado.

Prevención:

1. Definir `VITE_API_URL` explícitamente en todos los entornos.
2. Verificar en consola del navegador el log `API_URL usada: ...`.
3. Mantener `.env` de local y producción claramente separados.

## Producción

Guía completa de deploy en:

- `README_DEPLOY_PRODUCCION.md`

## Estado de producción recomendado

- Frontend desplegado en Vercel.
- Backend desplegado en Render/Railway/Fly.
- `VITE_API_URL`, `VITE_RASA_URL`, `MONGO_URI`, `FRONTEND_URL` configurados por entorno.
- Smoke test validado: health + endpoints + flujo de chat.

## Solución de problemas rápida

1. El frontend no carga datos:
- revisar `VITE_API_URL`.
- confirmar que `/api/health` responde 200.

2. Error CORS:
- revisar `FRONTEND_URL` del backend.

3. Chat sin respuesta:
- validar que `VITE_RASA_URL` apunte al webhook correcto.
- validar que `ChatBotPt` esté arriba.
