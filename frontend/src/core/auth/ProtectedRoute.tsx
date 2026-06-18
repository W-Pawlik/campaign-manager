import { Navigate, Outlet, useLocation } from "react-router-dom";

import { appPaths } from "@/app/router/paths";

type ProtectedRouteProps = {
  isAllowed: boolean;
  redirectTo?: string;
};

export function ProtectedRoute({ isAllowed, redirectTo = appPaths.home }: ProtectedRouteProps) {
  const location = useLocation();

  if (!isAllowed) {
    return <Navigate to={redirectTo} replace state={{ from: location }} />;
  }

  return <Outlet />;
}
