# Frontend

Frontend application for managing tabletop RPG campaigns, mainly focused on Dungeons & Dragons style campaigns.

The application should be built with React, TypeScript, Redux Toolkit, TanStack Query, Axios, React Router, and Material UI.

The project follows a feature-based architecture. Business logic should be grouped by domain features instead of being grouped only by technical file types.

Read these files before making larger frontend changes:

- `architecture.md`
- `data-management.md`
- `styling.md`
- `component-design-rules.md`
- `app-shell-and-navigation.md`
- `implementation-roadmap.md`

## Main Goals

The frontend should be:

- modular
- scalable
- easy to understand
- easy to extend
- visually consistent
- based on a shared Material UI theme
- suitable for a fantasy RPG / Dungeons & Dragons inspired product

## Tech Stack

Use:

- React
- TypeScript
- React Router
- Redux Toolkit
- TanStack Query
- Axios
- Material UI
- React Hook Form
- Zod

## Project Structure

```txt
src/
├── app/
├── features/
├── core/
├── layouts/
├── shared/
├── assets/
├── styles/
└── main.tsx
```

## Folder Responsibilities

### app

The `app` folder contains application-level setup.

Use it for:

- app root
- providers
- router configuration
- global Redux store
- app-level config

Example:

```txt
src/app/
├── App.tsx
├── providers/
├── router/
├── store/
└── config/
```

### features

The `features` folder contains business features.

Each feature should contain its own API calls, components, hooks, types, schemas, pages, and local utilities.

Example:

```txt
src/features/campaigns/
├── api/
├── components/
├── hooks/
├── model/
├── pages/
├── store/
├── utils/
└── index.ts
```

Possible features:

```txt
auth
dashboard
campaigns
characters
sessions
notes
locations
npcs
monsters
items
spells
dice
```

Do not create all features upfront. Create them only when needed.

### core

The `core` folder contains technical shared infrastructure.

Use it for:

- Axios client
- API errors
- auth guards
- permissions
- local storage helpers
- logger
- global technical utilities

Example:

```txt
src/core/
├── api/
├── auth/
├── storage/
└── logger/
```

### layouts

The `layouts` folder contains page layouts.

Use it for:

- root layout
- authenticated app layout
- auth layout
- public layout
- dashboard shell

Example:

```txt
src/layouts/
├── RootLayout.tsx
├── AppLayout.tsx
├── AuthLayout.tsx
└── PublicLayout.tsx
```

### shared

The `shared` folder contains reusable, business-neutral code.

Use it for:

- reusable UI components
- generic hooks
- generic utilities
- shared types
- theme
- constants

Example:

```txt
src/shared/
├── components/
├── hooks/
├── utils/
├── types/
├── constants/
└── theme/
```

Do not put business-specific components in `shared`.

Good:

```txt
shared/components/PageHeader
shared/components/ConfirmDialog
shared/components/EmptyState
```

Bad:

```txt
shared/components/CampaignCard
shared/components/CharacterSheet
```

Those should belong to their features.

## State Management Rules

Use TanStack Query for server state.

Examples:

- campaigns list
- campaign details
- characters list
- session notes
- monsters
- spells
- items
- API mutations

Use Redux Toolkit for global client state.

Examples:

- current user session state
- selected campaign id
- sidebar state
- theme mode
- UI preferences
- global filters
- global modal state

Use local component state for state that belongs only to one component.

Use URL params for state that should be reflected in the URL.

## Axios And TanStack Query

TanStack Query does not replace Axios.

Axios should be used as the HTTP client.

TanStack Query should be used for:

- caching
- loading state
- error state
- refetching
- mutations
- invalidation
- synchronization with the backend

All API requests should go through one shared Axios instance:

```txt
src/core/api/httpClient.ts
```

## Styling

The application uses Material UI.

The visual style should be inspired by fantasy RPGs and Dungeons & Dragons:

- parchment-like surfaces
- dark fantasy backgrounds
- gold and bronze accents
- subtle old-map feeling
- readable forms and tables
- clean dashboard structure
- polished but not overdecorated fantasy UI

The theme should live in:

```txt
src/shared/theme/
```

Avoid hardcoded colors and spacing when a theme token can be used.

Prefer:

```tsx
<Box sx={{ bgcolor: "background.paper", color: "text.primary", p: 2 }} />
```

Avoid:

```tsx
<div style={{ background: "#241a14", color: "#f5ead7", padding: "16px" }} />
```

## Import Rules

Use the `@` alias for imports from `src`.

Good:

```ts
import { httpClient } from "@/core/api/httpClient";
import { CampaignsPage } from "@/features/campaigns";
import { PageHeader } from "@/shared/components";
```

Avoid:

```ts
import { CampaignsPage } from "../../../features/campaigns/pages/CampaignsPage";
```

Each feature should expose its public API through `index.ts`.

## AI Rules

When generating frontend code, AI should:

- follow the feature-based architecture
- use TypeScript
- use Material UI components
- use the shared Material UI theme
- use TanStack Query for server state
- use Redux Toolkit for global client state
- use Axios through the shared `httpClient`
- keep components small
- split large components into smaller reusable pieces
- prefer feature-local reusable components before creating giant page files
- avoid unnecessary abstractions
- avoid business logic inside `shared`
- avoid deep imports from other features
- export feature public APIs through `index.ts`
