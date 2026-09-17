import { fetchApiServer } from "@/lib/api-server";
import { FeeClient } from "./fee-client";

export default async function FeePage() {
  const data = await fetchApiServer<any[]>("/fee").catch(() => []);
  const mapped = data.map((d: any) => ({
    id: d.id,
    receiptNo: d.receiptNo,
    studentName: d.student?.user?.name || "Unknown",
    course: "Student", // we can map from enrollments if available
    amount: d.amount,
    date: new Date(d.date).toLocaleDateString(),
    status: d.status,
    paymentMode: d.paymentMode || "-"
  }));

  return <FeeClient initialFees={mapped} />;
}
