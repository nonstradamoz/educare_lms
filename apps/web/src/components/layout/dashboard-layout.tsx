"use client";

import { Sidebar } from "./sidebar";
import { TopNav } from "./top-nav";
import { useAuth } from "@/components/providers/auth-provider";

export function DashboardLayout({ children, title, role: propRole }: { children: React.ReactNode; title?: string; role?: string }) {
  const { role: authRole } = useAuth();
  const activeRole = propRole || authRole;

  return (
    <div className="flex h-screen overflow-hidden bg-surface">
      <Sidebar role={activeRole || undefined} />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopNav title={title} />
        <main className="flex-1 overflow-y-auto bg-surface">
          {children}
        </main>
      </div>
    </div>
  );
}
