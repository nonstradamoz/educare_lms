"use client";

import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { ExamTabs } from "@/components/exam/exam-tabs";
import { useRouter } from "next/navigation";
import { FileText, Plus, Trash2, ArrowLeft, Save, Image as ImageIcon } from "lucide-react";
import { FileUploader } from "@/components/upload/file-uploader";

const SUBJECTS = ["Mathematics", "Physics", "Chemistry", "Biology", "English", "History"];
const EXAM_TYPES = [
  { id: "MCQ_EXAM", name: "MCQ Examination" },
  { id: "MOCK_TEST", name: "Mock Test" },
  { id: "QUESTION_BANK", name: "Question Bank" }
];

export default function CreateExamPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [type, setType] = useState(EXAM_TYPES[0].id);
  const [subject, setSubject] = useState(SUBJECTS[0]);
  const [duration, setDuration] = useState("60");
  const [passMark, setPassMark] = useState("40");
  const [instructions, setInstructions] = useState("Read all questions carefully.");
  const [questions, setQuestions] = useState([{ 
    text: "", 
    options: ["", "", "", ""], 
    correct: 0, 
    imageUrl: "", 
    explanation: "",
    isUploadingImage: false 
  }]);

  const [saving, setSaving] = useState(false);

  const addQuestion = () => setQuestions((p) => [...p, { text: "", options: ["", "", "", ""], correct: 0, imageUrl: "", explanation: "", isUploadingImage: false }]);
  const removeQuestion = (i: number) => setQuestions((p) => p.filter((_, idx) => idx !== i));
  const updateQ = (i: number, field: string, val: unknown) => {
    setQuestions((prev) => prev.map((q, idx) => idx === i ? { ...q, [field]: val } : q));
  };
  const updateOption = (qi: number, oi: number, val: string) => {
    setQuestions((prev) => prev.map((q, idx) => {
      if (idx !== qi) return q;
      const opts = [...q.options];
      opts[oi] = val;
      return { ...q, options: opts };
    }));
  };

  const [years, setYears] = useState<any[]>([]);
  useEffect(() => {
    fetchApi<any[]>('/setup/academic-years').then(setYears).catch(console.error);
  }, []);

  const handleSave = async () => {
    if (!title) return alert("Please enter a title");
    setSaving(true);
    try {
      const exam = await fetchApi<any>('/exams', {
        method: 'POST',
        body: JSON.stringify({
          title,
          type,
          academicYearId: years[0]?.id || "dummy",
          subjectId: "dummy"
          // We can attach centreId, boardId, etc here if selected in UI
        })
      });
      
      for (const q of questions) {
        if (!q.text) continue;
        await fetchApi('/exams/mcq', {
          method: 'POST',
          body: JSON.stringify({
            questionText: q.text,
            imageUrl: q.imageUrl || undefined,
            explanation: q.explanation || undefined,
            options: q.options,
            correctOption: q.options[q.correct],
            marks: 1,
            examId: exam.id
          })
        });
      }
      alert('Exam saved successfully!');
      router.push('/exam');
    } catch (e) {
      console.error(e);
      alert('Failed to save exam');
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout title="Create Exam">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between px-6 lg:px-8 py-5 border-b border-border-soft bg-white">
          <div className="flex items-center gap-3">
            <button onClick={() => router.back()} className="p-1.5 rounded-lg hover:bg-surface-2 text-text-muted transition-colors">
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div className="h-9 w-9 rounded-lg bg-brand-blue/8 flex items-center justify-center">
              <FileText className="h-4.5 w-4.5 text-brand-blue" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-text-primary">Create New Exam</h2>
              <p className="text-xs text-text-muted mt-0.5">{questions.length} question{questions.length !== 1 ? "s" : ""} added</p>
            </div>
          </div>
          <button 
            onClick={handleSave} 
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-blue px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-brand-blue-dark transition-colors disabled:opacity-50"
          >
            <Save className="h-3.5 w-3.5" /> {saving ? "Saving..." : "Save Exam"}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="max-w-3xl mx-auto space-y-6">

            {/* Exam Details */}
            <div className="bg-white rounded-xl border border-border-soft shadow-sm p-6 space-y-4">
              <h3 className="text-sm font-semibold text-text-primary border-b border-border-soft pb-3">Exam Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1.5">Exam Title</label>
                  <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Mathematics Mid-Term" className="w-full h-9 rounded-lg border border-border-soft bg-surface-2 px-3 text-sm placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-blue/25 focus:border-brand-blue/50" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1.5">Exam Type</label>
                  <select value={type} onChange={(e) => setType(e.target.value)} className="w-full h-9 rounded-lg border border-border-soft bg-surface-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/25">
                    {EXAM_TYPES.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1.5">Subject</label>
                  <select value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full h-9 rounded-lg border border-border-soft bg-surface-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/25">
                    {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1.5">Duration (minutes)</label>
                  <input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} className="w-full h-9 rounded-lg border border-border-soft bg-surface-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/25" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1.5">Pass Mark (%)</label>
                  <input type="number" value={passMark} onChange={(e) => setPassMark(e.target.value)} className="w-full h-9 rounded-lg border border-border-soft bg-surface-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/25" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1.5">Instructions</label>
                <textarea value={instructions} onChange={(e) => setInstructions(e.target.value)} rows={2} className="w-full rounded-lg border border-border-soft bg-surface-2 px-3 py-2 text-sm placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-blue/25 resize-none" />
              </div>
            </div>

            {/* Questions */}
            <div className="space-y-4">
              {questions.map((q, qi) => (
                <div key={qi} className="bg-white rounded-xl border border-border-soft shadow-sm p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-text-muted">Question {qi + 1}</span>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => updateQ(qi, "isUploadingImage", !q.isUploadingImage)}
                        className={`p-1.5 rounded-lg transition-colors text-xs font-medium flex items-center gap-1 ${q.imageUrl || q.isUploadingImage ? 'bg-brand-blue/10 text-brand-blue' : 'text-text-muted hover:bg-surface-2'}`}
                      >
                        <ImageIcon className="h-3.5 w-3.5" /> Image
                      </button>
                      {questions.length > 1 && (
                        <button onClick={() => removeQuestion(qi)} className="p-1.5 rounded-lg hover:bg-red-50 text-text-muted hover:text-brand-red transition-colors">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {q.isUploadingImage && !q.imageUrl && (
                    <div className="mb-4">
                      <FileUploader 
                        type="FILE"
                        onUploadSuccess={(url) => {
                          updateQ(qi, "imageUrl", url);
                          updateQ(qi, "isUploadingImage", false);
                        }}
                        onUploadError={(e) => alert(e)}
                        onCancel={() => updateQ(qi, "isUploadingImage", false)}
                      />
                    </div>
                  )}

                  {q.imageUrl && (
                    <div className="relative rounded-lg border border-border-soft p-1 w-max mb-4 group">
                      <img src={q.imageUrl} alt="Question figure" className="h-32 object-contain rounded" />
                      <button 
                        onClick={() => updateQ(qi, "imageUrl", "")}
                        className="absolute top-2 right-2 p-1 bg-white rounded shadow-sm text-brand-red opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  )}

                  <textarea
                    value={q.text}
                    onChange={(e) => updateQ(qi, "text", e.target.value)}
                    rows={2}
                    placeholder="Enter your question text here..."
                    className="w-full rounded-lg border border-border-soft bg-surface-2 px-3 py-2 text-sm placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-blue/25 resize-none"
                  />
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {q.options.map((opt, oi) => (
                      <div
                        key={oi}
                        className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 transition-colors ${q.correct === oi ? "border-success/40 bg-success/5 shadow-[0_0_0_1px_rgba(var(--success-rgb),0.1)]" : "border-border-soft bg-surface-2"}`}
                      >
                        <button
                          type="button"
                          onClick={() => updateQ(qi, "correct", oi)}
                          className={`h-5 w-5 rounded-full border-2 shrink-0 flex items-center justify-center text-[9px] font-bold transition-all ${q.correct === oi ? "border-success bg-success text-white" : "border-border-soft text-text-muted hover:border-success/50"}`}
                        >
                          {String.fromCharCode(65 + oi)}
                        </button>
                        <input
                          value={opt}
                          onChange={(e) => updateOption(qi, oi, e.target.value)}
                          placeholder={`Option ${String.fromCharCode(65 + oi)}`}
                          className="flex-1 bg-transparent text-sm placeholder:text-text-muted focus:outline-none"
                        />
                      </div>
                    ))}
                  </div>

                  <div>
                    <input 
                      value={q.explanation || ''} 
                      onChange={(e) => updateQ(qi, "explanation", e.target.value)} 
                      placeholder="Explanation (Optional - shown after test)" 
                      className="w-full h-8 rounded-lg border border-border-soft bg-surface-2 px-3 text-xs placeholder:text-text-muted/60 focus:outline-none focus:ring-1 focus:ring-brand-blue/25" 
                    />
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={addQuestion}
              className="w-full flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border-soft py-4 text-sm font-medium text-text-muted hover:border-brand-blue/40 hover:text-brand-blue hover:bg-brand-blue/5 transition-all bg-white"
            >
              <Plus className="h-4 w-4" /> Add Next Question
            </button>

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
