# Frontend Implementation Roadmap

This roadmap describes the preferred order of frontend implementation.

The goal is to build a stable shell first, then add business features on top of it.

Do not implement screens in a random order without first supporting the navigation model and campaign context.

## Phase 1 - Foundation

Goal:

- stable frontend architecture
- working auth flow
- shared theme
- basic routing

Includes:

- app providers
- router setup
- auth flow
- shared HTTP client
- global theme
- global store
- auth guards

Status:

- partially done

## Phase 2 - App Shell

Goal:

- introduce the real application shell
- separate global navigation from campaign navigation

Implement:

1. authenticated shell layout
2. global top navigation
3. campaign-aware sidebar
4. active campaign state
5. campaign switcher UI
6. shell placeholders for global and campaign pages

Important:

- do not implement many business screens before the shell exists
- the shell must support both "no active campaign" and "active campaign selected"

## Phase 3 - Global Dashboard And Campaign Access

Goal:

- give the user a useful landing area after login

Implement:

1. global home dashboard
2. campaigns list on dashboard
3. recent or pinned campaigns section
4. pending invitations section
5. quick actions:
   - create campaign
   - open campaign
   - invitation-related flows if needed

This phase should establish:

- how users enter campaigns
- how users move between campaigns

## Phase 4 - Campaign Core

Goal:

- establish the core campaign workflow

Implement first:

1. campaign overview page
2. campaign details view
3. campaign update flow
4. campaign settings basics
5. campaign cover handling

This creates the primary campaign home screen.

## Phase 5 - Members And Invitations

Goal:

- support collaboration inside campaigns

Implement:

1. members page
2. invitations tab or section
3. invite member flow
4. accept and decline invitation flows
5. role update flow
6. remove member flow

Why this early:

- many later screens depend on real membership and role awareness

## Phase 6 - Sessions

Goal:

- support one of the most central campaign workflows

Implement:

1. sessions list
2. session details
3. create session
4. update session
5. cancel session
6. attendance confirm and decline
7. complete session flow

Sessions should be one of the first fully usable modules.

## Phase 7 - Characters

Goal:

- support player-facing and GM-facing character workflows

Implement:

1. characters list
2. character details
3. create character
4. update character
5. archive character
6. delete character

This phase should also support:

- ownership-aware UI
- permission-aware actions

## Phase 8 - Quests

Goal:

- support campaign planning and story progression

Implement:

1. quests list
2. quest details
3. create and update quest
4. objectives management
5. quest status changes

Quests should come before deeper worldbuilding modules because they are highly visible in active play.

## Phase 9 - Chronicle

Goal:

- support campaign history and session recap

Implement:

1. chronicle list
2. chronicle entry details
3. create entry
4. update entry
5. delete entry

Later extension:

- create chronicle from completed session

## Phase 10 - Notes

Goal:

- support the shared note-taking system across campaign entities

Implement:

1. central notes page
2. note details
3. create, update, delete note
4. visibility-aware rendering
5. contextual embedding hooks for future modules

Notes are critical because they are cross-cutting.

## Phase 11 - NPCs And Locations

Goal:

- support worldbuilding and campaign world structure

Implement in this order:

1. NPCs
2. Locations

NPCs:

- list
- details
- create
- update
- delete

Locations:

- list
- details
- create
- update
- delete
- hierarchy visualization later

These two modules are strongly related and should be planned together.

## Phase 12 - Monsters

Goal:

- support bestiary and statblock workflows

Implement:

1. monsters list
2. monster details
3. create custom monster
4. update monster
5. archive monster

Later:

- import from Open5e

Do not merge Monsters into NPCs.

## Phase 13 - Inventory

Goal:

- support item ownership and transfer workflows

Implement:

1. inventory list
2. item details
3. create inventory item
4. update inventory item
5. delete inventory item
6. transfer item flow

Inventory can follow once core campaign data is already navigable.

## Phase 14 - User Settings

Goal:

- add user-level preferences and account management

Implement:

1. user settings page
2. theme mode switch
3. profile update
4. password change
5. account deletion access

This is where theme mode should live.

## Phase 15 - Open5e Integration UI

Goal:

- expose external reference workflows through campaign modules

Implement:

1. Open5e search entry inside Monsters
2. Open5e details modal or panel
3. import into Monsters

Later:

- item or rules integration if needed

## Phase 16 - Embedded Cross-Module UX

Goal:

- make the app feel connected rather than module-isolated

Implement:

1. notes embedded in details screens
2. related entity panels
3. cross-links between quest, NPC, location, session, and chronicle
4. reusable detail side panels or tabs

## Implementation Priorities Summary

Recommended order:

1. shell
2. global dashboard
3. campaign overview
4. members and invitations
5. sessions
6. characters
7. quests
8. chronicle
9. notes
10. NPCs
11. locations
12. monsters
13. inventory
14. user settings
15. Open5e UI
16. cross-module enhancements

## Rules For Future Frontend Tasks

Before implementing a new module:

1. check whether the shell already supports the right navigation slot
2. check whether the module is global or campaign-scoped
3. check which backend permissions affect the UI
4. decide where the module lives in the sidebar or global navigation
5. avoid bypassing the active campaign model
