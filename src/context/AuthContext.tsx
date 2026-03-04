import React, { createContext, useContext, useState, useCallback } from "react";
import { User, AppRole } from "@/types/research";
import { mockUsers } from "@/data/mockInstitution";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  role: AppRole;
  isAdmin: boolean;
  isHod: boolean;
  login: (email: string, password: string, role: AppRole) => boolean;
  signup: (userData: Partial<User> & { role: AppRole }) => boolean;
  logout: () => void;
  switchRole: (role: AppRole) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<AppRole>("Student");

  const isAdmin = role === "Research Director";
  const isHod = role === "Head of Department";

  const login = useCallback((_email: string, _password: string, selectedRole: AppRole) => {
    // Find a mock user with the matching role
    const found = mockUsers.find(u => u.role === selectedRole) || mockUsers[0];
    setUser({ ...found, role: selectedRole });
    setRole(selectedRole);
    return true;
  }, []);

  const signup = useCallback((userData: Partial<User> & { role: AppRole }) => {
    const newUser: User = {
      id: `u-${Date.now()}`,
      name: userData.name || "New User",
      email: userData.email || "",
      role: userData.role,
      institution: "Greenfield University",
      studentCategory: userData.studentCategory,
      matricId: userData.matricId,
      faculty: userData.faculty,
      department: userData.department,
      programme: userData.programme,
      projectType: userData.projectType,
      academicTitle: userData.academicTitle,
    };
    setUser(newUser);
    setRole(userData.role);
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setRole("Student");
  }, []);

  const switchRole = useCallback((newRole: AppRole) => {
    const found = mockUsers.find(u => u.role === newRole) || mockUsers[0];
    setUser(prev => prev ? { ...found, name: prev.name, email: prev.email } : null);
    setRole(newRole);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, role, isAdmin, isHod, login, signup, logout, switchRole }}>
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
      role: "Student" as AppRole,
      isAdmin: false,
      isHod: false,
      login: () => false,
      signup: () => false,
      logout: () => {},
      switchRole: () => {},
    } as AuthContextType;
  }
  return ctx;
};
