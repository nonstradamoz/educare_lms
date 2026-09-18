import { fetchApiServer } from "@/lib/api-server";
import { AssignmentsClient } from "./assignments-client";

export default async function AssignmentsPage() {
  const assignments = await fetchApiServer<any[]>('/assignments');
  return <AssignmentsClient initialAssignments={assignments} />;
}
