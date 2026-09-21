import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class ExamsService {
  constructor(private prisma: PrismaService) {}

  async getExams(): Promise<any> {
    return this.prisma.exam.findMany({
      include: {
        academicYear: true,
        batch: true,
        subject: true,
        chapter: true,
        topic: true,
        mcqQuestions: true,
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getExamResults(examId: string): Promise<any> {
    return this.prisma.examResult.findMany({
      where: { examId },
      include: { student: { include: { user: true } } }
    });
  }

  async getExamStudents(examId: string): Promise<any> {
    const exam = await this.prisma.exam.findUnique({ where: { id: examId } });
    if (!exam) throw new NotFoundException('Exam not found');

    const whereClause: any = {};
    if (exam.batchId) {
      whereClause.batchId = exam.batchId;
    } else {
      if (exam.academicYearId) whereClause.academicYearId = exam.academicYearId;
      if (exam.boardId) whereClause.boardId = exam.boardId;
      if (exam.standardId) whereClause.standardId = exam.standardId;
      if (exam.centreId) whereClause.centreId = exam.centreId;
      if (exam.targetTrack && exam.targetTrack !== 'BOTH') whereClause.track = exam.targetTrack;
    }

    const enrollments = await this.prisma.enrollment.findMany({
      where: whereClause,
      include: { student: { include: { user: true } } }
    });

    return enrollments.map(e => ({
      studentId: e.studentId,
      name: `${e.student.user.firstName} ${e.student.user.lastName}`,
      admissionNo: e.student.admissionNo
    }));
  }

  async saveExamResults(examId: string, results: any[]) {
    // Delete existing to support simple upsert list
    await this.prisma.examResult.deleteMany({ where: { examId } });
    
    if (results.length > 0) {
      await this.prisma.examResult.createMany({
        data: results.map((r: any) => ({
          examId,
          studentId: r.studentId,
          marksObtained: Number(r.marksObtained),
          maxMarks: Number(r.maxMarks),
          grade: r.grade || null,
          remarks: r.remarks || null,
        }))
      });
    }
    return { success: true };
  }

  async getExamsByTopic(topicId: string): Promise<any> {
    return this.prisma.exam.findMany({
      where: {
        topicId,
        type: { in: ['MCQ_EXAM', 'MOCK_TEST'] },
      },
      include: {
        subject: true,
        chapter: true,
        topic: true,
        mcqQuestions: true,
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async createExam(data: any) {
    let { title, type, academicYearId, batchId, subjectId, chapterId, topicId, boardId, standardId, centreId, targetTrack } = data;
    
    // Ensure we have a valid academicYear
    if (academicYearId === "dummy") {
      const year = await this.prisma.academicYear.findFirst();
      if (year) academicYearId = year.id;
    }
    
    // Ensure we have a valid batch if requested
    if (batchId === "dummy") {
      let batch = await this.prisma.batch.findFirst();
      if (batch) batchId = batch.id;
      else batchId = null;
    }
    
    // Ensure we have a valid subject
    if (subjectId === "dummy") {
      let subject = await this.prisma.subject.findFirst();
      if (!subject) {
        subject = await this.prisma.subject.create({ data: { name: "Dummy Subject" } });
      }
      subjectId = subject.id;
    }

    return this.prisma.exam.create({
      data: {
        title,
        type: type || 'QUESTION_BANK',
        academicYearId,
        batchId: batchId || undefined,
        subjectId,
        chapterId: chapterId || undefined,
        topicId: topicId || undefined,
        boardId: boardId || undefined,
        standardId: standardId || undefined,
        centreId: centreId || undefined,
        targetTrack: targetTrack || 'BOTH',
      }
    });
  }

  async getMcqQuestions(): Promise<any> {
    return this.prisma.mcqQuestion.findMany({
      include: { exam: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  async createMcqQuestion(data: any): Promise<any> {
    const { questionText, imageUrl, options, correctOption, explanation, marks, negativeMarks, examId } = data;
    return this.prisma.mcqQuestion.create({
      data: {
        questionText,
        imageUrl,
        options,
        correctOption,
        explanation,
        marks: marks !== undefined ? Number(marks) : 4.0,
        negativeMarks: negativeMarks !== undefined ? Number(negativeMarks) : 1.0,
        examId,
      }
    });
  }
}