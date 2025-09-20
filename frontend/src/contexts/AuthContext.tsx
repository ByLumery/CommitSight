import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "../services/api";

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
  const [loading, setLoading] = useState(false);

  const fetchVerifiedUser = async (): Promise<User | null> => {
    const verifyResponse = await api.get("/auth/verify");
    return verifyResponse.data?.user ?? null;
  };

  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }

      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      setLoading(true);
      try {
        const verifiedUser = await fetchVerifiedUser();
        if (isMounted) {
          setUser(verifiedUser);
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          localStorage.removeItem("token");
          delete api.defaults.headers.common["Authorization"];
        }
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      const { token, user: userData } = res.data;

      if (token) {
        localStorage.setItem("token", token);
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }

      let resolvedUser: User | null = userData ?? null;
      if (!resolvedUser && token) {
        try {
          resolvedUser = await fetchVerifiedUser();
        } catch (verifyError) {
          if (axios.isAxiosError(verifyError) && verifyError.response?.status === 401) {
            localStorage.removeItem("token");
            delete api.defaults.headers.common["Authorization"];
          }
          throw verifyError;
        }
      }

      setUser(resolvedUser);
    } catch (error) {
      localStorage.removeItem("token");
      delete api.defaults.headers.common["Authorization"];
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name?: string) => {
    console.log("Register:", email, password, name);
    setUser({ id: "1", email, name: name ?? "Demo User" });
  };

  const logout = () => {
    console.log("Logout");
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
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
