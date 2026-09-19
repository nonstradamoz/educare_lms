import { fetchApiServer } from "@/lib/api-server";
import { StudentsClient } from "./students-client";

export default async function StudentsPage() {
  const data = await fetchApiServer<any[]>('/students').catch(() => []);
  
  const mapped = (Array.isArray(data) ? data : []).map(d => {
    const profile = d || {};
    const user = profile.user || {};
    const enrollment = profile.enrollments?.[0];
    const batch = enrollment?.batch;
    
    return {
      id: profile.id || '',
      admissionNo: profile.admissionNo || '',
      name: `${user.firstName || 'Unknown'} ${user.lastName || ''}`.trim(),
      email: user.email || '',
      phone: profile.parentPhone || '',
      parentName: profile.parentName || '',
      parentEmail: profile.parentEmail || '',
      parentPhone: profile.parentPhone || '',
      academicYear: batch?.academicYear?.name || 'N/A',
      board: batch?.board?.name || 'N/A',
      classLevel: batch?.standard?.name || 'N/A',
      centre: batch?.centre?.name || 'N/A',
      division: batch?.name || 'N/A',
    };
  });

  return <StudentsClient initialStudents={mapped} />;
}
