# Nima - Plataforma Múltiple

Este repositorio contiene la plataforma web principal de **Nima** (anteriormente "PaginaNima"). Se divide en dos componentes independientes que deben ejecutarse en paralelo para su correcto funcionamiento:

*   **`/frontend`**: Una aplicación React desarrollada con Vite que proporciona la interfaz de usuario de la plataforma, incluyendo un chat principal en tiempo real conectado al NLU de Rasa.
*   **`/backend`**: Una API desarrollada en Node.js y Express encargada de conectarse a la base de datos (MongoDB Atlas), consultando los centros de atención directos y otros metadatos ajenos al NLP.

## Arquitectura a Grandes Rasgos
```text
[ Usuario / Browser ] 
         |
    ( Chat UI ) ---- (Peticiones Directas) ----> [ Servidor Rasa ] <---> [ Action Server Python ]
         |                                          ^ 
         |                                      Resuelve flujo NLU
    ( Páginas )
         |
    ( API Calls )
         v
[ Backend Express ] <---> [ MongoDB ]
```

## Entorno Local y Documentación
Para correr este proyecto en local, debes configurar las **variables de entorno** (`.env`) en ambas carpetas.
Cada componente (`frontend` y `backend`) tiene su propio archivo `README.md` con las instrucciones específicas para iniciarlo de manera local y desplegarlo. 

> *Nota: También necesitarás encender el servidor inteligente en la carpeta paralela `ChatBotPt`.*
