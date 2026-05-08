import { ReactNode } from "react";
import { Permission } from "@/lib/permissions";
import { usePermissions } from "@/hooks/usePermissions";

interface Props {
  permission: Permission;
  fallback?: ReactNode;
  children: ReactNode;
}

/** Conditionally render UI based on a permission. */
const RequirePermission = ({ permission, fallback = null, children }: Props) => {
  const { can } = usePermissions();
  return <>{can(permission) ? children : fallback}</>;
};

export default RequirePermission;
