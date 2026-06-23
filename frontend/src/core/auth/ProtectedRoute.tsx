import { Navigate, Outlet, useLocation } from "react-router-dom";

import { appPaths } from "@/app/router/paths";
import { useAppSelector } from "@/app/store/hooks";

export function ProtectedRoute() {
  const location = useLocation();
  const authStatus = useAppSelector((state) => state.auth.status);

  if (authStatus !== "authenticated") {
    return <Navigate to={appPaths.login} replace state={{ from: location }} />;
  }

  return <Outlet />;
}
