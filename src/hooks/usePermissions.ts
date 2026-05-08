import { useAuth } from "@/context/AuthContext";
import { Permission, hasPermission, hasAnyPermission } from "@/lib/permissions";

export function usePermissions() {
  const { role } = useAuth();
  return {
    role,
    can: (p: Permission) => hasPermission(role, p),
    canAny: (perms: Permission[]) => hasAnyPermission(role, perms),
  };
}
