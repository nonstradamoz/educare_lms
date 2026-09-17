import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { AdminDashboard } from "@/components/dashboard/admin-dashboard";
import { StudentDashboard } from "@/components/dashboard/student-dashboard";
import { getUserFromToken } from "@/lib/auth-server";

export default function Home() {
  const user = getUserFromToken();

  return (
    <DashboardLayout title="Dashboard" role={user?.role}>
      {user?.role === 'STUDENT' ? (
        <StudentDashboard user={user} />
      ) : (
        <AdminDashboard user={user} />
      )}
    </DashboardLayout>
  );
}
