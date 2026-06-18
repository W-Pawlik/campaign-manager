import type { PropsWithChildren } from "react";

import { AppThemeProvider } from "@/app/providers/AppThemeProvider";
import { QueryProvider } from "@/app/providers/QueryProvider";
import { StoreProvider } from "@/app/providers/StoreProvider";

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <StoreProvider>
      <QueryProvider>
        <AppThemeProvider>{children}</AppThemeProvider>
      </QueryProvider>
    </StoreProvider>
  );
}
