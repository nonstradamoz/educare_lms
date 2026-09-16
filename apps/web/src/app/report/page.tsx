import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { PageShell } from "@/components/layout/page-shell";
import { BarChart2 } from "lucide-react";

export default function ReportPage() {
  return (
    <DashboardLayout title="Report">
      <PageShell title="Reports & Analytics" subtitle="View detailed reports across all modules" icon={BarChart2} accentColor="blue">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            "Student Report", "Fee Report", "Attendance Report",
            "Exam Report", "Income & Expense Report", "SMS Report",
          ].map((r) => (
            <div key={r} className="bg-white rounded-xl border border-border-soft p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-text-primary group-hover:text-brand-blue transition-colors">{r}</p>
                <BarChart2 className="h-4 w-4 text-text-muted group-hover:text-brand-blue transition-colors" />
              </div>
              <p className="text-xs text-text-muted mt-2">Click to generate report</p>
            </div>
          ))}
        </div>
      </PageShell>
    </DashboardLayout>
  );
}
