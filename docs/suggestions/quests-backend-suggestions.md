# Quests Backend Suggestions

## 1. Objectives count in the quest list

Current frontend limitation:
- `GET /campaigns/:campaignId/quests` returns quest list items without `objectives` or `objectivesCount`.
- Only quest details include the full `objectives` collection.

Suggested backend change:
- Add `objectivesCount` to the quest list DTO returned by `GET /campaigns/:campaignId/quests`.
- This would let the frontend show objective totals in the main list without sending one extra details request per quest card.

## 2. Branch or quest-chain filtering in the list

Current frontend limitation:
- Quest list items do not expose a dedicated branch, chain, parent quest, or relation summary field.
- Full quest relations are available only in quest details.

Suggested backend change:
- Add a lightweight branch or chain field to the quest list DTO, for example `branchLabel`, `chainId`, or `parentQuestId`.
- Alternatively, include a small relation summary in list responses if branch-level filtering should be available without extra per-quest details requests.
