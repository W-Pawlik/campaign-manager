# Frontend Documentation

## Stack

- React
- TypeScript
- Vite
- Material UI
- TanStack Query
- Redux Toolkit
- React Hook Form
- Vitest

## Frontend Shape

The frontend is organized as a feature-based React application built around an active campaign workspace.

Key frontend patterns currently in use:

- feature-based folder structure under `src/features/`
- TanStack Query for server state
- Redux Toolkit for global app state
- Material UI with custom fantasy-oriented styling
- route-driven campaign workspace pages
- dialog-based create/edit/detail workflows across most campaign modules

## Current Application Scope

The frontend is no longer a shell or mock workspace. It currently includes working campaign-facing flows for:

- auth and account entry
- campaign overview
- members and invitations
- sessions
- characters
- quests
- chronicle
- notes
- NPCs
- locations
- inventory
- monsters
- items catalog
- user settings

## Current Feature Highlights

### Core campaign workspace

- campaign overview with summary cards and recent activity
- sidebar-driven navigation between campaign modules
- shared entity reference chips for cross-feature linking
- campaign switcher and authenticated app shell

### Sessions

- session create and edit dialogs
- status-aware filtering
- attendance confirmation and decline actions
- linked chronicle previews inside session details
- scroll-and-highlight navigation when a session is opened from chronicle references

### Quests

- status-aware date validation in create and edit flows
- visual quest timelines
- sorting and filtering in the main list
- priority indicators and colored status chips
- quest details and objective editing flows

### Chronicle

- create and edit dialogs with date-based inputs
- dual timelines for `inWorldDate` and `occurredAt`
- filtering and sorting in the main chronicle view
- click-through navigation from timeline to the chronicle list
- linked chronicle cards inside session details

### Monsters

- campaign bestiary flows
- bestiary-style monster presentation
- statblock-inspired monster details
- Open5e browsing and import-oriented UI

## Offline Support

The frontend currently includes a local offline database implementation for the `chronicle` feature.

Current offline behavior:

- chronicle entries can be read from local storage when offline
- chronicle create, update, and delete operations can be queued locally
- queued changes are synchronized automatically when the app comes back online
- record conflicts are detected during sync
- the UI exposes conflict resolution choices:
  - keep the local version
  - use the server version

Current scope limitation:

- offline persistence is currently implemented only for `chronicle`
- other features still depend on live API access

## Current UX Notes

The frontend now contains several richer UI patterns beyond basic CRUD lists:

- timeline-based navigation in quests and chronicle
- scroll-to-entry and temporary highlight flows between related views
- themed chips and visual indicators for statuses and priorities
- fantasy-styled monster cards and detail surfaces
- modal-heavy workflows with inline validation and mutation error display

## Known Gaps

Some frontend workflows are already implemented, but still rely on backend improvements for full UX completeness.

Examples:

- quest list objective counts
- quest branch or chain filtering
- session-scoped chronicle endpoints
- direct chronicle creation from a session endpoint

See: [`../suggestions/README.md`](../suggestions/README.md)

## Documentation Pointers

- project overview: [`../project/overview.md`](../project/overview.md)
- backend API reference: [`../backend/api.md`](../backend/api.md)
- suggestions and backend gaps discovered during frontend work: [`../suggestions/README.md`](../suggestions/README.md)
