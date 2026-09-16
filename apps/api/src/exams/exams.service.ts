import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class ExamsService {
  constructor(private prisma: PrismaService) {}

  async getExams() {
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
    let { title, academicYearId, batchId, subjectId, chapterId, topicId } = data;
    
    // Ensure we have a valid academicYear
    if (academicYearId === "dummy") {
      const year = await this.prisma.academicYear.findFirst();
      if (year) academicYearId = year.id;
    }
    
    // Ensure we have a valid batch
    if (batchId === "dummy") {
      let batch = await this.prisma.batch.findFirst();
      if (!batch) {
        // create one
        const year = await this.prisma.academicYear.findFirst();
        const centre = await this.prisma.centre.findFirst();
        const standard = await this.prisma.standard.findFirst();
        const board = await this.prisma.board.findFirst();
        
        batch = await this.prisma.batch.create({
          data: {
            name: "Dummy Batch",
            academicYearId: year?.id || (await this.prisma.academicYear.create({data:{name:"2026"}})).id,
            centreId: centre?.id || (await this.prisma.centre.create({data:{name:"Dummy", code:"DUM"}})).id,
            standardId: standard?.id || (await this.prisma.standard.create({data:{name:"Dummy Class"}})).id,
            boardId: board?.id || (await this.prisma.board.create({data:{name:"Dummy Board", code:"DB"}})).id,
          }
        });
      }
      batchId = batch.id;
    }
    
    // Ensure we have a valid subject
    if (subjectId === "dummy") {
      let subject = await this.prisma.subject.findFirst();
      if (!subject) {
        const standard = await this.prisma.standard.findFirst();
        subject = await this.prisma.subject.create({
          data: { name: "Dummy Subject", code: "SUBJ", standardId: standard!.id }
        });
      }
      subjectId = subject.id;
    }

    return this.prisma.exam.create({
      data: {
        title,
        academicYearId,
        batchId,
        subjectId,
        chapterId: chapterId || undefined,
        topicId: topicId || undefined,
      }
    });
  }

  async getMcqQuestions() {
    return this.prisma.mcqQuestion.findMany({
      include: { exam: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  async createMcqQuestion(data: any) {
    const { questionText, options, correctOption, marks, examId } = data;
    return this.prisma.mcqQuestion.create({
      data: {
        questionText,
        options,
        correctOption,
        marks,
        examId,
      }
    });
  }
}