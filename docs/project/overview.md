# Project Overview

## Goal

Campaign Manager is a platform for organizing tabletop RPG campaigns in one place.

The current application already includes a broad campaign workspace on the frontend and a modular campaign API on the backend.

## High-Level Components

- `frontend/`: web client (React + TypeScript + Vite)
- `backend/`: API server (Express + modular monolith architecture)
- `infra/`: infrastructure resources/configuration

## Development Workflow

- code style and quality: ESLint + Prettier
- tests: Vitest
- backend persistence: PostgreSQL (Prisma)
- cache/auxiliary storage: Redis

## Current Frontend Scope

Implemented or actively developed campaign-facing areas include:

- authentication and user settings
- campaign dashboard and campaign overview
- members and invitations
- sessions
- characters
- quests
- chronicle
- notes
- NPCs
- locations
- inventory
- monsters and Open5e monster browsing
- items catalog

Recent frontend work has especially expanded:

- quest creation, validation, timelines, and list controls
- chronicle timelines, filtering, sorting, and session-linked navigation
- session detail views with linked chronicle previews
- chronicle offline support with local persistence and conflict resolution
- fantasy-styled monster details and bestiary-like catalog flows

## Current Backend Scope

The backend exposes campaign-scoped modules for:

- campaigns and campaign lifecycle
- members and invitations
- characters
- sessions
- quests and objectives
- chronicle
- notes
- NPCs
- locations
- inventory
- monsters
- auth and user profile management

## Architecture Summary

The backend follows a modular monolith with DDD-inspired boundaries:

- `apps/`: entrypoints (API and console app)
- `core/`: shared technical building blocks
- `modules/`: business capabilities such as `auth`, `users`, `campaigns`, `sessions`, `quests`, `chronicle`, and related campaign modules

More details: [`../backend/README.md`](../backend/README.md)
