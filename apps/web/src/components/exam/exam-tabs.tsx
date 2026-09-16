"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, Database, Layers, Trophy, ChevronRight } from "lucide-react";

const tabs = [
  { label: "Overview",      href: "/exam",             icon: FileText  },
  { label: "Question Bank", href: "/exam/questions",   icon: Database  },
  { label: "MCQ Exams",     href: "/exam/mcq",         icon: Layers    },
  { label: "Mock Tests",    href: "/exam/mock",         icon: Layers    },
  { label: "Results",       href: "/exam/results",      icon: Trophy    },
];

export function ExamTabs() {
  const path = usePathname();
  return (
    <div className="flex items-center gap-1 border-b border-border-soft bg-white px-6 lg:px-8 overflow-x-auto">
      {tabs.map(({ label, href, icon: Icon }) => {
        const active = path === href;
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-2 whitespace-nowrap px-4 py-3 text-xs font-semibold border-b-2 transition-colors ${
              active
                ? "border-brand-blue text-brand-blue"
                : "border-transparent text-text-muted hover:text-text-secondary"
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </Link>
        );
      })}
    </div>
  );
}

export function ExamBreadcrumb({ items }: { items: string[] }) {
  return (
    <div className="flex items-center gap-1 text-xs text-text-muted mb-4">
      {["Exam", ...items].map((item, i, arr) => (
        <span key={i} className="flex items-center gap-1">
          <span className={i === arr.length - 1 ? "text-text-primary font-medium" : ""}>{item}</span>
          {i < arr.length - 1 && <ChevronRight className="h-3 w-3" />}
        </span>
      ))}
    </div>
  );
}
