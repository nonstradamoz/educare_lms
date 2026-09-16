import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { PageShell } from "@/components/layout/page-shell";
import { HelpCircle, MessageSquare, BookOpen, ExternalLink } from "lucide-react";

export default function HelpPage() {
  return (
    <DashboardLayout title="Help">
      <PageShell title="Help & Support" subtitle="Documentation, guides and contact support" icon={HelpCircle} accentColor="blue">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl">
          {[
            { icon: BookOpen,       title: "Documentation",  desc: "Read guides and how-to articles for every feature.",   cta: "Browse Docs"    },
            { icon: MessageSquare,  title: "Contact Support", desc: "Reach out to our team for technical help.",            cta: "Open a Ticket"  },
            { icon: ExternalLink,   title: "Release Notes",  desc: "See what's new in the latest version of Educare LMS.", cta: "View Changelog" },
          ].map(({ icon: Icon, title, desc, cta }) => (
            <div key={title} className="bg-white rounded-xl border border-border-soft p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
              <div className="h-10 w-10 rounded-lg bg-brand-blue/8 flex items-center justify-center mb-4">
                <Icon className="h-5 w-5 text-brand-blue" />
              </div>
              <p className="text-sm font-semibold text-text-primary mb-1">{title}</p>
              <p className="text-xs text-text-muted leading-relaxed">{desc}</p>
              <p className="mt-4 text-xs font-semibold text-brand-blue group-hover:underline">{cta} →</p>
            </div>
          ))}
        </div>
      </PageShell>
    </DashboardLayout>
  );
}
