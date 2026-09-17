import {
  BookOpen,
  Video,
  CreditCard,
  FileText,
  Clock,
  Award,
  ArrowRight,
  Bell
} from "lucide-react";
import Link from "next/link";

export function StudentDashboard({ user }: { user: any }) {
  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* ── Banner ── */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-brand-blue-dark via-brand-blue to-brand-blue-light p-6 shadow-sm">
        {/* Subtle geometric accents */}
        <div className="absolute top-0 right-0 w-64 h-full opacity-10">
          <div className="absolute top-0 right-8 w-32 h-32 rounded-full border-[24px] border-white -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-20 h-20 rounded-full border-[12px] border-white translate-y-1/2" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-brand-red/0 via-brand-red/60 to-brand-red/0" />

        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="h-12 w-12 rounded-full bg-white/15 border border-white/25 flex items-center justify-center text-white font-bold text-lg shadow-inner uppercase">
              {user?.email?.charAt(0) || "S"}
            </div>
            <div>
              <p className="text-white/65 text-xs font-medium tracking-wide mb-0.5">Welcome back, Student</p>
              <h2 className="text-white font-semibold text-xl tracking-tight">{user?.email?.split('@')[0] || "Student"}</h2>
              <p className="text-white/55 text-xs mt-0.5">Educare Kalathipady · 2026–2027</p>
            </div>
          </div>
          <span className="hidden sm:inline-flex items-center rounded-md border border-white/20 bg-white/10 px-4 py-1 text-xs font-semibold tracking-widest text-white uppercase">
            STUDENT
          </span>
        </div>
      </div>

      {/* ── Quick Actions ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/estudy" className="group relative bg-white rounded-xl border border-border-soft shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden p-5 flex flex-col items-center justify-center text-center">
          <div className="h-12 w-12 rounded-full bg-brand-blue/10 text-brand-blue flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <BookOpen className="h-6 w-6" />
          </div>
          <h3 className="font-bold text-text-primary text-sm">Study Materials</h3>
          <p className="text-xs text-text-muted mt-1">Access notes & videos</p>
        </Link>
        
        <Link href="/live-class" className="group relative bg-white rounded-xl border border-border-soft shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden p-5 flex flex-col items-center justify-center text-center">
          <div className="h-12 w-12 rounded-full bg-brand-red/10 text-brand-red flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Video className="h-6 w-6" />
          </div>
          <h3 className="font-bold text-text-primary text-sm">Live Classes</h3>
          <p className="text-xs text-text-muted mt-1">Join upcoming sessions</p>
        </Link>
        
        <Link href="/exam" className="group relative bg-white rounded-xl border border-border-soft shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden p-5 flex flex-col items-center justify-center text-center">
          <div className="h-12 w-12 rounded-full bg-warning/10 text-warning flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <FileText className="h-6 w-6" />
          </div>
          <h3 className="font-bold text-text-primary text-sm">Exams & Results</h3>
          <p className="text-xs text-text-muted mt-1">View your performance</p>
        </Link>

        <Link href="/fee" className="group relative bg-white rounded-xl border border-border-soft shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden p-5 flex flex-col items-center justify-center text-center">
          <div className="h-12 w-12 rounded-full bg-success/10 text-success flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <CreditCard className="h-6 w-6" />
          </div>
          <h3 className="font-bold text-text-primary text-sm">Fee Status</h3>
          <p className="text-xs text-text-muted mt-1">Check dues & payments</p>
        </Link>
      </div>

      {/* ── Info Panels ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Classes */}
        <div className="bg-white rounded-xl border border-border-soft shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-text-primary">Upcoming Classes</h3>
            <Link href="/live-class" className="text-xs font-semibold text-brand-blue flex items-center gap-1 hover:underline">
              View All <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-3 rounded-lg border border-border-soft bg-surface-2">
              <div className="h-10 w-10 shrink-0 rounded-lg bg-brand-blue/10 text-brand-blue flex flex-col items-center justify-center">
                <span className="text-xs font-bold leading-tight">10</span>
                <span className="text-[9px] uppercase font-semibold leading-tight">AM</span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-text-primary">Mathematics - Algebra</h4>
                <p className="text-xs text-text-secondary mt-0.5">Mr. Thomas | Class 11</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-3 rounded-lg border border-border-soft bg-surface-2">
              <div className="h-10 w-10 shrink-0 rounded-lg bg-brand-blue/10 text-brand-blue flex flex-col items-center justify-center">
                <span className="text-xs font-bold leading-tight">12</span>
                <span className="text-[9px] uppercase font-semibold leading-tight">PM</span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-text-primary">Physics - Thermodynamics</h4>
                <p className="text-xs text-text-secondary mt-0.5">Mrs. Smith | Class 11</p>
              </div>
            </div>
          </div>
        </div>

        {/* Notice Board */}
        <div className="bg-white rounded-xl border border-border-soft shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-text-primary">Notice Board</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="mt-0.5"><Bell className="h-4 w-4 text-brand-red" /></div>
              <div>
                <h4 className="text-sm font-semibold text-text-primary">Term 1 Examination Schedule</h4>
                <p className="text-xs text-text-muted mt-0.5">The schedule for Term 1 has been published. Please check the exams section.</p>
                <p className="text-[10px] font-medium text-text-muted mt-1">2 hours ago</p>
              </div>
            </div>
            <div className="h-px w-full bg-border-soft" />
            <div className="flex items-start gap-3">
              <div className="mt-0.5"><Award className="h-4 w-4 text-warning" /></div>
              <div>
                <h4 className="text-sm font-semibold text-text-primary">Sports Day 2026</h4>
                <p className="text-xs text-text-muted mt-0.5">Annual sports day will be held on Oct 15. Register your names.</p>
                <p className="text-[10px] font-medium text-text-muted mt-1">1 day ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
