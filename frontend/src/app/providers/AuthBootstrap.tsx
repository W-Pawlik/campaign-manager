import type { PropsWithChildren } from "react";
import { useEffect, useRef } from "react";

import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { registerSessionClearedHandler } from "@/core/auth/authSession";
import { bootstrapAuth, sessionCleared } from "@/features/auth";
import { LoadingScreen } from "@/shared/components";

export function AuthBootstrap({ children }: PropsWithChildren) {
  const dispatch = useAppDispatch();
  const authStatus = useAppSelector((state) => state.auth.status);
  const hasBootstrappedRef = useRef(false);

  useEffect(() => {
    const unregisterHandler = registerSessionClearedHandler(() => {
      dispatch(sessionCleared());
    });

    return unregisterHandler;
  }, [dispatch]);

  useEffect(() => {
    if (hasBootstrappedRef.current) {
      return;
    }

    hasBootstrappedRef.current = true;

    void dispatch(bootstrapAuth());
  }, [dispatch]);

  if (authStatus === "bootstrapping") {
    return <LoadingScreen />;
  }

  return children;
}
