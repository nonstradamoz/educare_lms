import { fetchApiServer } from "@/lib/api-server";
import { StudentClient } from "./student-client";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function StudentSyllabusPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("AccessToken")?.value;
  
  if (!token) {
    redirect("/login");
  }

  // Get active batch id for the student. For now we will use a generic query or let the client select it
  // In a real scenario, this would be fetched from their enrollment
  const batches = await fetchApiServer<any[]>('/setup/batches').catch(() => []);
  const defaultBatchId = batches[0]?.id;
  
  const profile = await fetchApiServer<any>('/auth/me').catch(() => null);

  return <StudentClient initialBatchId={defaultBatchId} studentId={profile?.studentProfile?.id} />;
}
