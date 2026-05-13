# AI Instructions

This directory contains instruction files for AI coding agents working on the Campaign Manager repository.

These files describe the intended architecture, implementation rules, coding constraints, and testing expectations.

## Structure

```txt
.ai/
  README.md

  backend/
    README.md
    system-design-rules.md
    module-design-rules.md
    api-layer-rules.md
    cqrs-and-di-rules.md
    infrastructure-rules.md
    error-logging-context-rules.md
    testing-rules.md
    implementation-checklists.md
```

## How to use these instructions

When working on backend code, start with:

```txt
backend/AGENTS.md
.ai/backend/README.md
```

Then read the specific backend instruction files related to the task.

Examples:

- For a new backend module, read:
  - `system-design-rules.md`
  - `module-design-rules.md`
  - `cqrs-and-di-rules.md`
  - `implementation-checklists.md`

- For a new API endpoint, read:
  - `api-layer-rules.md`
  - `cqrs-and-di-rules.md`
  - `error-logging-context-rules.md`
  - `testing-rules.md`

- For Prisma, Redis, S3, Open5e, AI, or OCR changes, read:
  - `infrastructure-rules.md`
  - `module-design-rules.md`
  - `testing-rules.md`

## Instruction priority

If instructions conflict, follow this priority:

1. User request in the current task
2. Local `AGENTS.md`
3. Files in `.ai/`
4. Existing code conventions
5. General best practices

Do not ignore architecture rules unless explicitly instructed.
