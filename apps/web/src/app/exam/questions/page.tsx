import { fetchApiServer } from "@/lib/api-server";
import { QuestionsClient } from "./questions-client";

export default async function QuestionBankPage() {
  const [qRes, subRes, clsRes, topRes] = await Promise.all([
    fetchApiServer<any[]>("/exams/questions/mcq").catch(() => []), 
    fetchApiServer<any[]>("/setup/subjects").catch(() => []),
    fetchApiServer<any[]>("/setup/standards").catch(() => []),
    fetchApiServer<any[]>("/setup/topics").catch(() => [])
  ]);
  
  const mappedQuestions = qRes.map((q: any) => ({
    id: q.id,
    question: q.question,
    imageUrl: q.imageUrl,
    options: q.options || [],
    correct: q.correctOption,
    classLevel: "Class", // Need relation
    subject: "Subject", 
    topic: "Topic",
    difficulty: "Medium"
  }));
  
  return <QuestionsClient initialQuestions={mappedQuestions} initialSubjects={subRes} initialClasses={clsRes} initialTopics={topRes} />;
}
