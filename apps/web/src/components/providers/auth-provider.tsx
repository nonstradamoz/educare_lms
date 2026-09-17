"use client";

import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext<{ role: string | null; email: string | null }>({ role: null, email: null });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const match = document.cookie.match(/(^| )AccessToken=([^;]+)/);
    if (match) {
      try {
        const payload = JSON.parse(atob(match[2].split('.')[1]));
        setRole(payload.role);
        setEmail(payload.email);
      } catch (e) {}
    }
  }, []);

  return <AuthContext.Provider value={{ role, email }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
