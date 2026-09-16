import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { PageShell } from "@/components/layout/page-shell";
import { Award } from "lucide-react";

export default function CertificatePage() {
  return (
    <DashboardLayout title="Certificate">
      <PageShell title="Certificate" subtitle="Issue and manage student certificates" icon={Award} accentColor="blue" />
    </DashboardLayout>
  );
}
