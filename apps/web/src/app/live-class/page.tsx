"use client";

import { useState } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { JitsiMeet } from "@/components/live-class/jitsi-meet";
import {
  Video,
  Plus,
  Calendar,
  Clock,
  Users,
  Play,
  X,
  Wifi,
  BookOpen,
} from "lucide-react";

/* ── Types ── */
interface LiveClass {
  id: string;
  title: string;
  subject: string;
  teacher: string;
  scheduledAt: string;
  duration: string;
  students: number;
  status: "scheduled" | "live" | "ended";
}

/* ── Dummy data (will come from API in Phase 2) ── */
const SAMPLE_CLASSES: LiveClass[] = [
  {
    id: "math-101",
    title: "Introduction to Algebra",
    subject: "Mathematics",
    teacher: "Akshay",
    scheduledAt: "Today, 4:00 PM",
    duration: "60 min",
    students: 12,
    status: "live",
  },
  {
    id: "phy-201",
    title: "Newton's Laws of Motion",
    subject: "Physics",
    teacher: "Akshay",
    scheduledAt: "Today, 6:00 PM",
    duration: "45 min",
    students: 8,
    status: "scheduled",
  },
  {
    id: "chem-301",
    title: "Periodic Table Overview",
    subject: "Chemistry",
    teacher: "Akshay",
    scheduledAt: "Tomorrow, 10:00 AM",
    duration: "90 min",
    students: 15,
    status: "scheduled",
  },
];

