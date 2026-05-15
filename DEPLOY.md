# Despliegue

Esta app puede desplegarse como un solo servicio Node:

1. Instalar dependencias del frontend y backend.
2. Compilar el frontend con `npm run build`.
3. Iniciar el backend con `npm start`.

Comandos recomendados para Render o Railway:

```bash
npm install && npm --prefix backend install && npm run build
```

Start command:

```bash
npm start
```

Variables de entorno necesarias en el hosting:

```bash
DB_HOST=...
DB_USER=...
DB_PASSWORD=...
DB_NAME=...
NODE_ENV=production
```

Si el frontend y backend se despliegan en servicios separados, agrega en el
frontend:

```bash
VITE_API_URL=https://tu-backend-publico.com
```

Si se despliegan juntos con `npm start`, no hace falta `VITE_API_URL`: el
frontend usara el mismo dominio del backend.
