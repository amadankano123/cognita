import React, { createContext, useContext, useState } from "react";
import { User } from "@/types/research";
import { mockUser } from "@/data/mockProject";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  signup: (name: string, email: string, password: string, role?: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(mockUser); // Pre-logged in for demo

  const login = (_email: string, _password: string) => {
    setUser(mockUser);
    return true;
  };

  const signup = (name: string, email: string, _password: string, role?: string) => {
    setUser({
      ...mockUser,
      name: name || mockUser.name,
      email: email || mockUser.email,
      role: role || mockUser.role,
    });
    return true;
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    // Fallback for edge cases where provider hasn't mounted yet
    return {
      user: null,
      isAuthenticated: false,
      login: () => false,
      signup: () => false,
      logout: () => {},
    } as AuthContextType;
  }
  return ctx;
};
