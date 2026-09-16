import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { PageShell } from "@/components/layout/page-shell";
import { Headset, Plus } from "lucide-react";

export default function EnquiryPage() {
  return (
    <DashboardLayout title="Enquiry / Leads">
      <PageShell
        title="Enquiry / Leads"
        subtitle="Track prospective student inquiries and leads"
        icon={Headset}
        accentColor="orange"
        actions={
          <button className="inline-flex items-center gap-2 rounded-lg bg-brand-blue px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-brand-blue-dark transition-colors">
            <Plus className="h-3.5 w-3.5" /> Add Enquiry
          </button>
        }
      >
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { label: "Total Enquiries", value: "0", sub: "All time" },
            { label: "This Month",      value: "0", sub: "Sep 2026" },
            { label: "Converted",       value: "0", sub: "To students" },
          ].map((c) => (
            <div key={c.label} className="bg-white rounded-xl border border-border-soft p-5 shadow-sm">
              <p className="text-[11px] font-medium text-text-muted uppercase tracking-wider">{c.label}</p>
              <p className="text-3xl font-bold mt-2 tracking-tight text-text-primary">{c.value}</p>
              <p className="text-xs text-text-muted mt-1">{c.sub}</p>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-xl border border-border-soft shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-soft bg-surface-2">
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Name</th>
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Contact</th>
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Course Interest</th>
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Date</th>
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr><td colSpan={5} className="py-16 text-center text-sm text-text-muted">No enquiries yet.</td></tr>
            </tbody>
          </table>
        </div>
      </PageShell>
    </DashboardLayout>
  );
}
