import { fetchApiServer } from "@/lib/api-server";
import { EStudyClient } from "./estudy-client";

export default async function EStudyPage() {
  const data = await fetchApiServer<any[]>('/study-materials');
  
  return <EStudyClient initialMaterials={data} />;
}