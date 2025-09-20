import React, { createContext, useContext, useState } from "react";

export type User = {
  id: string;
  email: string;
  name: string;
};

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading] = useState(false);

  // Here you can put your real login/logout logic (API, etc)
  const login = async (email: string, password: string) => {
    console.log("Login:", email, password);
    setUser({ id: "1", email, name: "Demo User" });
  };

  const register = async (email: string, password: string, name?: string) => {
    console.log("Register:", email, password, name);
    setUser({ id: "1", email, name: name ?? "Demo User" });
  };

  const logout = () => {
    console.log("Logout");
    setUser(null);
  };

  const value: AuthContextValue = {
    user,
    loading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
