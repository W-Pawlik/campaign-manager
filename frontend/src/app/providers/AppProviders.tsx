import type { PropsWithChildren } from "react";

import { AuthBootstrap } from "@/app/providers/AuthBootstrap";
import { AppThemeProvider } from "@/app/providers/AppThemeProvider";
import { QueryProvider } from "@/app/providers/QueryProvider";
import { StoreProvider } from "@/app/providers/StoreProvider";

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <StoreProvider>
      <QueryProvider>
        <AppThemeProvider>
          <AuthBootstrap>{children}</AuthBootstrap>
        </AppThemeProvider>
      </QueryProvider>
    </StoreProvider>
  );
}
