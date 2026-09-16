import { Sidebar } from "./sidebar";
import { TopNav } from "./top-nav";

export function DashboardLayout({ children, title }: { children: React.ReactNode; title?: string }) {
  return (
    <div className="flex h-screen overflow-hidden bg-surface">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopNav title={title} />
        <main className="flex-1 overflow-y-auto bg-surface">
          {children}
        </main>
      </div>
    </div>
  );
}
