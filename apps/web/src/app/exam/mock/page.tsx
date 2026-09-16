import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { ExamTabs } from "@/components/exam/exam-tabs";
import { Layers, Play, Clock, FileText, CheckCircle2 } from "lucide-react";
import Link from "next/link";

const MOCK_TESTS = [
  { id: "mock-1", title: "Mathematics Full Syllabus", subject: "Mathematics", questions: 50, duration: 90, difficulty: "Medium", attempts: 3 },
  { id: "mock-2", title: "Physics Mock Test #1",      subject: "Physics",     questions: 40, duration: 60, difficulty: "Hard",   attempts: 1 },
  { id: "mock-3", title: "Chemistry Practice Test",   subject: "Chemistry",   questions: 30, duration: 45, difficulty: "Easy",   attempts: 5 },
];

const diffStyle: Record<string, string> = {
  Easy:   "bg-success/8 text-success border-success/20",
  Medium: "bg-warning/8 text-warning border-warning/20",
  Hard:   "bg-brand-red/8 text-brand-red border-brand-red/20",
};

export default function MockTestPage() {
  return (
    <DashboardLayout title="Mock Tests">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between px-6 lg:px-8 py-5 border-b border-border-soft bg-white">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-success/8 flex items-center justify-center">
              <CheckCircle2 className="h-4.5 w-4.5 text-success" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-text-primary">Mock Tests</h2>
              <p className="text-xs text-text-muted mt-0.5">Practice tests with instant feedback and explanations</p>
            </div>
          </div>
          <Link href="/exam/mcq/create" className="inline-flex items-center gap-2 rounded-lg bg-brand-blue px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-brand-blue-dark transition-colors">
            <Layers className="h-3.5 w-3.5" /> Create Mock Test
          </Link>
        </div>
        <ExamTabs />
        <div className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-3">
          {MOCK_TESTS.map((test) => (
            <div key={test.id} className="bg-white rounded-xl border border-border-soft shadow-sm p-5 flex items-center gap-5 hover:shadow-md transition-shadow">
              <div className="h-10 w-10 shrink-0 rounded-xl bg-success/8 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-success" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-text-primary truncate">{test.title}</p>
                  <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${diffStyle[test.difficulty]}`}>{test.difficulty}</span>
                </div>
                <p className="text-xs text-text-muted mt-0.5">{test.subject}</p>
                <div className="flex items-center gap-4 mt-2 text-[11px] text-text-muted">
                  <span className="flex items-center gap-1"><FileText className="h-3 w-3" />{test.questions} questions</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{test.duration} min</span>
                  <span>{test.attempts} attempt{test.attempts !== 1 ? "s" : ""} allowed</span>
                </div>
              </div>
              <Link href={`/exam/mcq/${test.id}/take`} className="shrink-0 inline-flex items-center gap-2 rounded-lg bg-success px-4 py-2 text-xs font-semibold text-white hover:bg-green-700 transition-colors shadow-sm">
                <Play className="h-3.5 w-3.5" /> Start Practice
              </Link>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
