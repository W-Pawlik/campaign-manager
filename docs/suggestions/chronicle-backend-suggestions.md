# Chronicle Backend Suggestions

## 1. Expose create-from-session chronicle flow

Current backend observation:
- The backend contains `CreateChronicleEntryFromSessionCommand` and its handler.
- There is no public campaign API route exposing this flow in `campaigns.routes.ts`.

Suggested change:
- Add an endpoint such as `POST /campaigns/:campaignId/sessions/:sessionId/chronicle`.
- This would let the frontend create a chronicle entry directly from a session context without manually reselecting the linked session.

## 2. Add dedicated session chronicle query

Current frontend limitation:
- To show chronicle linked to one session, the frontend currently loads the whole campaign chronicle list and filters it locally by `sessionId`.

Suggested change:
- Add an endpoint such as `GET /campaigns/:campaignId/sessions/:sessionId/chronicle`.
- This would reduce unnecessary data loading for session details and simplify future pagination.

## 3. Consider server-side chronicle filtering and sorting

Current frontend limitation:
- Chronicle list filtering and sorting currently happen on the client using the already loaded campaign chronicle list.

Suggested change:
- Support query params for `visibility`, `sessionId`, `occurredAt`, `inWorldDate`, sort field, and sort direction on `GET /campaigns/:campaignId/chronicle`.
- This would scale better once campaigns accumulate many chronicle entries.
