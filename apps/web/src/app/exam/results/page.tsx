import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { ExamTabs } from "@/components/exam/exam-tabs";
import { Trophy, TrendingUp, Users, CheckCircle2 } from "lucide-react";

const RESULTS = [
  { id: 1, student: "Akshay K.",   exam: "Math Mid-Term",    score: 78, total: 100, pct: 78, status: "Passed",  date: "Sep 14, 2026" },
  { id: 2, student: "Priya M.",    exam: "Physics Test #1",  score: 32, total: 80,  pct: 40, status: "Passed",  date: "Sep 14, 2026" },
  { id: 3, student: "Rahul S.",    exam: "Chemistry Practice",score: 18, total: 60, pct: 30, status: "Failed",  date: "Sep 15, 2026" },
];

export default function ResultsPage() {
  const avgPct = Math.round(RESULTS.reduce((a, r) => a + r.pct, 0) / RESULTS.length);
  const passed = RESULTS.filter((r) => r.status === "Passed").length;

  return (
    <DashboardLayout title="Results">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between px-6 lg:px-8 py-5 border-b border-border-soft bg-white">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-warning/8 flex items-center justify-center">
              <Trophy className="h-4.5 w-4.5 text-warning" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-text-primary">Results & Analytics</h2>
              <p className="text-xs text-text-muted mt-0.5">View scores, pass rates and student performance</p>
            </div>
          </div>
        </div>
        <ExamTabs />
        <div className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Total Attempts",  value: RESULTS.length.toString(), icon: Users,        color: "text-brand-blue bg-brand-blue/8" },
              { label: "Average Score",   value: `${avgPct}%`,               icon: TrendingUp,  color: "text-warning    bg-warning/8"    },
              { label: "Pass Rate",       value: `${Math.round((passed / RESULTS.length) * 100)}%`, icon: CheckCircle2, color: "text-success bg-success/8" },
              { label: "Top Score",       value: "78%",                      icon: Trophy,      color: "text-warning    bg-warning/8"    },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="bg-white rounded-xl border border-border-soft p-5 shadow-sm">
                <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${color} mb-3`}>
                  <Icon className="h-4 w-4" />
                </div>
                <p className="text-2xl font-bold text-text-primary tracking-tight">{value}</p>
                <p className="text-[11px] font-medium text-text-muted mt-1 uppercase tracking-wider">{label}</p>
              </div>
            ))}
          </div>

          {/* Results Table */}
          <div className="bg-white rounded-xl border border-border-soft shadow-sm overflow-hidden">
            <div className="px-5 py-3 border-b border-border-soft">
              <h3 className="text-sm font-semibold text-text-primary">All Results</h3>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface-2">
                  <th className="text-left px-5 py-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider">#</th>
                  <th className="text-left px-5 py-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Student</th>
                  <th className="text-left px-5 py-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Exam</th>
                  <th className="text-left px-5 py-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Score</th>
                  <th className="text-left px-5 py-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Percentage</th>
                  <th className="text-left px-5 py-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Status</th>
                  <th className="text-left px-5 py-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-soft">
                {RESULTS.map((r) => (
                  <tr key={r.id} className="hover:bg-surface-2/50 transition-colors">
                    <td className="px-5 py-3.5 text-xs text-text-muted">{r.id}</td>
                    <td className="px-5 py-3.5 text-sm font-medium text-text-primary">{r.student}</td>
                    <td className="px-5 py-3.5 text-xs text-text-secondary">{r.exam}</td>
                    <td className="px-5 py-3.5 text-xs font-semibold text-text-primary">{r.score}/{r.total}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 max-w-[80px] h-1.5 rounded-full bg-surface-2 overflow-hidden">
                          <div className={`h-full rounded-full ${r.pct >= 40 ? "bg-success" : "bg-brand-red"}`} style={{ width: `${r.pct}%` }} />
                        </div>
                        <span className="text-xs font-semibold text-text-primary">{r.pct}%</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${r.status === "Passed" ? "bg-success/8 text-success border-success/20" : "bg-brand-red/8 text-brand-red border-brand-red/20"}`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-text-muted">{r.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
