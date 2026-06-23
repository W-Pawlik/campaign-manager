import { Navigate, Outlet } from "react-router-dom";

import { appPaths } from "@/app/router/paths";
import { useAppSelector } from "@/app/store/hooks";

export function AnonymousRoute() {
  const authStatus = useAppSelector((state) => state.auth.status);

  if (authStatus === "authenticated") {
    return <Navigate replace to={appPaths.home} />;
  }

  return <Outlet />;
}
