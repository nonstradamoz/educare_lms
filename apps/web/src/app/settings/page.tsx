"use client";

import { useAuth } from "@/components/providers/auth-provider";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { PageShell } from "@/components/layout/page-shell";
import { Settings, ShieldCheck } from "lucide-react";

export default function SettingsPage() {
  const { role } = useAuth();
  
  if (role === 'TEACHER' || role === 'STUDENT') {
    return (
      <DashboardLayout title="Settings">
        <div className="flex h-[60vh] items-center justify-center flex-col text-center">
          <ShieldCheck className="h-16 w-16 text-brand-red/50 mb-4" />
          <h2 className="text-xl font-bold text-text-primary">Access Denied</h2>
          <p className="text-sm text-text-muted mt-2 max-w-md">You do not have permission to view the settings area. This section is restricted to administrators.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Settings">
      <PageShell title="Settings" subtitle="Configure your LMS preferences" icon={Settings} accentColor="blue">
        <div className="max-w-2xl space-y-4">
          {[
            { group: "General", fields: [
              { label: "Centre Name",   placeholder: "Educare Kalathipady" },
              { label: "Contact Email", placeholder: "admin@educare.com"   },
              { label: "Contact Phone", placeholder: "+91 00000 00000"     },
            ]},
            { group: "Academic Year", fields: [
              { label: "Current Year", placeholder: "2026–2027" },
            ]},
          ].map(({ group, fields }) => (
            <div key={group} className="bg-white rounded-xl border border-border-soft shadow-sm">
              <div className="px-5 py-3 border-b border-border-soft">
                <h3 className="text-sm font-semibold text-text-primary">{group}</h3>
              </div>
              <div className="p-5 space-y-4">
                {fields.map((f) => (
                  <div key={f.label}>
                    <label className="block text-xs font-semibold text-text-secondary mb-1.5">{f.label}</label>
                    <input
                      type="text"
                      defaultValue={f.placeholder}
                      className="w-full h-9 rounded-lg border border-border-soft bg-surface-2 px-3 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-blue/25 focus:border-brand-blue/50"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div className="flex justify-end">
            <button className="rounded-lg bg-brand-blue px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-blue-dark transition-colors">
              Save Changes
            </button>
          </div>
        </div>
      </PageShell>
    </DashboardLayout>
  );
}
