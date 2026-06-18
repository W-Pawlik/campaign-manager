# Data Management

The frontend uses Redux Toolkit, TanStack Query, and Axios.

Each tool has a different responsibility.

## Tool Responsibilities

Use TanStack Query for server state.

Use Redux Toolkit for global client state.

Use Axios as the HTTP client.

Use local state for component-only state.

Use URL params for state that should be reflected in the browser URL.

## TanStack Query

TanStack Query should be used for data that comes from the backend.

Examples:

```txt
campaigns list
campaign details
characters list
character details
sessions
notes
locations
NPCs
monsters
items
spells
```

TanStack Query handles:

```txt
cache
loading state
error state
refetching
query invalidation
mutations
optimistic updates
```

## Redux Toolkit

Redux Toolkit should be used for global client state.

Examples:

```txt
authenticated user state
selected campaign id
sidebar open or closed
theme mode
global UI preferences
global filters
global modals
```

Do not use Redux as the default place for API data.

## Axios

Axios should be configured once in:

```txt
src/core/api/httpClient.ts
```

Features should use this shared client.

Do not create separate Axios instances inside features.

## Recommended API Structure

Each feature that communicates with the backend should have an `api` folder.

Example:

```txt
src/features/campaigns/api/
├── campaignsApi.ts
└── campaignsQueries.ts
```

## API Functions

`campaignsApi.ts` should contain pure HTTP functions.

Example:

```ts
import { httpClient } from "@/core/api/httpClient";

import type { Campaign } from "../model/campaign.types";

export async function getCampaigns() {
  const response = await httpClient.get<Campaign[]>("/campaigns");

  return response.data;
}
```

## Query Hooks

`campaignsQueries.ts` should contain TanStack Query keys and hooks.

Example:

```ts
import { useQuery } from "@tanstack/react-query";

import { getCampaigns } from "./campaignsApi";

export const campaignsQueryKeys = {
  all: ["campaigns"] as const,
  lists: () => [...campaignsQueryKeys.all, "list"] as const,
  details: (id: string) => [...campaignsQueryKeys.all, "detail", id] as const,
};

export function useCampaignsQuery() {
  return useQuery({
    queryKey: campaignsQueryKeys.lists(),
    queryFn: getCampaigns,
  });
}
```

## Mutations

Mutations should invalidate relevant queries after successful changes.

Example:

```ts
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createCampaign } from "./campaignsApi";
import { campaignsQueryKeys } from "./campaignsQueries";

export function useCreateCampaignMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCampaign,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: campaignsQueryKeys.all,
      });
    },
  });
}
```

## Redux Store Structure

The global Redux store should live in:

```txt
src/app/store/
```

Recommended structure:

```txt
src/app/store/
├── store.ts
├── rootReducer.ts
└── hooks.ts
```

Typed Redux hooks:

```ts
import { useDispatch, useSelector } from "react-redux";

import type { AppDispatch, RootState } from "./store";

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
```

## Decision Rules

Use TanStack Query when:

```txt
data comes from the backend
data needs caching
data needs refetching
data is shared between screens because it comes from API
```

Use Redux Toolkit when:

```txt
state is global
state belongs to the client
state is not just backend cache
many unrelated components need to access or change it
```

Use local state when:

```txt
state belongs to one component
state is temporary
state does not need to survive navigation
```

Use URL state when:

```txt
state should be shareable by link
state should survive refresh
state represents filters, tabs, search, pagination, or selected view
```

Examples:

```txt
Campaign list -> TanStack Query
Campaign details -> TanStack Query
Create campaign request -> TanStack Query mutation
Sidebar open state -> Redux Toolkit
Theme mode -> Redux Toolkit
Current form values -> React Hook Form
Dialog open state used by one component -> local state
Table filters visible in URL -> URL params
```
