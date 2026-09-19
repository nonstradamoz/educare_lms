import { fetchApiServer } from "@/lib/api-server";
import { SyllabusClient } from "./syllabus-client";

export default async function SyllabusPage() {
  const batches = await fetchApiServer<any[]>('/setup/batches').catch(() => []);
  
  return <SyllabusClient initialBatches={batches} />;
}
