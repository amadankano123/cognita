import React, { createContext, useContext, useState, useCallback } from "react";
import { User, AppRole, ADMIN_ROLES } from "@/types/research";
import { mockUser, roleUserMap } from "@/data/mockProject";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  role: AppRole;
  isAdmin: boolean;
  login: (email: string, password: string, role: AppRole) => boolean;
  signup: (name: string, email: string, password: string, role?: AppRole) => boolean;
  logout: () => void;
  switchRole: (role: AppRole) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(mockUser);
  const [role, setRole] = useState<AppRole>("Researcher");

  const isAdmin = ADMIN_ROLES.includes(role);

  const login = useCallback((_email: string, _password: string, selectedRole: AppRole) => {
    const baseUser = roleUserMap[selectedRole];
    setUser({ ...baseUser, role: selectedRole });
    setRole(selectedRole);
    return true;
  }, []);

  const signup = useCallback((name: string, email: string, _password: string, selectedRole?: AppRole) => {
    const r = selectedRole || "Researcher";
    const baseUser = roleUserMap[r];
    setUser({ ...baseUser, name: name || baseUser.name, email: email || baseUser.email, role: r });
    setRole(r);
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setRole("Researcher");
  }, []);

  const switchRole = useCallback((newRole: AppRole) => {
    const baseUser = roleUserMap[newRole];
    setUser({ ...baseUser, role: newRole });
    setRole(newRole);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, role, isAdmin, login, signup, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    return {
      user: null,
      isAuthenticated: false,
      role: "Researcher" as AppRole,
      isAdmin: false,
      login: () => false,
      signup: () => false,
      logout: () => {},
      switchRole: () => {},
    } as AuthContextType;
  }
  return ctx;
};
