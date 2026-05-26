# Campaign Manager

Campaign Manager is a fullstack application for managing tabletop RPG campaigns.

## Monorepo Structure

```txt
campaign-manager/
  frontend/   # React + Vite app
  backend/    # Node.js + Express API
  infra/      # infrastructure-related files
  docs/       # project documentation
```

## Main Technologies

- Frontend: React, TypeScript, Vite
- Backend: Node.js, Express, TypeScript, PostgreSQL, Prisma, Redis, InversifyJS, Zod, Pino
- Tooling: Vitest, ESLint, Prettier, Docker

## Quick Start

1. Install dependencies in root and subprojects (`frontend`, `backend`).
2. Start backend infrastructure:

```bash
cd backend
npm run db:up
npm run prisma:migrate:deploy
npm run dev
```

3. Run frontend:

```bash
cd frontend
npm run dev
```

## Scripts

Root scripts:

- `npm run lint`
- `npm run typecheck`
- `npm test`
- `npm run build`
- `npm run ci`

## Documentation

Detailed docs live in [`docs/`](docs/README.md):

- Project overview: [`docs/project/overview.md`](docs/project/overview.md)
- Backend docs: [`docs/backend/README.md`](docs/backend/README.md)
- Frontend docs: [`docs/frontend/README.md`](docs/frontend/README.md)