/* ── Page ── */
export default function LiveClassPage() {
  const [activeRoom, setActiveRoom] = useState<LiveClass | null>(null);
  const [showSchedule, setShowSchedule] = useState(false);
  const { role } = useAuth();

  /* ── Active Room (full-screen meeting) ── */
  if (activeRoom) {
    return (
      <div className="fixed inset-0 z-50 bg-[#0f0f0f] flex flex-col">
        {/* Header bar */}
        <div className="flex h-14 shrink-0 items-center justify-between px-5 border-b border-white/10 bg-[#1a1a2e]">
          <div className="flex items-center gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded bg-brand-red">
              <Wifi className="h-3.5 w-3.5 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white leading-none">{activeRoom.title}</p>
              <p className="text-[10px] text-white/50 mt-0.5">{activeRoom.subject}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 rounded-full bg-brand-red/15 border border-brand-red/30 px-3 py-1 text-[11px] font-semibold text-brand-red">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-red animate-pulse" />
              LIVE
            </span>
            <button
              onClick={() => setActiveRoom(null)}
              className="flex items-center gap-2 rounded-lg bg-brand-red/15 hover:bg-brand-red/30 border border-brand-red/30 px-3 py-1.5 text-xs font-semibold text-brand-red transition-colors"
            >
              <X className="h-3.5 w-3.5" /> End Class
            </button>
          </div>
        </div>

        {/* Jitsi embed */}
        <div className="flex-1 p-3">
          <JitsiMeet
            roomName={activeRoom.id}
            displayName="Akshay (Teacher)"
          />
        </div>
      </div>
    );
  }

  /* ── Main Live Class Dashboard ── */
  return (
    <DashboardLayout title="Live Class">
      <div className="flex flex-col h-full">
        {/* Page Header */}
        <div className="flex items-center justify-between px-6 lg:px-8 py-5 border-b border-border-soft bg-white">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-brand-blue/8 flex items-center justify-center">
              <Video className="h-4.5 w-4.5 text-brand-blue" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-text-primary">Live Classes</h2>
              <p className="text-xs text-text-muted mt-0.5">Powered by Jitsi Meet — no accounts required</p>
            </div>
          </div>
          {role !== 'STUDENT' && (
            <button
              onClick={() => setShowSchedule(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-brand-blue px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-brand-blue-dark transition-colors"
            >
              <Plus className="h-3.5 w-3.5" /> Schedule Class
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6">

          {/* Stats row */}
          {role !== 'STUDENT' && (
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Total Classes", value: "3",  icon: BookOpen, color: "text-brand-blue bg-brand-blue/8" },
                { label: "Live Now",       value: "1",  icon: Wifi,     color: "text-brand-red  bg-brand-red/8"  },
                { label: "Students",       value: "35", icon: Users,    color: "text-success    bg-success/8"    },
              ].map(({ label, value, icon: Icon, color }) => (
                <div key={label} className="bg-white rounded-xl border border-border-soft p-5 shadow-sm">
                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <p className="text-2xl font-bold text-text-primary mt-3 tracking-tight">{value}</p>
                  <p className="text-[11px] font-medium text-text-muted mt-0.5 uppercase tracking-wider">{label}</p>
                </div>
              ))}
            </div>
          )}

          {/* Class List */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-text-primary">Today&apos;s Schedule</h3>
            {SAMPLE_CLASSES.map((cls) => (
              <ClassCard key={cls.id} cls={cls} onJoin={() => setActiveRoom(cls)} />
            ))}
          </div>

        </div>
      </div>

      {/* Schedule Modal */}
      {showSchedule && (
        <ScheduleModal onClose={() => setShowSchedule(false)} />
      )}
    </DashboardLayout>
  );
}

/* ── Class Card ── */
function ClassCard({ cls, onJoin }: { cls: LiveClass; onJoin: () => void }) {
  const { role } = useAuth();
  const isLive = cls.status === "live";
  const isEnded = cls.status === "ended";

  return (
    <div className={`bg-white rounded-xl border shadow-sm p-5 flex items-center gap-5 transition-all ${isLive ? "border-brand-red/30 shadow-brand-red/5" : "border-border-soft"}`}>
      {/* Status dot */}
      <div className={`h-10 w-10 shrink-0 rounded-xl flex items-center justify-center ${isLive ? "bg-brand-red/10" : "bg-brand-blue/8"}`}>
        {isLive ? <Wifi className="h-5 w-5 text-brand-red" /> : <Video className="h-5 w-5 text-brand-blue" />}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-text-primary truncate">{cls.title}</p>
          {isLive && (
            <span className="flex items-center gap-1 rounded-full bg-brand-red/10 border border-brand-red/25 px-2 py-0.5 text-[10px] font-bold text-brand-red shrink-0">
              <span className="h-1 w-1 rounded-full bg-brand-red animate-pulse" /> LIVE
            </span>
          )}
        </div>
        <p className="text-xs text-text-muted mt-0.5">{cls.subject}</p>
        <div className="flex items-center gap-4 mt-2 text-[11px] text-text-muted">
          <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{cls.scheduledAt}</span>
          <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{cls.duration}</span>
          <span className="flex items-center gap-1"><Users className="h-3 w-3" />{cls.students} students</span>
        </div>
      </div>

      {/* Action */}
      {!isEnded && (
        <button
          onClick={onJoin}
          disabled={role === 'STUDENT' && !isLive}
          className={`shrink-0 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-colors shadow-sm ${
            role === 'STUDENT' && !isLive
              ? "bg-surface-3 text-text-muted cursor-not-allowed"
              : isLive
              ? "bg-brand-red hover:bg-brand-red-dark text-white"
              : "bg-brand-blue hover:bg-brand-blue-dark text-white"
          }`}
        >
          <Play className="h-3.5 w-3.5" />
          {role === 'STUDENT' ? "Join" : (isLive ? "Join Live" : "Start Class")}
        </button>
      )}
    </div>
  );
}

/* ── Schedule Modal ── */
function ScheduleModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-border-soft overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-soft">
          <h3 className="text-sm font-semibold text-text-primary">Schedule New Class</h3>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          {[
            { label: "Class Title",    type: "text",           placeholder: "e.g. Introduction to Algebra" },
            { label: "Subject",        type: "text",           placeholder: "e.g. Mathematics"             },
            { label: "Date & Time",    type: "datetime-local", placeholder: ""                             },
            { label: "Duration (min)", type: "number",         placeholder: "60"                           },
          ].map((f) => (
            <div key={f.label}>
              <label className="block text-xs font-semibold text-text-secondary mb-1.5">{f.label}</label>
              <input
                type={f.type}
                placeholder={f.placeholder}
                className="w-full h-9 rounded-lg border border-border-soft bg-surface-2 px-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-blue/25 focus:border-brand-blue/50"
              />
            </div>
          ))}
        </div>
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border-soft bg-surface-2">
          <button onClick={onClose} className="text-xs font-semibold text-text-secondary hover:text-text-primary transition-colors">Cancel</button>
          <button className="inline-flex items-center gap-2 rounded-lg bg-brand-blue px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-brand-blue-dark transition-colors">
            <Calendar className="h-3.5 w-3.5" /> Schedule Class
          </button>
        </div>
      </div>
    </div>
  );
}
