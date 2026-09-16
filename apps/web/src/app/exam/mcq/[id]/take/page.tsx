"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Clock, AlertCircle, ChevronRight, ChevronLeft, CheckCircle2 } from "lucide-react";

// Sample exam data — in Phase 2 this will come from the API
const EXAM = {
  id: "exam-1",
  title: "Mathematics Mid-Term Exam",
  subject: "Mathematics",
  duration: 30, // minutes (shortened for demo)
  instructions: "Read all questions carefully. Each question carries equal marks. There is no negative marking.",
  questions: [
    { id: "q1", text: "What is the value of π (pi) to 2 decimal places?", options: ["3.12", "3.14", "3.16", "3.18"], correct: 1 },
    { id: "q2", text: "What is 12 × 13?", options: ["144", "152", "156", "160"], correct: 2 },
    { id: "q3", text: "What is the square root of 144?", options: ["10", "11", "12", "13"], correct: 2 },
    { id: "q4", text: "Which of the following is a prime number?", options: ["21", "27", "31", "35"], correct: 2 },
    { id: "q5", text: "What is 15% of 200?", options: ["20", "25", "30", "35"], correct: 2 },
  ],
};

export default function TakeExamPage() {
  const router = useRouter();
  const [started, setStarted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(EXAM.questions.length).fill(null));
  const [timeLeft, setTimeLeft] = useState(EXAM.duration * 60);
  const [submitted, setSubmitted] = useState(false);

  const submit = useCallback(() => setSubmitted(true), []);

  useEffect(() => {
    if (!started || submitted) return;
    const t = setInterval(() => {
      setTimeLeft((p) => {
        if (p <= 1) { submit(); return 0; }
        return p - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [started, submitted, submit]);

  const mm = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const ss = String(timeLeft % 60).padStart(2, "0");
  const isUrgent = timeLeft < 5 * 60;

  const select = (i: number) => {
    if (submitted) return;
    setAnswers((prev) => { const n = [...prev]; n[current] = i; return n; });
  };

  const score = answers.reduce((acc, ans, i) => acc + (ans === EXAM.questions[i].correct ? 1 : 0), 0);
  const pct = Math.round((score / EXAM.questions.length) * 100);
  const passed = pct >= 40;

  /* ── Results ── */
  if (submitted) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-2xl border border-border-soft shadow-lg overflow-hidden">
          <div className={`p-8 text-center ${passed ? "bg-success/5" : "bg-brand-red/5"}`}>
            <div className={`h-20 w-20 rounded-full mx-auto flex items-center justify-center mb-4 ${passed ? "bg-success/10" : "bg-brand-red/10"}`}>
              <CheckCircle2 className={`h-10 w-10 ${passed ? "text-success" : "text-brand-red"}`} />
            </div>
            <p className="text-4xl font-bold tracking-tight text-text-primary">{pct}%</p>
            <p className={`text-sm font-semibold mt-1 ${passed ? "text-success" : "text-brand-red"}`}>
              {passed ? "Passed 🎉" : "Failed"}
            </p>
            <p className="text-xs text-text-muted mt-1">{score} / {EXAM.questions.length} correct</p>
          </div>
          <div className="p-6 space-y-3">
            {EXAM.questions.map((q, i) => {
              const a = answers[i];
              const correct = a === q.correct;
              return (
                <div key={q.id} className={`rounded-lg p-3 border ${correct ? "border-success/20 bg-success/5" : "border-brand-red/20 bg-brand-red/5"}`}>
                  <p className="text-xs font-medium text-text-primary mb-1.5">{i + 1}. {q.text}</p>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className={correct ? "text-success" : "text-brand-red"}>
                      Your answer: {a !== null ? q.options[a] : "Not answered"}
                    </span>
                    {!correct && <span className="text-success">Correct: {q.options[q.correct]}</span>}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="px-6 pb-6">
            <button onClick={() => router.push("/exam")} className="w-full rounded-lg bg-brand-blue py-2.5 text-sm font-semibold text-white hover:bg-brand-blue-dark transition-colors">
              Back to Exams
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── Instructions ── */
  if (!started) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-2xl border border-border-soft shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-brand-blue-dark to-brand-blue p-6">
            <p className="text-white/70 text-xs mb-1">{EXAM.subject}</p>
            <h1 className="text-lg font-bold text-white">{EXAM.title}</h1>
            <div className="flex items-center gap-4 mt-3 text-white/70 text-xs">
              <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{EXAM.duration} minutes</span>
              <span>{EXAM.questions.length} questions</span>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div className="rounded-lg bg-surface-2 border border-border-soft p-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-brand-blue shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-text-primary mb-1">Instructions</p>
                  <p className="text-xs text-text-secondary leading-relaxed">{EXAM.instructions}</p>
                </div>
              </div>
            </div>
            <button onClick={() => setStarted(true)} className="w-full rounded-lg bg-brand-blue py-3 text-sm font-semibold text-white hover:bg-brand-blue-dark transition-colors shadow-sm">
              Start Exam
            </button>
            <button onClick={() => router.back()} className="w-full text-xs font-medium text-text-muted hover:text-text-primary transition-colors">
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── Exam UI ── */
  const q = EXAM.questions[current];
  const answered = answers.filter((a) => a !== null).length;

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* Top bar */}
      <div className="bg-white border-b border-border-soft px-6 py-3 flex items-center justify-between sticky top-0 z-10">
        <div>
          <p className="text-sm font-semibold text-text-primary">{EXAM.title}</p>
          <p className="text-xs text-text-muted">Question {current + 1} of {EXAM.questions.length}</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-text-muted">{answered}/{EXAM.questions.length} answered</span>
          <div className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold border ${isUrgent ? "bg-brand-red/10 border-brand-red/25 text-brand-red" : "bg-brand-blue/8 border-brand-blue/20 text-brand-blue"}`}>
            <Clock className="h-3.5 w-3.5" />
            {mm}:{ss}
          </div>
        </div>
      </div>

      {/* Question palette */}
      <div className="border-b border-border-soft bg-white px-6 py-3 flex items-center gap-2 overflow-x-auto">
        {EXAM.questions.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-7 w-7 rounded text-xs font-semibold shrink-0 transition-colors ${
              i === current ? "bg-brand-blue text-white" :
              answers[i] !== null ? "bg-success/15 text-success border border-success/30" :
              "bg-surface-2 text-text-muted border border-border-soft hover:border-brand-blue/40"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Question body */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl space-y-5">
          <div className="bg-white rounded-2xl border border-border-soft shadow-sm p-6">
            <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wider mb-3">Question {current + 1}</p>
            <p className="text-base font-medium text-text-primary leading-relaxed">{q.text}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {q.options.map((opt, i) => {
              const selected = answers[current] === i;
              return (
                <button
                  key={i}
                  onClick={() => select(i)}
                  className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-all hover:shadow-sm ${
                    selected
                      ? "border-brand-blue bg-brand-blue/5 shadow-sm"
                      : "border-border-soft bg-white hover:border-brand-blue/30"
                  }`}
                >
                  <span className={`h-7 w-7 rounded-full border-2 flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${selected ? "border-brand-blue bg-brand-blue text-white" : "border-border-soft text-text-muted"}`}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className={`text-sm ${selected ? "font-semibold text-brand-blue" : "text-text-secondary"}`}>{opt}</span>
                </button>
              );
            })}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button onClick={() => setCurrent((p) => Math.max(0, p - 1))} disabled={current === 0} className="inline-flex items-center gap-2 rounded-lg border border-border-soft bg-white px-4 py-2 text-xs font-medium text-text-secondary hover:bg-surface-2 disabled:opacity-40 transition-colors">
              <ChevronLeft className="h-3.5 w-3.5" /> Previous
            </button>
            {current < EXAM.questions.length - 1 ? (
              <button onClick={() => setCurrent((p) => Math.min(EXAM.questions.length - 1, p + 1))} className="inline-flex items-center gap-2 rounded-lg bg-brand-blue px-4 py-2 text-xs font-medium text-white hover:bg-brand-blue-dark transition-colors">
                Next <ChevronRight className="h-3.5 w-3.5" />
              </button>
            ) : (
              <button onClick={submit} className="inline-flex items-center gap-2 rounded-lg bg-success px-5 py-2 text-xs font-semibold text-white hover:bg-green-700 transition-colors shadow-sm">
                <CheckCircle2 className="h-3.5 w-3.5" /> Submit Exam
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
