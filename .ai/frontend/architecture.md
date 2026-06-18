# Frontend Architecture

The frontend uses feature-based architecture.

The goal is to organize code by business domain instead of organizing everything only by file type.

## Main Structure

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

## app

The `app` folder contains application-level setup.

Use it for:

- root app component
- providers
- router
- global store
- app config

Example:

```txt
src/app/
├── App.tsx
├── providers/
│   ├── AppProviders.tsx
│   ├── QueryProvider.tsx
│   ├── StoreProvider.tsx
│   └── ThemeProvider.tsx
├── router/
│   ├── routes.tsx
│   └── paths.ts
├── store/
│   ├── store.ts
│   ├── rootReducer.ts
│   └── hooks.ts
└── config/
    ├── env.ts
    └── constants.ts
```

## features

The `features` folder contains business domains.

Examples:

```txt
src/features/
├── auth/
├── dashboard/
├── campaigns/
├── characters/
├── sessions/
├── notes/
├── locations/
├── npcs/
├── monsters/
├── items/
├── spells/
└── dice/
```

A feature should contain code related to one business area.

Example:

```txt
src/features/campaigns/
├── api/
│   ├── campaignsApi.ts
│   └── campaignsQueries.ts
├── components/
│   ├── CampaignCard.tsx
│   ├── CampaignForm.tsx
│   └── CampaignList.tsx
├── hooks/
│   └── useSelectedCampaign.ts
├── model/
│   ├── campaign.types.ts
│   └── campaign.schema.ts
├── pages/
│   ├── CampaignsPage.tsx
│   └── CampaignDetailsPage.tsx
├── store/
│   └── campaignsSlice.ts
├── utils/
│   └── campaignHelpers.ts
└── index.ts
```

Not every feature needs all folders. Create only what is needed.

## core

The `core` folder contains technical infrastructure.

Examples:

```txt
src/core/
├── api/
│   ├── httpClient.ts
│   ├── apiError.ts
│   └── endpoints.ts
├── auth/
│   ├── ProtectedRoute.tsx
│   └── permissions.ts
├── storage/
│   └── localStorage.ts
└── logger/
    └── logger.ts
```

`core` should not depend on features.

## layouts

The `layouts` folder contains page layouts.

Examples:

```txt
src/layouts/
├── RootLayout.tsx
├── AppLayout.tsx
├── AuthLayout.tsx
└── PublicLayout.tsx
```

Layouts are responsible for page structure, such as:

- header
- sidebar
- navigation
- main content area
- outlet placement

Layouts should not contain business logic.

## shared

The `shared` folder contains reusable business-neutral code.

Examples:

```txt
src/shared/
├── components/
├── hooks/
├── utils/
├── types/
├── constants/
└── theme/
```

Good candidates for `shared`:

```txt
PageHeader
EmptyState
ConfirmDialog
LoadingScreen
ErrorState
SectionCard
useDebounce
formatDate
```

Bad candidates for `shared`:

```txt
CampaignCard
CharacterSheet
MonsterStats
SessionTimeline
```

Those belong to their domain features.

## Dependency Rules

Allowed dependencies:

```txt
app -> features
app -> core
app -> layouts
app -> shared

features -> core
features -> shared

layouts -> core
layouts -> shared

core -> shared

shared -> no app, no features, no layouts, no core
```

Avoid:

```txt
shared -> features
core -> features
feature A -> deep import from feature B
```

## Cross-Feature Imports

If one feature needs something from another feature, import it from the feature public API.

Good:

```ts
import { CharacterAvatar } from "@/features/characters";
```

Avoid:

```ts
import { CharacterAvatar } from "@/features/characters/components/CharacterAvatar";
```
