import { fetchApiServer } from "@/lib/api-server";
import { IdCardClient } from "./id-card-client";

export default async function IdCardPage({ params }: { params: { id: string } }) {
  try {
    const student = await fetchApiServer<any>(`/students/${params.id}`);
    
    const user = student.user || {};
    const enrollment = student.enrollments?.[0];
    const batch = enrollment?.batch;

    const mappedStudent = {
      admissionNo: student.admissionNo || '',
      name: `${user.firstName || 'Unknown'} ${user.lastName || ''}`.trim(),
      board: batch?.board?.name || 'N/A',
      classLevel: batch?.standard?.name || 'N/A',
      division: batch?.name || 'N/A',
      centre: batch?.centre?.name || 'N/A',
      bloodGroup: "O+ve", // Static for now, can be added to db later
      phone: student.parentPhone || '',
      photo: user.avatar || null,
      course: "Student" // default course or mapped from subject
    };

    return <IdCardClient student={mappedStudent} />;
  } catch (e) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="bg-white p-8 rounded-xl shadow-sm text-center">
          <h1 className="text-xl font-bold text-red-600 mb-2">Error Loading ID Card</h1>
          <p className="text-slate-500">Could not find student data or an error occurred.</p>
        </div>
      </div>
    );
  }
}
