"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { ExamTabs } from "@/components/exam/exam-tabs";
import { Layers, Play, Clock, FileText, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { fetchApi } from "@/lib/api";

const diffStyle: Record<string, string> = {
  Easy:   "bg-success/8 text-success border-success/20",
  Medium: "bg-warning/8 text-warning border-warning/20",
  Hard:   "bg-brand-red/8 text-brand-red border-brand-red/20",
};

export default function MockTestPage() {
  const [tests, setTests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchMocks() {
      try {
        const data = await fetchApi<any[]>("/exams");
        // filter for MOCK_TEST if API returns all
        const mockTests = data.filter((e: any) => e.examType === "MOCK_TEST");
        setTests(mockTests);
      } catch (error) {
        console.error("Failed to fetch mock tests", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchMocks();
  }, []);

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
          {isLoading ? (
             <div className="text-sm text-text-muted text-center py-10">Loading mock tests...</div>
          ) : tests.length === 0 ? (
             <div className="text-sm text-text-muted text-center py-10">No mock tests found. Create one to get started.</div>
          ) : (
            tests.map((test) => (
              <div key={test.id} className="bg-white rounded-xl border border-border-soft shadow-sm p-5 flex items-center gap-5 hover:shadow-md transition-shadow">
                <div className="h-10 w-10 shrink-0 rounded-xl bg-success/8 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-text-primary truncate">{test.title}</p>
                    <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${diffStyle[test.difficulty || "Medium"]}`}>{test.difficulty || "Medium"}</span>
                  </div>
                  <p className="text-xs text-text-muted mt-0.5">{test.subject?.name || "Subject"}</p>
                  <div className="flex items-center gap-4 mt-2 text-[11px] text-text-muted">
                    <span className="flex items-center gap-1"><FileText className="h-3 w-3" />{test._count?.questions || 0} questions</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{test.duration || 60} min</span>
                    <span>{test.maxAttempts || 1} attempt{test.maxAttempts !== 1 ? "s" : ""} allowed</span>
                  </div>
                </div>
                <Link href={`/exam/mcq/${test.id}/take`} className="shrink-0 inline-flex items-center gap-2 rounded-lg bg-success px-4 py-2 text-xs font-semibold text-white hover:bg-green-700 transition-colors shadow-sm">
                  <Play className="h-3.5 w-3.5" /> Start Practice
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
