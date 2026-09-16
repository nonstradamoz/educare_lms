import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { PageShell } from "@/components/layout/page-shell";
import { MessageSquare, Send } from "lucide-react";

export default function SmsPage() {
  return (
    <DashboardLayout title="SMS">
      <PageShell
        title="SMS"
        subtitle="Send bulk or individual SMS to students and parents"
        icon={MessageSquare}
        accentColor="blue"
        actions={
          <button className="inline-flex items-center gap-2 rounded-lg bg-brand-blue px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-brand-blue-dark transition-colors">
            <Send className="h-3.5 w-3.5" /> Send SMS
          </button>
        }
      >
        <div className="grid grid-cols-2 gap-4 max-w-md">
          <div className="bg-white rounded-xl border border-border-soft p-5 shadow-sm">
            <p className="text-[11px] font-medium text-text-muted uppercase tracking-wider">SMS Balance</p>
            <p className="text-3xl font-bold mt-2 text-brand-blue">1,000</p>
          </div>
          <div className="bg-white rounded-xl border border-border-soft p-5 shadow-sm">
            <p className="text-[11px] font-medium text-text-muted uppercase tracking-wider">Sent Today</p>
            <p className="text-3xl font-bold mt-2 text-text-primary">0</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-border-soft shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-border-soft">
            <h3 className="text-sm font-semibold text-text-primary">SMS History</h3>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface-2">
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Recipient</th>
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Message</th>
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Sent At</th>
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr><td colSpan={4} className="py-16 text-center text-sm text-text-muted">No messages sent yet.</td></tr>
            </tbody>
          </table>
        </div>
      </PageShell>
    </DashboardLayout>
  );
}
