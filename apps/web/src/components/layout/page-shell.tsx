import { LucideIcon } from "lucide-react";

interface PageShellProps {
  title: string;
  subtitle?: string;
  icon: LucideIcon;
  accentColor?: "blue" | "red" | "green" | "orange";
  children?: React.ReactNode;
  actions?: React.ReactNode;
}

const accentMap = {
  blue:   { bar: "from-brand-blue-dark to-brand-blue", icon: "text-brand-blue bg-brand-blue/8" },
  red:    { bar: "from-brand-red-dark  to-brand-red",  icon: "text-brand-red  bg-brand-red/8"  },
  green:  { bar: "from-[#0d7a3e] to-success",          icon: "text-success    bg-success/8"    },
  orange: { bar: "from-[#b45309] to-warning",          icon: "text-warning    bg-warning/8"    },
};

export function PageShell({ title, subtitle, icon: Icon, accentColor = "blue", children, actions }: PageShellProps) {
  const { bar, icon } = accentMap[accentColor];

  return (
    <div className="flex flex-col h-full">
      {/* Page Header */}
      <div className="flex items-center justify-between px-6 lg:px-8 py-5 border-b border-border-soft bg-white">
        <div className="flex items-center gap-3">
          <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${icon}`}>
            <Icon className="h-4.5 w-4.5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-text-primary tracking-tight">{title}</h2>
            {subtitle && <p className="text-xs text-text-muted mt-0.5">{subtitle}</p>}
          </div>
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6">
        {children ?? (
          <ComingSoon title={title} icon={Icon} bar={bar} />
        )}
      </div>
    </div>
  );
}

function ComingSoon({ title, icon: Icon, bar }: { title: string; icon: LucideIcon; bar: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
      <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${bar} flex items-center justify-center mb-5 shadow-md`}>
        <Icon className="h-7 w-7 text-white" />
      </div>
      <h3 className="text-lg font-semibold text-text-primary mb-1">{title}</h3>
      <p className="text-sm text-text-secondary max-w-xs leading-relaxed">
        This module is currently being built. It will be fully functional in an upcoming phase.
      </p>
      <div className="mt-6 flex items-center gap-2 rounded-full border border-border-soft bg-white px-4 py-1.5 text-xs text-text-muted shadow-sm">
        <span className="h-1.5 w-1.5 rounded-full bg-brand-blue animate-pulse" />
        Coming in next phase
      </div>
    </div>
  );
}
