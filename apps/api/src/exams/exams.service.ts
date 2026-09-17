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

  async createExam(data: any) {
    let { title, type, academicYearId, batchId, subjectId, chapterId, topicId, boardId, standardId, centreId } = data;
    
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
    const { questionText, imageUrl, options, correctOption, explanation, marks, examId } = data;
    return this.prisma.mcqQuestion.create({
      data: {
        questionText,
        imageUrl,
        options,
        correctOption,
        explanation,
        marks,
        examId,
      }
    });
  }
}