# Styling System

The frontend uses Material UI as the main UI system.

The project should have a custom shared theme built on top of Material UI.

The theme should be located in:

```txt
src/shared/theme/
```

## Visual Direction

The application is a fantasy RPG campaign manager.

The style should be inspired by:

- Dungeons & Dragons
- fantasy maps
- parchment
- character sheets
- old books
- taverns
- dark fantasy interfaces
- gold and bronze details

The UI should feel atmospheric but still clean and usable.

Avoid making the interface too decorative. This is still a productivity application.

## Theme Structure

Use this structure:

```txt
src/shared/theme/
├── theme.ts
├── palette.ts
├── typography.ts
├── components.ts
└── tokens.ts
```

## Palette Direction

Suggested direction:

```ts
export const palette = {
  mode: "dark",
  background: {
    default: "#16110d",
    paper: "#241a14",
  },
  primary: {
    main: "#c9a24d",
  },
  secondary: {
    main: "#7f5539",
  },
  text: {
    primary: "#f5ead7",
    secondary: "#c9b99a",
  },
};
```

This is only a starting point. The final palette should be adjusted through the Material UI theme.

## Typography Direction

Use readable fonts for most UI elements.

Fantasy-style fonts may be used carefully for:

- logo
- main page titles
- decorative headings

Do not use hard-to-read fantasy fonts for forms, tables, or long text.

Example:

```ts
export const typography = {
  fontFamily: `"Inter", "Roboto", "Arial", sans-serif`,
  h1: {
    fontWeight: 700,
  },
  h2: {
    fontWeight: 700,
  },
  button: {
    textTransform: "none",
    fontWeight: 600,
  },
};
```

## Theme Tokens

Use custom tokens for repeated design values.

Example:

```ts
export const fantasyTokens = {
  radius: {
    sm: 6,
    md: 10,
    lg: 16,
  },
  layout: {
    sidebarWidth: 280,
    topbarHeight: 64,
  },
  shadows: {
    card: "0 8px 24px rgba(0, 0, 0, 0.18)",
  },
};
```

## Component Overrides

Global Material UI component overrides should be defined in:

```txt
src/shared/theme/components.ts
```

Useful components to customize:

```txt
MuiButton
MuiCard
MuiPaper
MuiTextField
MuiAppBar
MuiDrawer
MuiDialog
MuiTooltip
MuiMenu
MuiTabs
```

## Styling Rules

Prefer using Material UI components and `sx`.

Good:

```tsx
<Card sx={{ p: 2, borderRadius: 2, bgcolor: "background.paper" }}>
  <Typography variant="h6">Campaign name</Typography>
</Card>
```

Avoid raw HTML when a Material UI component is better:

```tsx
<div className="card">
  <h2>Campaign name</h2>
</div>
```

Avoid hardcoded visual values:

```tsx
<Box sx={{ backgroundColor: "#241a14", color: "#f5ead7" }} />
```

Prefer theme values:

```tsx
<Box sx={{ bgcolor: "background.paper", color: "text.primary" }} />
```

## Shared UI Components

Reusable UI components should be placed in:

```txt
src/shared/components/
```

Examples:

```txt
PageHeader
SectionCard
EmptyState
ErrorState
LoadingScreen
ConfirmDialog
StatCard
```

Business components should stay inside features.

Good:

```txt
src/features/campaigns/components/CampaignCard.tsx
```

Bad:

```txt
src/shared/components/CampaignCard.tsx
```
