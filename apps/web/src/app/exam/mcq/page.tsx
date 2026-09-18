"use client";

import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { ExamTabs } from "@/components/exam/exam-tabs";
import Link from "next/link";
import { Layers, Plus, Clock, FileText, Users, MoreVertical, Play, Eye } from "lucide-react";

interface Exam {
  id: string;
  title: string;
  subject: string;
  questions: number;
  duration: number;
  totalMarks: number;
  status: "draft" | "active" | "ended";
  attempts: number;
  createdAt: string;
}

const SAMPLE_EXAMS: Exam[] = [
  {
    id: "exam-1",
    title: "Mathematics Mid-Term Exam",
    subject: "Mathematics",
    questions: 30,
    duration: 60,
    totalMarks: 100,
    status: "active",
    attempts: 0,
    createdAt: "Sep 14, 2026",
  },
  {
    id: "exam-2",
    title: "Physics Chapter 1 Test",
    subject: "Physics",
    questions: 20,
    duration: 40,
    totalMarks: 80,
    status: "draft",
    attempts: 0,
    createdAt: "Sep 15, 2026",
  },
];

const statusStyle: Record<string, string> = {
  active: "bg-success/10 text-success border-success/20",
  draft:  "bg-warning/10 text-warning border-warning/20",
  ended:  "bg-surface-2 text-text-muted border-border-soft",
};

export default function MCQExamPage() {
  const [exams, setExams] = useState<any[]>([]);

  useEffect(() => {
    fetchApi<any[]>('/exams').then(data => setExams(data)).catch(console.error);
  }, []);

  return (
    <DashboardLayout title="MCQ Exams">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between px-6 lg:px-8 py-5 border-b border-border-soft bg-white">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-brand-red/8 flex items-center justify-center">
              <Layers className="h-4.5 w-4.5 text-brand-red" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-text-primary">MCQ Exams</h2>
              <p className="text-xs text-text-muted mt-0.5">{exams.length} exams created</p>
            </div>
          </div>
          <Link
            href="/exam/mcq/create"
            className="inline-flex items-center gap-2 rounded-lg bg-brand-blue px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-brand-blue-dark transition-colors"
          >
            <Plus className="h-3.5 w-3.5" /> Create Exam
          </Link>
        </div>

        <ExamTabs />

        <div className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-3">
          {exams.map((exam) => (
            <div key={exam.id} className="bg-white rounded-xl border border-border-soft shadow-sm p-5 flex items-center gap-5 group hover:shadow-md transition-shadow">
              <div className="h-10 w-10 shrink-0 rounded-xl bg-brand-blue/8 flex items-center justify-center">
                <FileText className="h-5 w-5 text-brand-blue" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-text-primary truncate">{exam.title}</p>
                  {exam.targetTrack && exam.targetTrack !== "BOTH" && (
                    <span className="shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase bg-brand-blue/10 text-brand-blue border-brand-blue/20">
                      {exam.targetTrack}
                    </span>
                  )}
                  <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold capitalize ${statusStyle[exam.status || "active"]}`}>
                    {exam.status || "active"}
                  </span>
                </div>
                <p className="text-xs text-text-muted mt-0.5">{exam.subject}</p>
                <div className="flex items-center gap-4 mt-2 text-[11px] text-text-muted">
                  <span className="flex items-center gap-1"><FileText className="h-3 w-3" />{exam.questions} questions</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{exam.duration} min</span>
                  <span className="flex items-center gap-1"><Users className="h-3 w-3" />{exam.attempts} attempts</span>
                  <span>Created {exam.createdAt}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href={`/exam/mcq/${exam.id}/preview`}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border-soft bg-white px-3 py-1.5 text-xs font-medium text-text-secondary hover:bg-surface-2 transition-colors"
                >
                  <Eye className="h-3.5 w-3.5" /> Preview
                </Link>
                <Link
                  href={`/exam/mcq/${exam.id}/take`}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-brand-blue px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-blue-dark transition-colors"
                >
                  <Play className="h-3.5 w-3.5" /> Start
                </Link>
                <button className="p-1.5 rounded-lg hover:bg-surface-2 text-text-muted transition-colors">
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
