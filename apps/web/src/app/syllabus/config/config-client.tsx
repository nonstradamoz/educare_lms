"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { fetchApi } from "@/lib/api";
import { Settings, Save, CheckCircle2 } from "lucide-react";

export function ConfigClient({ initialConfig }: { initialConfig: any }) {
  const [config, setConfig] = useState(initialConfig || {});
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await fetchApi('/syllabus-config', {
        method: 'PUT',
        body: JSON.stringify(config)
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key: string, value: any) => {
    setConfig((prev: any) => ({ ...prev, [key]: value }));
  };

  return (
    <DashboardLayout title="Syllabus Configuration">
      <div className="flex flex-col h-full bg-surface">
        
        {/* Header */}
        <div className="bg-white border-b border-border-soft px-6 lg:px-8 py-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-brand-red/10 flex items-center justify-center">
              <Settings className="h-6 w-6 text-brand-red" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-text-primary">Configuration Rules</h1>
              <p className="text-xs text-text-muted mt-1">Manage thresholds and weights for the Mastery engine</p>
            </div>
          </div>
          <button 
            onClick={handleSave}
            disabled={loading}
            className="flex items-center gap-2 h-10 px-4 rounded-lg bg-text-primary text-white text-sm font-bold shadow-sm hover:bg-black transition-colors disabled:opacity-70"
          >
            {saved ? <CheckCircle2 className="h-4 w-4" /> : <Save className="h-4 w-4" />}
            {saved ? "Saved!" : loading ? "Saving..." : "Save Config"}
          </button>
        </div>

        <div className="px-6 lg:px-8 py-8 space-y-6 flex-1 overflow-y-auto">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Weightages */}
            <div className="bg-white rounded-2xl border border-border-soft p-6 shadow-sm">
              <h2 className="text-sm font-bold text-text-primary mb-4">Calculation Weightages</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-text-secondary mb-1">Lecture Weight (%)</label>
                  <input type="number" value={(config.lectureWeight || 0) * 100} onChange={e => handleChange('lectureWeight', parseFloat(e.target.value) / 100)} className="w-full h-10 rounded-lg border px-3 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-secondary mb-1">Material Weight (%)</label>
                  <input type="number" value={(config.materialWeight || 0) * 100} onChange={e => handleChange('materialWeight', parseFloat(e.target.value) / 100)} className="w-full h-10 rounded-lg border px-3 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-secondary mb-1">Practice Weight (%)</label>
                  <input type="number" value={(config.practiceWeight || 0) * 100} onChange={e => handleChange('practiceWeight', parseFloat(e.target.value) / 100)} className="w-full h-10 rounded-lg border px-3 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-secondary mb-1">Test Weight (%)</label>
                  <input type="number" value={(config.testWeight || 0) * 100} onChange={e => handleChange('testWeight', parseFloat(e.target.value) / 100)} className="w-full h-10 rounded-lg border px-3 text-sm" />
                </div>
              </div>
            </div>

            {/* Mastery Rules */}
            <div className="bg-white rounded-2xl border border-border-soft p-6 shadow-sm">
              <h2 className="text-sm font-bold text-text-primary mb-4">Mastery Engine Rules</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-text-secondary mb-1">Min Completion % to Master</label>
                  <input type="number" value={config.masteryCompletionThreshold || 0} onChange={e => handleChange('masteryCompletionThreshold', parseFloat(e.target.value))} className="w-full h-10 rounded-lg border px-3 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-secondary mb-1">Min Practice Accuracy %</label>
                  <input type="number" value={config.masteryAccuracyThreshold || 0} onChange={e => handleChange('masteryAccuracyThreshold', parseFloat(e.target.value))} className="w-full h-10 rounded-lg border px-3 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-secondary mb-1">Min Test Score %</label>
                  <input type="number" value={config.masteryTestScoreThreshold || 0} onChange={e => handleChange('masteryTestScoreThreshold', parseFloat(e.target.value))} className="w-full h-10 rounded-lg border px-3 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-secondary mb-1">Min Practice Questions Needed</label>
                  <input type="number" value={config.masteryMinQuestions || 0} onChange={e => handleChange('masteryMinQuestions', parseInt(e.target.value))} className="w-full h-10 rounded-lg border px-3 text-sm" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
