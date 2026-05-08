# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Invitación digital de boda para Brenda & Arturo. Frontend React + TypeScript + Vite. Backend es **Strapi v5** (externo, no en este repo). No hay panel `/admin` en este frontend — la gestión se hace directamente en Strapi.

## Commands

```bash
yarn dev          # servidor de desarrollo
yarn build        # build de producción (salida: dist/)
yarn preview      # previsualizar build
yarn lint         # ESLint
yarn typecheck    # TypeScript sin emitir archivos
```

## Env vars requeridas

```
VITE_STRAPI_API_URL=http://localhost:1337   # URL base del Strapi
VITE_EVENT_ID=<documentId>                  # documentId del evento en Strapi
```

## Architecture

### Routing

No hay React Router. `App.tsx` hace routing manual con `window.location.pathname`:
- `/` → `HomePage`
- `/invitacion/:codigo` → `InvitationPage`

### Data layer (`src/lib/`)

- **`api.ts`** — instancia axios con baseURL `${VITE_STRAPI_API_URL}/api`, interceptor que inyecta JWT desde `localStorage`, manejo de errores Strapi v5. Helpers `one()` / `many()` extraen `res.data.data`.
- **`types.ts`** — tipos de dominio para Strapi v5 (respuestas planas, sin wrapper `attributes`). Entidades: `Event`, `Guest`, `Companion`, `Table`, `StrapiUser`.
- **`services/`** — un archivo por entidad (`events.ts`, `guests.ts`, `companions.ts`, `tables.ts`, `auth.ts`). Cada uno expone funciones tipadas que usan `api.ts`. Re-exportados desde `services/index.ts` como namespaces (`eventService`, `guestService`, etc.).

### Key Strapi v5 conventions

- Usar `documentId` (string) para mutaciones y relaciones, **no** `id` (number).
- Relaciones se populan explícitamente: `params: { populate: ['table', 'companions', 'event'] }`.
- Endpoint custom para buscar por código: `GET /guests/invitation/:eventDocumentId/:uniqueCode`.
- `pagination[pageSize]=1000` (`ALL` constant) para obtener todos los registros sin paginación.

### Styling

Tailwind CSS con paleta personalizada definida en `tailwind.config.js`:
- `primary` #C7623D, `secondary` #904029, `accent` #874221, `background` #C27341

### Guest status flow

`status: "pending" | "yes" | "no"`. Al confirmar `"no"`, se zeroa `confirmed_passes` y se desasigna la mesa (`table: null`).
