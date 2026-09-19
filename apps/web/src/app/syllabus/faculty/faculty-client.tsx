"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { fetchApi } from "@/lib/api";
import { BarChart3, Users, Target, AlertTriangle, Loader2 } from "lucide-react";

export function FacultyClient({ initialBatches }: { initialBatches: any[] }) {
  const [batches] = useState<any[]>(Array.isArray(initialBatches) ? initialBatches : []);
  const [selectedBatch, setSelectedBatch] = useState<string>(batches[0]?.id || "");
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedBatch) return;
    
    setLoading(true);
    fetchApi(`/syllabus/analytics/${selectedBatch}`)
      .then((data: any) => {
        setAnalytics(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedBatch]);

  return (
    <DashboardLayout title="Faculty Analytics">
      <div className="flex flex-col h-full bg-surface">
        
        {/* Header Section */}
        <div className="bg-white border-b border-border-soft px-6 lg:px-8 py-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-brand-blue/10 flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-brand-blue" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-text-primary">Batch Analytics</h1>
              <p className="text-xs text-text-muted mt-1">Track student learning progress and mastery</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={selectedBatch}
              onChange={e => setSelectedBatch(e.target.value)}
              className="h-10 rounded-lg border border-border-soft bg-surface-2 px-4 text-sm font-medium text-text-primary focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-blue/20"
            >
              <option value="" disabled>Select Batch...</option>
              {batches.map(b => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="px-6 lg:px-8 py-8 space-y-6 flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 text-brand-blue animate-spin" />
            </div>
          ) : !analytics ? (
            <div className="text-center py-20 text-text-muted">No analytics available for this batch.</div>
          ) : (
            <div className="space-y-6">
              
              {/* Stat Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl border border-border-soft p-6 shadow-sm flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-brand-blue/10 flex items-center justify-center shrink-0">
                    <Users className="h-5 w-5 text-brand-blue" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-text-secondary">Total Students active</p>
                    <p className="text-2xl font-black text-text-primary">{analytics.totalStudents}</p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-border-soft p-6 shadow-sm flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center shrink-0">
                    <Target className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-text-secondary">Avg. Learning Progress</p>
                    <p className="text-2xl font-black text-text-primary">{analytics.avgLearningProgress}%</p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-border-soft p-6 shadow-sm flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-warning/10 flex items-center justify-center shrink-0">
                    <BarChart3 className="h-5 w-5 text-warning" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-text-secondary">Avg. Mastery Score</p>
                    <p className="text-2xl font-black text-text-primary">{analytics.avgMastery}%</p>
                  </div>
                </div>
              </div>

              {/* Weak Topics */}
              <div className="bg-white rounded-2xl border border-border-soft p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="h-5 w-5 text-brand-red" />
                  <h2 className="text-sm font-bold text-text-primary">Weak Topics (Needs Revision)</h2>
                </div>
                
                {analytics.topWeakTopics?.length === 0 ? (
                  <p className="text-sm text-text-muted">No weak topics detected.</p>
                ) : (
                  <div className="space-y-3">
                    {analytics.topWeakTopics?.map((topic: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-surface-2 border border-border-soft">
                        <span className="text-sm font-bold text-text-primary">{topic.name}</span>
                        <span className="text-xs font-bold text-brand-red bg-brand-red/10 px-2 py-1 rounded-md">{topic.count} students struggling</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
