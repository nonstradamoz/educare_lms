"use client";

import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext<{ role: string | null; email: string | null }>({ role: null, email: null });

export function AuthProvider({ children, initialRole = null, initialEmail = null }: { children: React.ReactNode, initialRole?: string | null, initialEmail?: string | null }) {
  const [role, setRole] = useState<string | null>(initialRole);
  const [email, setEmail] = useState<string | null>(initialEmail);

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
