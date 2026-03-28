# PaginaNima - Deploy a Produccion (Vercel)

Guia para desplegar **frontend y backend en Vercel**, conectados a:

- MongoDB Atlas
- Chatbot en Render (repo `ChatBotPt`)

## 1) Objetivo

Publicar:

1. `frontend/` en Vercel
2. `backend/` en Vercel
3. Conectar ambos con la URL publica del chatbot (Render)

## 2) Arquitectura final

```text
Frontend (Vercel) ---> Backend API (Vercel) ---> MongoDB Atlas
     |
     +-------> Chatbot Rasa (Render)
```

## 3) Variables de entorno criticas

## 3.1 Frontend (`frontend` en Vercel)

```env
VITE_API_URL=https://<tu-backend-vercel>.vercel.app
VITE_RASA_URL=https://<tu-chatbot-render>.onrender.com/webhooks/rest/webhook
```

Importante:

- `VITE_API_URL` es obligatoria.
- Si falta, el frontend puede usar fallback no deseado.
- Verifica en consola del navegador: `API_URL usada: ...`.

## 3.2 Backend (`backend` en Vercel)

```env
MONGO_URI=<mongo_uri_prod>
FRONTEND_URL=https://<tu-frontend-vercel>.vercel.app
```

Notas:

- En Vercel no necesitas fijar `PORT` manualmente.
- `FRONTEND_URL` debe coincidir con el dominio final del frontend (CORS).

## 4) Deploy del frontend en Vercel

1. Crea un proyecto nuevo en Vercel.
2. Selecciona el repo `PaginaNima`.
3. Configura **Root Directory**: `frontend`.
4. Framework: `Vite`.
5. Agrega env vars:
  - `VITE_API_URL`
  - `VITE_RASA_URL`
6. Deploy.

## 5) Deploy del backend en Vercel

Este repo ya incluye `backend/vercel.json` para Node serverless.

1. Crea otro proyecto en Vercel (mismo repo).
2. Configura **Root Directory**: `backend`.
3. Agrega env vars:
  - `MONGO_URI`
  - `FRONTEND_URL`
4. Deploy.

Verifica:

```bash
GET https://<tu-backend-vercel>.vercel.app/api/health
```

Esperado:

```json
{"message":"NIMA Backend is running!"}
```

## 6) Integracion con chatbot en Render

Cuando tengas la URL publica de Render (servicio Rasa), coloca en frontend:

```env
VITE_RASA_URL=https://<tu-chatbot-render>.onrender.com/webhooks/rest/webhook
```

Luego redeploy del frontend.

## 7) Smoke tests post deploy

1. Frontend carga y no muestra errores CORS.
2. `GET /api/health` responde 200.
3. Endpoints `/api/centros`, `/api/faqs`, `/api/testimonios`, `/api/directorios` responden.
4. En chat:
  - `me pega`
  - `hola`
  - `estoy en peligro`

Esperado: respuestas especificas, no solo fallback.

## 8) Falla importante detectada y prevencion

Problema real observado:

- El frontend mostraba `API_URL usada: https://paginanima.onrender.com` incluso en otro entorno.

Causa:

- faltaba `VITE_API_URL`.

Prevencion:

1. Definir `VITE_API_URL` en todos los entornos de Vercel.
2. Verificar el valor activo en consola del navegador tras cada deploy.
3. Mantener variables de `Preview` y `Production` separadas.

## 9) Checklist rapido

1. Frontend con `VITE_API_URL` y `VITE_RASA_URL` correctos.
2. Backend con `MONGO_URI` y `FRONTEND_URL` correctos.
3. Healthcheck OK en backend.
4. CORS OK.
5. Flujo de chat OK con chatbot Render.
