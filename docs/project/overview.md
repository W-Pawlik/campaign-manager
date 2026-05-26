# Project Overview

## Goal

Campaign Manager is a platform for organizing tabletop RPG campaigns in one place.

Current backend focus includes:

- authentication and user sessions
- user profile management
- campaign lifecycle management

## High-Level Components

- `frontend/`: web client (React + TypeScript + Vite)
- `backend/`: API server (Express + modular monolith architecture)
- `infra/`: infrastructure resources/configuration

## Development Workflow

- code style and quality: ESLint + Prettier
- tests: Vitest
- backend persistence: PostgreSQL (Prisma)
- cache/auxiliary storage: Redis

## Architecture Summary

The backend follows a modular monolith with DDD-inspired boundaries:

- `apps/`: entrypoints (API and console app)
- `core/`: shared technical building blocks
- `modules/`: business capabilities (`auth`, `users`, `campaigns`)

More details: [`../backend/README.md`](../backend/README.md)