import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class SetupService {
  constructor(private prisma: PrismaService) {}

  // Centres
  async getCentres() {
    return this.prisma.centre.findMany();
  }
  async createCentre(data: { name: string; code: string; type: string; address?: string }) {
    return this.prisma.centre.create({ data });
  }

  // Academic Years
  async getAcademicYears() {
    return this.prisma.academicYear.findMany({ orderBy: { startDate: 'desc' } });
  }
  async createAcademicYear(data: { name: string; startDate: Date; endDate: Date; isActive?: boolean }) {
    return this.prisma.academicYear.create({ data });
  }

  // Boards
  async getBoards() {
    return this.prisma.board.findMany();
  }
  async createBoard(data: { name: string; code: string; description?: string }) {
    return this.prisma.board.create({ data });
  }

  // Standards (Classes)
  async getStandards() {
    return this.prisma.standard.findMany();
  }
  async createStandard(data: { name: string; code: string; level: number }) {
    return this.prisma.standard.create({ data });
  }

  // Subjects
  async getSubjects() {
    return this.prisma.subject.findMany();
  }
  async createSubject(data: { name: string }) {
    return this.prisma.subject.create({ data });
  }

  // Syllabi
  async getSyllabi() {
    return this.prisma.syllabus.findMany({ include: { subject: true, standard: true, board: true } });
  }
  async createSyllabus(data: { boardId: string; standardId: string; subjectId: string }) {
    return this.prisma.syllabus.create({ data });
  }

  // Chapters
  async getChapters(syllabusId?: string) {
    if (syllabusId) {
      return this.prisma.chapter.findMany({ where: { syllabusId } });
    }
    return this.prisma.chapter.findMany({ include: { syllabus: { include: { subject: true } } } });
  }
  async createChapter(data: { name: string; syllabusId: string }) {
    return this.prisma.chapter.create({ data });
  }

  // Topics
  async getTopics(chapterId?: string) {
    if (chapterId) {
      return this.prisma.topic.findMany({ where: { chapterId } });
    }
    return this.prisma.topic.findMany({ include: { chapter: true } });
  }
  async createTopic(data: { name: string; chapterId: string }) {
    return this.prisma.topic.create({ data });
  }
}
