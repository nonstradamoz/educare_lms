"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { fetchApi } from "@/lib/api";
import { BookOpenCheck, CheckCircle2, ChevronRight, AlertTriangle, Clock, RefreshCw, Loader2, PlayCircle } from "lucide-react";
import Link from "next/link";

export function StudentClient({ initialBatchId, studentId }: { initialBatchId: string, studentId: string }) {
  const [syllabusTree, setSyllabusTree] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!initialBatchId || !studentId) return;
    
    setLoading(true);
    fetchApi(`/syllabus/student-progress/${initialBatchId}/${studentId}`)
      .then((data: any) => {
        setSyllabusTree(Array.isArray(data) ? data : []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [initialBatchId, studentId]);

  // Aggregate stats
  let totalTopics = 0;
  let completedTopics = 0;
  let masteredTopics = 0;
  let weakTopics: any[] = [];
  let revisionsDue: any[] = [];

  syllabusTree.forEach(subj => {
    subj.chapters.forEach((chap: any) => {
      chap.topics.forEach((t: any) => {
        totalTopics++;
        const prog = t.studentProgress?.[0];
        if (prog?.status === 'COMPLETED') completedTopics++;
        if (prog?.status === 'MASTERED') {
          completedTopics++;
          masteredTopics++;
        }
        if (prog?.status === 'REVISION_REQUIRED' || (prog?.practiceAccuracy < 60 && prog?.questionsAttempted > 0)) {
          weakTopics.push({ ...t, subjectName: subj.subject.name });
        }
        
        const rev = t.revisionTasks?.find((r: any) => r.status === 'DUE');
        if (rev) {
          revisionsDue.push({ ...t, subjectName: subj.subject.name });
        }
      });
    });
  });

  const percentage = totalTopics === 0 ? 0 : Math.round((completedTopics / totalTopics) * 100);

  return (
    <DashboardLayout title="My Progress">
      <div className="flex flex-col h-full bg-surface">
        
        {/* Header Section */}
        <div className="bg-white border-b border-border-soft px-6 lg:px-8 py-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-brand-blue/10 flex items-center justify-center">
              <BookOpenCheck className="h-6 w-6 text-brand-blue" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-text-primary">My Syllabus Progress</h1>
              <p className="text-xs text-text-muted mt-1">Track your learning, mastery, and revisions</p>
            </div>
          </div>
        </div>

        <div className="px-6 lg:px-8 py-8 space-y-6 flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 text-brand-blue animate-spin" />
            </div>
          ) : (
            <>
              {/* Top Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                
                {/* Overall Progress Circle */}
                <div className="bg-white rounded-2xl border border-border-soft shadow-sm p-6 flex flex-col items-center justify-center text-center col-span-1 md:col-span-1">
                  <div className="relative h-28 w-28 mb-4">
                    <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" className="stroke-surface-2" strokeWidth="8" fill="none" />
                      <circle cx="50" cy="50" r="40" className="stroke-brand-blue transition-all duration-1000 ease-out" strokeWidth="8" fill="none" strokeLinecap="round" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * percentage) / 100} />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-black text-text-primary">{percentage}%</span>
                    </div>
                  </div>
                  <h2 className="text-sm font-bold text-text-primary">Overall Progress</h2>
                  <p className="text-xs text-text-secondary mt-1">{completedTopics} of {totalTopics} completed</p>
                </div>

                {/* Sub Stats */}
                <div className="col-span-1 md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-6">
                  
                  <div className="bg-white rounded-2xl border border-border-soft p-6 shadow-sm flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-8 w-8 rounded-full bg-success/10 flex items-center justify-center">
                        <CheckCircle2 className="h-4 w-4 text-success" />
                      </div>
                      <h3 className="text-sm font-bold text-text-secondary">Mastered Topics</h3>
                    </div>
                    <p className="text-3xl font-black text-text-primary">{masteredTopics}</p>
                  </div>

                  <div className="bg-white rounded-2xl border border-border-soft p-6 shadow-sm flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-8 w-8 rounded-full bg-brand-red/10 flex items-center justify-center">
                        <AlertTriangle className="h-4 w-4 text-brand-red" />
                      </div>
                      <h3 className="text-sm font-bold text-text-secondary">Needs Attention</h3>
                    </div>
                    <p className="text-3xl font-black text-text-primary">{weakTopics.length}</p>
                  </div>

                  <div className="bg-white rounded-2xl border border-border-soft p-6 shadow-sm flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-8 w-8 rounded-full bg-warning/10 flex items-center justify-center">
                        <RefreshCw className="h-4 w-4 text-warning" />
                      </div>
                      <h3 className="text-sm font-bold text-text-secondary">Revisions Due</h3>
                    </div>
                    <p className="text-3xl font-black text-text-primary">{revisionsDue.length}</p>
                  </div>

                </div>
              </div>

              {/* Action Items */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Needs Attention */}
                <div className="bg-white rounded-2xl border border-border-soft p-6 shadow-sm flex flex-col">
                  <div className="flex items-center gap-2 mb-4">
                    <AlertTriangle className="h-5 w-5 text-brand-red" />
                    <h2 className="text-sm font-bold text-text-primary">Weak Topics</h2>
                  </div>
                  {weakTopics.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center text-sm text-text-muted">You have no weak topics right now. Keep it up!</div>
                  ) : (
                    <div className="space-y-3">
                      {weakTopics.slice(0, 5).map((topic, i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-surface-2 border border-border-soft">
                          <div>
                            <p className="text-xs text-text-muted font-medium mb-0.5">{topic.subjectName}</p>
                            <p className="text-sm font-bold text-text-primary">{topic.name}</p>
                          </div>
                          <Link href={`/estudy`} className="h-8 w-8 rounded-full bg-white border shadow-sm flex items-center justify-center hover:bg-brand-red hover:text-white hover:border-brand-red transition-colors">
                            <PlayCircle className="h-4 w-4" />
                          </Link>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Revisions Due */}
                <div className="bg-white rounded-2xl border border-border-soft p-6 shadow-sm flex flex-col">
                  <div className="flex items-center gap-2 mb-4">
                    <Clock className="h-5 w-5 text-warning" />
                    <h2 className="text-sm font-bold text-text-primary">Revisions Due</h2>
                  </div>
                  {revisionsDue.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center text-sm text-text-muted">No revisions due today.</div>
                  ) : (
                    <div className="space-y-3">
                      {revisionsDue.slice(0, 5).map((topic, i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-surface-2 border border-border-soft">
                          <div>
                            <p className="text-xs text-text-muted font-medium mb-0.5">{topic.subjectName}</p>
                            <p className="text-sm font-bold text-text-primary">{topic.name}</p>
                          </div>
                          <Link href={`/estudy`} className="h-8 w-8 rounded-full bg-white border shadow-sm flex items-center justify-center hover:bg-warning hover:text-white hover:border-warning transition-colors">
                            <RefreshCw className="h-4 w-4" />
                          </Link>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>

              {/* Subject Breakdown */}
              <div className="space-y-4">
                <h2 className="text-sm font-bold text-text-primary mb-2 mt-4">Subject Progress</h2>
                {syllabusTree.map(subject => {
                  let subTotal = 0;
                  let subComp = 0;
                  subject.chapters.forEach((c: any) => c.topics.forEach((t: any) => {
                    subTotal++;
                    if (t.studentProgress?.[0]?.status === 'COMPLETED' || t.studentProgress?.[0]?.status === 'MASTERED') subComp++;
                  }));
                  const subPct = subTotal === 0 ? 0 : Math.round((subComp / subTotal) * 100);

                  return (
                    <div key={subject.subject.id} className="bg-white rounded-2xl border border-border-soft p-5 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base font-bold text-text-primary">{subject.subject.name}</h3>
                        <span className="text-sm font-bold text-brand-blue">{subPct}%</span>
                      </div>
                      
                      <div className="w-full bg-surface-2 rounded-full h-2.5 mb-6">
                        <div className="bg-brand-blue h-2.5 rounded-full transition-all" style={{ width: `${subPct}%` }}></div>
                      </div>

                      {/* Chapters Preview */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {subject.chapters.map((chap: any) => {
                          let cTotal = chap.topics.length;
                          let cComp = chap.topics.filter((t: any) => t.studentProgress?.[0]?.status === 'COMPLETED' || t.studentProgress?.[0]?.status === 'MASTERED').length;
                          const cPct = cTotal === 0 ? 0 : Math.round((cComp / cTotal) * 100);
                          
                          return (
                            <div key={chap.id} className="p-3 rounded-xl border border-border-soft bg-surface-2/50 flex flex-col justify-between hover:border-brand-blue/30 hover:bg-brand-blue/5 transition-colors cursor-pointer">
                              <h4 className="text-sm font-bold text-text-secondary truncate mb-3">{chap.name}</h4>
                              <div className="flex items-center gap-3">
                                <div className="flex-1 bg-white rounded-full h-1.5 overflow-hidden">
                                  <div className="bg-text-secondary h-full" style={{ width: `${cPct}%` }}></div>
                                </div>
                                <span className="text-[10px] font-bold text-text-muted">{cPct}%</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                    </div>
                  );
                })}
              </div>

            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
