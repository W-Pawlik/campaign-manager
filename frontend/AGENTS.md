# Frontend AGENTS.md

## Frontend status

Frontend-specific detailed architecture instructions are not finalized yet.

The frontend uses:

- React
- TypeScript
- Vite

## General frontend rules

- Keep components typed with TypeScript.
- Avoid large, unstructured components.
- Keep API access separated from UI components.
- Do not hardcode backend URLs directly in components.
- Prefer small reusable components.
- Keep validation and form logic explicit.
- Follow existing project conventions once frontend structure is established.
- Prefer TS path aliases for non-local imports:
  - `@/*` -> `src/*`

## Before major frontend work

Before introducing major frontend architecture decisions, update the frontend instruction system in:

```txt
.ai/frontend/
```

If `.ai/frontend/` does not exist yet, do not invent a large architecture without project-level approval.

## Typical commands

Check `package.json` before running commands.

Common frontend commands may be:

```bash
npm run typecheck
npm run lint
npm test
npm run build
```
