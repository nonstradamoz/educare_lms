"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { ExamTabs } from "@/components/exam/exam-tabs";
import { Database, Plus, Search, Pencil, Trash2, X, ChevronDown, Image as ImageIcon } from "lucide-react";
import { FileUploader } from "@/components/upload/file-uploader";
import { fetchApi } from "@/lib/api";

const DIFFICULTY = ["Easy", "Medium", "Hard"];

interface Question {
  id: string;
  question: string;
  imageUrl?: string;
  options: string[];
  correct: number;
  classLevel: string;
  subject: string;
  topic: string;
  difficulty: string;
}

export function QuestionsClient({ initialQuestions, initialSubjects, initialClasses, initialTopics }: { initialQuestions: Question[], initialSubjects: any[], initialClasses: any[], initialTopics: any[] }) {
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [subjects, setSubjects] = useState<any[]>(initialSubjects);
  const [classes, setClasses] = useState<any[]>(initialClasses);
  const [topics, setTopics] = useState<any[]>(initialTopics);

  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [filterClass, setFilterClass] = useState("All");
  const [filterSubject, setFilterSubject] = useState("All");
  const [filterTopic, setFilterTopic] = useState("All");

  const filtered = questions.filter((q) => {
    const matchSearch = q.question.toLowerCase().includes(search.toLowerCase());
    const matchClass = filterClass === "All" || filterClass === "Class (All)" || q.classLevel === filterClass;
    const matchSubject = filterSubject === "All" || filterSubject === "Subject (All)" || q.subject === filterSubject;
    const matchTopic = filterTopic === "All" || filterTopic === "Topic (All)" || q.topic === filterTopic;
    return matchSearch && matchClass && matchSubject && matchTopic;
  });

  const deleteQ = async (id: string) => {
    try {
      await fetchApi(`/exams/questions/mcq/${id}`, { method: 'DELETE' });
      setQuestions((prev) => prev.filter((q) => q.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <DashboardLayout title="Question Bank">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between px-6 lg:px-8 py-5 border-b border-border-soft bg-white">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-brand-blue/8 flex items-center justify-center">
              <Database className="h-4.5 w-4.5 text-brand-blue" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-text-primary">Question Bank</h2>
              <p className="text-xs text-text-muted mt-0.5">{questions.length} questions · Grouped by subject</p>
            </div>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-blue px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-brand-blue-dark transition-colors"
          >
            <Plus className="h-3.5 w-3.5" /> Add Question
          </button>
        </div>

        <ExamTabs />

        <div className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-4">
          {/* Toolbar */}
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-muted" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                type="search"
                placeholder="Search questions..."
                className="w-full h-9 rounded-lg border border-border-soft bg-white pl-9 pr-3 text-sm placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-blue/25"
              />
            </div>
            <div className="relative shrink-0">
              <select
                value={filterClass}
                onChange={(e) => setFilterClass(e.target.value)}
                className="h-9 w-32 appearance-none rounded-lg border border-border-soft bg-white pl-3 pr-8 text-sm text-text-secondary focus:outline-none focus:ring-2 focus:ring-brand-blue/25"
              >
                <option>Class (All)</option>
                {classes.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 top-2.5 h-4 w-4 text-text-muted" />
            </div>
            <div className="relative shrink-0">
              <select
                value={filterSubject}
                onChange={(e) => setFilterSubject(e.target.value)}
                className="h-9 w-32 appearance-none rounded-lg border border-border-soft bg-white pl-3 pr-8 text-sm text-text-secondary focus:outline-none focus:ring-2 focus:ring-brand-blue/25"
              >
                <option>Subject (All)</option>
                {subjects.map((s) => <option key={s.id} value={s.name}>{s.name}</option>)}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 top-2.5 h-4 w-4 text-text-muted" />
            </div>
            <div className="relative shrink-0">
              <select
                value={filterTopic}
                onChange={(e) => setFilterTopic(e.target.value)}
                className="h-9 w-32 appearance-none rounded-lg border border-border-soft bg-white pl-3 pr-8 text-sm text-text-secondary focus:outline-none focus:ring-2 focus:ring-brand-blue/25"
              >
                <option>Topic (All)</option>
                {topics.map((t) => <option key={t.id} value={t.name}>{t.name}</option>)}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 top-2.5 h-4 w-4 text-text-muted" />
            </div>
          </div>

          {/* Question list */}
          <div className="space-y-3">
            {filtered.length === 0 && (
              <div className="bg-white rounded-xl border border-border-soft p-12 text-center text-sm text-text-muted">
                No questions found. Add your first question to get started.
              </div>
            )}
            {filtered.map((q, i) => (
              <div key={q.id} className="bg-white rounded-xl border border-border-soft shadow-sm p-5 group">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center flex-wrap gap-2 mb-2">
                      <span className="text-[10px] font-bold text-text-muted">{String(i + 1).padStart(2, "0")}</span>
                      <span className="rounded-full bg-surface-2 border border-border-soft px-2 py-0.5 text-[10px] font-semibold text-text-secondary">{q.classLevel}</span>
                      <span className="rounded-full bg-brand-blue/8 px-2 py-0.5 text-[10px] font-semibold text-brand-blue">{q.subject}</span>
                      <span className="rounded-full bg-surface-2 border border-border-soft px-2 py-0.5 text-[10px] font-semibold text-text-secondary">{q.topic}</span>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        q.difficulty === "Easy" ? "bg-success/8 text-success" :
                        q.difficulty === "Medium" ? "bg-warning/8 text-warning" :
                        "bg-brand-red/8 text-brand-red"
                      }`}>{q.difficulty}</span>
                    </div>
                    <p className="text-sm font-medium text-text-primary mb-3">{q.question}</p>
                    {q.imageUrl && (
                      <div className="mb-4 rounded-lg border border-border-soft p-1 w-max">
                        <img src={q.imageUrl} alt="Question figure" className="h-32 object-contain rounded" />
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-2">
                      {q.options.map((opt, j) => (
                        <div
                          key={j}
                          className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs ${
                            j === q.correct
                              ? "bg-success/8 border border-success/20 text-success font-semibold"
                              : "bg-surface-2 border border-border-soft text-text-secondary"
                          }`}
                        >
                          <span className={`h-4 w-4 rounded-full border text-[9px] flex items-center justify-center font-bold shrink-0 ${
                            j === q.correct ? "border-success bg-success text-white" : "border-border-soft"
                          }`}>
                            {String.fromCharCode(65 + j)}
                          </span>
                          {opt}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 rounded-lg hover:bg-surface-2 text-text-muted hover:text-brand-blue transition-colors">
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={() => deleteQ(q.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-text-muted hover:text-brand-red transition-colors">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showModal && <AddQuestionModal onClose={() => setShowModal(false)} onAdd={(q) => { setQuestions((p) => [...p, q]); setShowModal(false); }} subjects={subjects} classes={classes} topics={topics} />}
    </DashboardLayout>
  );
}

/* ── Add Question Modal ── */
function AddQuestionModal({ onClose, onAdd, subjects, classes, topics }: { onClose: () => void; onAdd: (q: Question) => void; subjects: any[]; classes: any[]; topics: any[] }) {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correct, setCorrect] = useState(0);
  const [classLevel, setClassLevel] = useState(classes[0]?.name || "");
  const [subject, setSubject] = useState(subjects[0]?.name || "");
  const [topic, setTopic] = useState(topics[0]?.name || "");
  const [difficulty, setDifficulty] = useState(DIFFICULTY[0]);
  const [imageUrl, setImageUrl] = useState("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const updateOption = (i: number, val: string) => {
    const next = [...options];
    next[i] = val;
    setOptions(next);
  };

  const handleSave = () => {
    if (!question || options.some((o) => !o)) return;
    onAdd({
      id: `q${Date.now()}`,
      question,
      imageUrl: imageUrl || undefined,
      options,
      correct,
      classLevel,
      subject,
      topic,
      difficulty,
    });
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-border-soft overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-soft shrink-0">
          <h3 className="text-sm font-semibold text-text-primary">Add Question</h3>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary"><X className="h-4 w-4" /></button>
        </div>
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* Metadata */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1.5">Class</label>
              <select value={classLevel} onChange={(e) => setClassLevel(e.target.value)} className="w-full h-9 rounded-lg border border-border-soft bg-surface-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/25">
                {classes.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1.5">Subject</label>
              <select value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full h-9 rounded-lg border border-border-soft bg-surface-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/25">
                {subjects.map((s) => <option key={s.id} value={s.name}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1.5">Topic</label>
              <select value={topic} onChange={(e) => setTopic(e.target.value)} className="w-full h-9 rounded-lg border border-border-soft bg-surface-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/25">
                {topics.map((t) => <option key={t.id} value={t.name}>{t.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1.5">Difficulty</label>
              <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="w-full h-9 rounded-lg border border-border-soft bg-surface-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/25">
                {DIFFICULTY.map((d) => <option key={d}>{d}</option>)}
              </select>
            </div>
          </div>
          {/* Question */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-text-secondary">Question</label>
              <button 
                onClick={() => setIsUploadingImage(!isUploadingImage)}
                className={`p-1.5 rounded-lg transition-colors text-xs font-medium flex items-center gap-1 ${imageUrl || isUploadingImage ? 'bg-brand-blue/10 text-brand-blue' : 'text-text-muted hover:bg-surface-2'}`}
              >
                <ImageIcon className="h-3.5 w-3.5" /> Image
              </button>
            </div>
            
            {isUploadingImage && !imageUrl && (
              <FileUploader 
                type="FILE"
                onUploadSuccess={(url) => {
                  setImageUrl(url);
                  setIsUploadingImage(false);
                }}
                onUploadError={(e) => alert(e)}
                onCancel={() => setIsUploadingImage(false)}
              />
            )}

            {imageUrl && (
              <div className="relative rounded-lg border border-border-soft p-1 w-max group">
                <img src={imageUrl} alt="Question figure" className="h-32 object-contain rounded" />
                <button 
                  onClick={() => setImageUrl("")}
                  className="absolute top-2 right-2 p-1 bg-white rounded shadow-sm text-brand-red opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            )}

            <textarea value={question} onChange={(e) => setQuestion(e.target.value)} rows={3} placeholder="Enter the question..." className="w-full rounded-lg border border-border-soft bg-surface-2 px-3 py-2 text-sm placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-blue/25 resize-none" />
          </div>
          {/* Options */}
          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-2">Answer Options <span className="text-text-muted font-normal">(select the correct one)</span></label>
            <div className="space-y-2">
              {options.map((opt, i) => (
                <div key={i} className={`flex items-center gap-2 rounded-lg border px-3 py-2 ${correct === i ? "border-success/40 bg-success/5" : "border-border-soft bg-surface-2"}`}>
                  <button type="button" onClick={() => setCorrect(i)} className={`h-5 w-5 rounded-full border-2 shrink-0 flex items-center justify-center text-[9px] font-bold transition-colors ${correct === i ? "border-success bg-success text-white" : "border-border-soft text-text-muted"}`}>
                    {String.fromCharCode(65 + i)}
                  </button>
                  <input value={opt} onChange={(e) => updateOption(i, e.target.value)} placeholder={`Option ${String.fromCharCode(65 + i)}`} className="flex-1 bg-transparent text-sm placeholder:text-text-muted focus:outline-none" />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border-soft bg-surface-2 shrink-0">
          <button onClick={onClose} className="text-xs font-semibold text-text-secondary hover:text-text-primary transition-colors">Cancel</button>
          <button onClick={handleSave} className="inline-flex items-center gap-2 rounded-lg bg-brand-blue px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-brand-blue-dark transition-colors">
            <Database className="h-3.5 w-3.5" /> Save Question
          </button>
        </div>
      </div>
    </div>
  );
}
