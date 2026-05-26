# Backend Documentation

## Contents

- Architecture: [`architecture.md`](architecture.md)
- Modules: [`modules.md`](modules.md)
- API overview: [`api.md`](api.md)
- Auth/AuthZ flow: [`auth.md`](auth.md)

## Backend Stack

- Node.js + TypeScript
- Express
- Prisma + PostgreSQL
- Redis
- InversifyJS (DI)
- Zod (validation)
- Pino (logging)

## Runtime Entry Points

- API app: `src/apps/api`
- Console app: `src/apps/console-app`