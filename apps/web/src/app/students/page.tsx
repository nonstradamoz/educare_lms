import { fetchApiServer } from "@/lib/api-server";
import { StudentsClient } from "./students-client";

export default async function StudentsPage() {
  const data = await fetchApiServer<any[]>('/students');
  
  const mapped = data.map(d => {
    const profile = d; // the top level is studentProfile
    const user = d.user;
    const enrollment = d.enrollments?.[0];
    const batch = enrollment?.batch;
    
    return {
      id: profile.id,
      admissionNo: profile.admissionNo,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
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
