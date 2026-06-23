# Component Design Rules

These rules exist to keep the frontend maintainable as the UI grows.

The main goal is:

- small components
- reusable building blocks
- clear responsibilities
- easy testing
- easy review

## Core Principle

Do not solve a screen by putting everything into one large component.

Prefer component splitting early instead of waiting until a file becomes hard to read.

When implementing UI, think in layers:

1. page or route component
2. feature section components
3. reusable feature components
4. shared UI primitives

## Expected Component Size

As a default rule:

- avoid components longer than about 150 lines
- be cautious once a component grows beyond about 100 lines
- if a component becomes hard to scan, split it even earlier

These are not strict mechanical limits, but they are strong guidance.

If one component contains:

- page shell
- data wiring
- multiple visual sections
- form markup
- modal markup
- repeated card rows
- repeated item rendering logic

then it should almost certainly be split.

## Responsibilities

Each component should have one main responsibility.

Good examples:

- `LoginPage` coordinates the screen
- `LoginHeroPanel` renders the visual left side
- `LoginFormPanel` renders the form side
- `AuthTextField` standardizes auth field styling
- `CampaignCard` renders one campaign card
- `CampaignList` renders a list of campaign cards

Avoid components that simultaneously:

- fetch data
- transform data
- own many local UI states
- render many sections
- contain repeated visual patterns inline

## Preferred Splitting Strategy

When building a page, split by visual and behavioral boundaries.

### Split by screen section

If a page has distinct areas, extract them.

Examples:

- hero panel
- form panel
- sidebar section
- filters toolbar
- results list
- details panel

### Split repeated UI blocks

If a JSX pattern repeats more than once, extract it.

Examples:

- stat rows
- metadata rows
- action button groups
- form field groups
- empty state blocks

### Split form structure

Large forms should not be one file unless they are truly small.

Prefer:

- page component
- form container component
- section components
- field helper components when styling repeats

Examples:

- `CharacterForm`
- `CharacterIdentitySection`
- `CharacterStatsSection`
- `CharacterNarrativeSection`

### Split container from presentational UI

When useful, separate:

- data or state orchestration
- visual rendering

Examples:

- `CampaignListSection` handles queries and empty states
- `CampaignList` only renders the list

Do not force this split for every tiny component.
Use it when it makes the code easier to understand.

## Reusability Rules

Before creating new markup, check whether the same pattern already exists.

Prefer reusing:

- shared layout primitives
- existing buttons or cards
- existing empty or error states
- existing field wrappers
- existing section headers

Do not duplicate the same visual logic under different names.

If something is:

- business-neutral
- used by multiple features
- visually consistent across the app

it should usually live in `src/shared/components/`.

If something is:

- domain-specific
- tied to one feature language
- unlikely to be reused outside that feature

it should stay inside that feature.

## Feature-Local Reuse

Not everything reusable belongs in `shared`.

If a building block is reused only inside one feature, keep it inside that feature.

Example:

```txt
src/features/auth/ui/
  LoginPage.tsx
  LoginHeroPanel.tsx
  LoginFormPanel.tsx
  AuthFormActions.tsx
```

This is preferred over pushing feature-specific pieces into `shared`.

## Page Components

Page components should be thin.

They may:

- wire route params
- connect hooks
- choose which states to show
- compose feature sections

They should avoid containing all detailed markup inline.

A page should preferably read like composition:

```tsx
return (
  <CampaignDetailsLayout>
    <CampaignHeaderSection />
    <CampaignMembersSection />
    <CampaignSessionsSection />
  </CampaignDetailsLayout>
);
```

## Large JSX Blocks

If JSX contains long nested trees, split them.

Warning signs:

- many nested `Box`, `Stack`, and `Grid` blocks
- more than one visually distinct panel in one file
- long `sx` objects repeated inline
- several buttons with repeated styling
- several text fields with repeated styling

In such cases, extract:

- a panel component
- a row component
- a field component
- a style helper

## Styling Reuse

If multiple components use the same styling pattern, reuse it.

Prefer:

- shared component
- feature-local wrapper
- theme override
- exported `sx` object or style helper when appropriate

Avoid copying large `sx` objects into many files.

## AI Implementation Rules

When AI generates frontend code, it should:

- actively look for natural component boundaries before writing JSX
- split large screens into smaller components by default
- prefer composition over one long component file
- create feature-local reusable components when reuse is limited to one feature
- create shared components only when reuse is cross-feature and business-neutral
- avoid duplicating the same markup patterns
- keep page components focused on orchestration
- keep forms split into smaller sections when they grow
- avoid introducing giant files as a shortcut

## Refactor Triggers

AI should refactor or split a component when any of the following is true:

- the component grows large and hard to scan
- the component has multiple distinct visual sections
- repeated markup appears
- repeated styling appears
- the component mixes orchestration and detailed rendering heavily
- reviewing the file requires too much scrolling

## Practical Rule For Future Changes

Before finishing a frontend task, ask:

1. Is this component doing more than one job?
2. Is there repeated JSX that should be extracted?
3. Is there repeated styling that should be standardized?
4. Should this be a feature-local reusable component?
5. Can the page read more clearly as composition?

If the answer to any of these is yes, split the component.
