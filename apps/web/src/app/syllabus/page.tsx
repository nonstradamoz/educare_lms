import { fetchApiServer } from "@/lib/api-server";
import { SyllabusClient } from "./syllabus-client";

export default async function SyllabusPage() {
  const [batches, boards] = await Promise.all([
    fetchApiServer<any[]>('/setup/batches').catch(() => []),
    fetchApiServer<any[]>('/setup/boards').catch(() => [])
  ]);
  
  return <SyllabusClient initialBatches={batches} initialBoards={boards} />;
}
