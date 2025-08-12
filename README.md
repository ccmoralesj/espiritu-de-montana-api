# Google + Airtable API (Express + TypeScript)

Backend API para integrar Google Business Profile (Reviews) y Airtable, usando Node.js, Express y TypeScript.

---

##  Características

- Sincronización automática (cron mensual) de reseñas desde Google hacia Airtable  
- Endpoints REST en Express para servir datos limpios al frontend  
- Cache en Redis para optimizar respuestas y reducir llamadas a Airtable  
- Entornos **DEV / PROD** configurables con `.env`  
- Logging con Pino, manejo de CORS seguro, estructura modular y mantenible

---

##  Requisitos

- Node.js v23.11.0 o superior  
- Redis (local o remoto)  
- Cuenta Google Business Admin y proyecto habilitado para Reviews API  
- Base de Airtable con tabla `Reviews`

---

##  Setup paso a paso

1. Cloná este repositorio:

   ```bash
   git clone https://github.com/tu-usuario/tu-repo.git
   cd tu-repo
  ```

2. Instalá dependencias:

   ```bash
   npm install
   ```

3. Copiá el entorno de ejemplo:

   ```bash
   cp .env.example .env
   ```

4. Editá `.env` y completá los valores:

   ```env
   PORT=4000
   CORS_ORIGIN=http://localhost:3000
   REDIS_URL=redis://localhost:6379
   GOOGLE_CLIENT_ID=...
   GOOGLE_CLIENT_SECRET=...
   GOOGLE_REFRESH_TOKEN=...
   ACCOUNT_ID=...
   LOCATION_ID=...
   AIRTABLE_API_KEY=...
   AIRTABLE_BASE_ID=...
   ```

5. Ejecutá el backend en modo desarrollo:

   ```bash
   npm run dev
   ```

   * API disponible en `http://localhost:4000`
   * Health check en `GET /health`
   * Endpoint de reviews en `GET /api/reviews`

---

## Scripts útiles

* `npm run dev` — Inicia servidor con recarga automática (ts-node-dev).
* `npm run build` — Compila TypeScript a JavaScript en `dist/`.
* `npm start` — Ejecuta versión compilada desde `dist/`.
* `npm run lint` — Verifica estilos con ESLint.

---

## Estructura del proyecto

```
src/
├── controllers/
├── routes/
│   └── reviews.route.ts
├── services/
│   ├── airtable.service.ts
│   ├── google.service.ts
│   └── cache.service.ts
├── jobs/
│   └── sync.reviews.ts
└── server.ts
.env.example
tsconfig.json
package.json
README.md
```

---

## Contributing

* Abrí un *issue* para cualquier error o sugerencia.
* Generá un *branch* para cada feature o fix.
* Al mergear, asegurate que pase `npm test`, si lo tenés configurado.

---

## Licencia

MIT – hacé lo que quieras con este código. Todo bajo tu propio riesgo.

---

## Recursos útiles

* Guía de `.env` y seguridad: entorno separado del código ([Dotenv][1])
* Cómo escribir buen README: breve y claro ([FreeCodeCamp][2])

````

---

##  .env.example

```dotenv
# Server config
PORT=4000
CORS_ORIGIN=http://localhost:3000

# Redis (cache)
REDIS_URL=redis://localhost:6379

# Google Business Profile API (OAuth)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REFRESH_TOKEN=your_google_refresh_token
ACCOUNT_ID=your_account_id
LOCATION_ID=your_location_id

# Airtable
AIRTABLE_API_KEY=your_airtable_api_key
AIRTABLE_BASE_ID=your_airtable_base_id
