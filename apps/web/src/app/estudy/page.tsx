import { fetchApiServer } from "@/lib/api-server";
import { EStudyClient } from "./estudy-client";

export default async function EStudyPage() {
  const data = await fetchApiServer<any[]>('/study-materials').catch(() => []);
  
  const safeData = Array.isArray(data) ? data : [];
  return <EStudyClient initialMaterials={safeData} />;
}