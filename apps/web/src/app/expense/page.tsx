import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { PageShell } from "@/components/layout/page-shell";
import { Banknote, Plus } from "lucide-react";

export default function ExpensePage() {
  return (
    <DashboardLayout title="Expense & Income">
      <PageShell
        title="Expense & Income"
        subtitle="Track all income and operational expenses"
        icon={Banknote}
        accentColor="green"
        actions={
          <div className="flex gap-2">
            <button className="inline-flex items-center gap-2 rounded-lg border border-border-soft bg-white px-4 py-2 text-xs font-semibold text-text-secondary hover:bg-surface-2 transition-colors">
              <Plus className="h-3.5 w-3.5" /> Add Expense
            </button>
            <button className="inline-flex items-center gap-2 rounded-lg bg-brand-blue px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-brand-blue-dark transition-colors">
              <Plus className="h-3.5 w-3.5" /> Add Income
            </button>
          </div>
        }
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Income",   value: "₹0", color: "text-success"    },
            { label: "Total Expense",  value: "₹0", color: "text-brand-red"  },
            { label: "Net Balance",    value: "₹0", color: "text-brand-blue" },
            { label: "This Month",     value: "₹0", color: "text-warning"    },
          ].map((c) => (
            <div key={c.label} className="bg-white rounded-xl border border-border-soft p-5 shadow-sm">
              <p className="text-[11px] font-medium text-text-muted uppercase tracking-wider">{c.label}</p>
              <p className={`text-2xl font-bold mt-2 tracking-tight ${c.color}`}>{c.value}</p>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-xl border border-border-soft shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-soft bg-surface-2">
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Type</th>
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Category</th>
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Amount</th>
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Date</th>
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Notes</th>
              </tr>
            </thead>
            <tbody>
              <tr><td colSpan={5} className="py-16 text-center text-sm text-text-muted">No transactions recorded yet.</td></tr>
            </tbody>
          </table>
        </div>
      </PageShell>
    </DashboardLayout>
  );
}
