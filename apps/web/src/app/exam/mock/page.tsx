import { fetchApiServer } from "@/lib/api-server";
import { MockClient } from "./mock-client";

export default async function MockTestPage() {
  const data = await fetchApiServer<any[]>("/exams");
  // filter for MOCK_TEST if API returns all
  const mockTests = data.filter((e: any) => e.examType === "MOCK_TEST");

  return <MockClient initialTests={mockTests} />;
}
