import React from "react";
import { api } from "../services/api";
import { useNavigate } from "react-router-dom";

type User = { id: string; email: string } | null;
export const AuthContext = React.createContext<{ user: User }>({ user: null });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User>(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    const t = localStorage.getItem("token");
    if (t) (api.defaults.headers.common as any).Authorization = `Bearer ${t}`;

    (async () => {
      try {
        const me = await api.get("/auth/me");
        setUser(me.data);
      } catch (e: any) {
        if (e?.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          console.warn("verify error", e);
        }
      }
    })();
  }, [navigate]);

  return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>;
}
