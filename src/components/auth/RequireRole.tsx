import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AppRole } from "@/types/research";
import { useAuth } from "@/context/AuthContext";
import { ROLE_HOME_ROUTE } from "@/lib/permissions";

interface Props {
  allow: AppRole[];
  children: ReactNode;
}

/**
 * Route guard: only allows users whose current role is in `allow`.
 * Unauthenticated users go to /auth; wrong-role users are redirected
 * to their own role's home dashboard.
 */
const RequireRole = ({ allow, children }: Props) => {
  const { isAuthenticated, role } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }

  if (!allow.includes(role)) {
    const home = ROLE_HOME_ROUTE[role] ?? "/auth";
    return <Navigate to={home} replace />;
  }

  return <>{children}</>;
};

export default RequireRole;
