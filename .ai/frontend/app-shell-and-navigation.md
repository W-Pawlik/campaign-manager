# App Shell And Navigation Plan

This document describes how the frontend should be shaped at the product and navigation level.

It should guide future implementation work so that screens are built into one coherent application shell instead of becoming isolated pages.

## Core Product Model

The frontend should be designed around two levels:

1. global application level
2. active campaign workspace level

This is required because the backend is strongly campaign-scoped:

- most business data lives under `/api/v1/campaigns/:campaignId/...`
- permissions and visibility are checked in the context of a campaign
- a user can belong to multiple campaigns

Because of that, the frontend should not behave like a single-campaign app.

The user first operates as:

- an authenticated user of the application

Then, inside the application, the user enters:

- a selected campaign workspace

## Main Navigation Structure

The application should use two navigation layers:

1. top navigation for global context
2. sidebar navigation for campaign context

Do not merge all navigation into a single list.

Global concerns and campaign concerns should remain visually separated.

## Top Navigation

The top bar should represent the global application level.

It should contain:

- app branding
- active campaign switcher
- quick action to create a campaign
- future global search entry point
- user menu
- future notifications entry point

It should not contain the full campaign module list.

The top bar is the right place for:

- switching campaigns
- going to profile
- going to user settings
- logging out

The active campaign should always be visible in the top bar when one is selected.

## Sidebar Navigation

The left sidebar should represent the active campaign workspace.

It should become the main place for moving between campaign modules.

Recommended sidebar structure:

1. Overview
2. Sessions
3. Characters
4. Quests
5. Chronicle
6. Notes
7. NPCs
8. Locations
9. Monsters
10. Inventory
11. Members
12. Settings

This order is intentional:

- the top of the sidebar is daily workflow
- the middle is world and content management
- the bottom is administrative configuration

## Why This Sidebar Order

### High-frequency workflow

These are usually the most frequently accessed:

- Overview
- Sessions
- Characters
- Quests

### Campaign narrative and support

These support ongoing play and documentation:

- Chronicle
- Notes

### Worldbuilding and content management

These are often maintained by GM or co-GM:

- NPCs
- Locations
- Monsters
- Inventory

### Administrative areas

These are lower-frequency but essential:

- Members
- Settings

## Global Screens

The frontend should contain global screens that are not tied to one campaign.

Recommended global screens:

- Auth
- Home dashboard
- My campaigns
- User profile
- User settings

These screens live outside the campaign workspace.

## Campaign Screens

The frontend should contain campaign-scoped screens aligned with backend modules.

Recommended campaign screens:

- Campaign overview
- Members
- Characters
- Sessions
- Chronicle
- Notes
- Quests
- Locations
- NPCs
- Monsters
- Inventory
- Campaign settings

## Home After Login

The main page after login should be a global dashboard, not a campaign module.

Do not treat the home page as an empty shell.

The home page should help the user decide what to do next.

Recommended sections:

- Your campaigns
- Pending invitations
- Upcoming sessions
- Quick actions
- Recently opened campaigns or recent activity

Quick actions can include:

- Create campaign
- Open last campaign
- Join invitation flow

## Campaign Access Flow

Users need a clear way to access one campaign among many.

Recommended access points:

- campaign switcher in the top bar
- campaign list on the global home dashboard
- optional dedicated "My campaigns" page

The frontend should not assume that a user has only one campaign.

## Campaign Overview Screen

The first screen inside a campaign should be a dashboard-like overview, not a raw module list.

Recommended content on campaign overview:

- campaign title, cover, summary, status
- next planned session
- active quests
- latest chronicle entries
- latest notes
- summary counters:
  - members
  - characters
  - NPCs
  - locations
  - quests
- quick actions:
  - create session
  - create note
  - add NPC
  - add location
  - invite member

The overview should be a control center for the campaign.

## Members And Invitations

The backend separates:

- members
- invitations

In the frontend, this should still feel like one management area.

Recommended UX:

- sidebar entry: `Members`
- inside the page: tabs or segmented views
  - Members
  - Invitations

Do not create separate top-level navigation items for both.

## Notes Strategy

Notes are both:

- a standalone campaign module
- embedded content attached to other entities

The frontend should support both:

- central Notes page for broad access and filtering
- contextual notes within character, quest, NPC, location, and session views

Do not hide notes only inside other modules.

## Chronicle Strategy

Chronicle should be a first-class navigation item.

It is not just admin data.

It is one of the main campaign-facing modules for story continuity.

It should appear above world-management modules such as locations or monsters.

## NPCs Versus Monsters

The backend clearly separates:

- Monsters as statblock templates
- NPCs as world entities

The frontend should preserve this distinction.

Do not place Monsters under NPCs.

Recommended mental model:

- NPCs = story actors
- Monsters = mechanical bestiary

## Open5e Placement

The backend exposes Open5e through external routes, but Open5e should not be a top-level app section in MVP.

Recommended placement:

- entry point from Monsters
- later entry point from Inventory or Items

For example:

- `Import from Open5e` button inside Monsters

This keeps navigation clean.

## Theme Toggle Placement

Theme mode switching should not be placed on the login screen.

It should live in:

- user settings

Optionally later:

- a profile or preferences section

Avoid exposing theme switching everywhere in the shell unless there is a strong product reason.

## Shell Behavior Summary

Recommended behavior:

- after login, user lands on global dashboard
- user can select or switch active campaign
- once inside a campaign, sidebar shows campaign modules
- top bar remains global
- campaign overview acts as the campaign home

## Frontend IA Summary

Use this mental structure:

### Global level

- Home
- My Campaigns
- Profile
- Settings

### Active campaign level

- Overview
- Sessions
- Characters
- Quests
- Chronicle
- Notes
- NPCs
- Locations
- Monsters
- Inventory
- Members
- Settings
