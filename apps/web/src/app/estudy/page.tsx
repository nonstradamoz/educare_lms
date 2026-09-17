import { fetchApiServer } from "@/lib/api-server";
import { EStudyClient } from "./estudy-client";

export default async function EStudyPage() {
  const data = await fetchApiServer<any[]>('/estudy');
  
  const mapped = data.map((m: any) => ({
    id: m.id,
    title: m.title,
    type: (m.type === 'VIDEO' ? 'Video' : m.type === 'LINK' ? 'Link' : 'PDF') as "PDF" | "Video" | "Link",
    subject: m.syllabus?.subject?.name || 'N/A',
    classLevel: m.syllabus?.standard?.name || 'N/A',
    dateAdded: new Date(m.createdAt).toLocaleDateString(),
    url: m.url
  }));

  return <EStudyClient initialMaterials={mapped} />;
}