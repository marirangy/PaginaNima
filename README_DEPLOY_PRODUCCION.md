# PaginaNima - Deploy a Produccion

Guia de despliegue para frontend (Vite/React) y backend (Node/Express).

## 1) Objetivo

Desplegar en produccion:
- Frontend `PaginaNima/frontend`
- Backend `PaginaNima/backend`

Con configuracion correcta de URLs para evitar consumo accidental de servicios equivocados.

## 2) Arquitectura recomendada

- Frontend: Vercel (o Netlify)
- Backend API: Render / Railway / Fly
- Base de datos: MongoDB Atlas
- Chatbot (externo a este repo): URL publica del webhook de Rasa

## 3) Variables de entorno criticas

## 3.1 Frontend (`frontend/.env`)

```env
VITE_API_URL=https://TU_BACKEND_EN_PROD
VITE_RASA_URL=https://TU_CHATBOT_EN_PROD/webhooks/rest/webhook
```

Importante:
- `VITE_API_URL` es obligatoria.
- Falla detectada: cuando esta variable faltaba, el frontend podia usar fallback no deseado.
- Verificar en consola del navegador el log: `API_URL usada: ...`.

## 3.2 Backend (`backend/.env`)

```env
PORT=5000
MONGO_URI=<mongo_uri_prod>
FRONTEND_URL=https://TU_FRONTEND_EN_PROD
```

Importante:
- `FRONTEND_URL` debe coincidir con el dominio del frontend para CORS.

## 4) Deploy del Backend

Desde `backend`:

```bash
npm install
npm start
```

En plataforma (Render/Railway/Fly):
- Build command: `npm install`
- Start command: `npm start`
- Variables: `PORT`, `MONGO_URI`, `FRONTEND_URL`

Healthcheck recomendado:

```bash
GET /api/health
```

Esperado:

```json
{"message":"NIMA Backend is running!"}
```

## 5) Deploy del Frontend

Desde `frontend`:

```bash
npm install
npm run build
```

En Vercel:
- Framework: Vite
- Root: `frontend`
- Variables:
  - `VITE_API_URL`
  - `VITE_RASA_URL`

## 6) Smoke tests post-deploy

## 6.1 Verificar API URL activa

Abrir app en navegador y confirmar en consola:
- `API_URL usada: https://TU_BACKEND_EN_PROD`

No debe aparecer URL vieja o de otro entorno.

## 6.2 Verificar backend

- `/api/health` responde 200
- endpoints de datos (`/api/centros`, `/api/faqs`, etc.) responden 200

## 6.3 Verificar chatbot desde frontend

Desde pantalla de chat:
1. `me pega`
2. `hola`
3. `estoy en peligro`

Esperado:
- respuestas especificas (no solo fallback generico)

## 7) Falla importante detectada y prevencion

Problema real observado:
- El frontend mostraba `API_URL usada: https://paginanima.onrender.com` aun en pruebas locales.

Causa:
- faltaba `VITE_API_URL` en `.env` del frontend.

Prevencion:
1. Definir `VITE_API_URL` en todos los entornos (local, preview, prod).
2. Confirmar valor real en consola al iniciar app.
3. Mantener separacion clara de variables por entorno.

## 8) Checklist rapido

1. Frontend tiene `VITE_API_URL` y `VITE_RASA_URL` correctos.
2. Backend tiene `MONGO_URI` y `FRONTEND_URL` correctos.
3. CORS permite dominio final del frontend.
4. `/api/health` responde OK.
5. Chat responde casos criticos desde la UI.

## 9) Comandos utiles

```bash
# frontend
cd frontend
npm run dev
npm run build

# backend
cd backend
npm run dev
npm start
```
