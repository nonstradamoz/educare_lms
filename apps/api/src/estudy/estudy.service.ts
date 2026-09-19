import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class EstudyService {
  constructor(private readonly prisma: PrismaService) {}

  async getMaterials() {
    return this.prisma.studyMaterial.findMany({
      include: {
        academicYear: true,
        syllabus: {
          include: {
            subject: true,
            standard: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async createMaterial(data: any) {
    let syllabusId = data.syllabusId;
    if (!syllabusId) {
      const firstSyllabus = await this.prisma.syllabus.findFirst();
      if (!firstSyllabus) {
         const board = await this.prisma.board.findFirst() || await this.prisma.board.create({ data: { name: 'Dummy Board' } });
         const standard = await this.prisma.standard.findFirst() || await this.prisma.standard.create({ data: { name: 'Class 10', boardId: board.id } });
         const subject = await this.prisma.subject.findFirst() || await this.prisma.subject.create({ data: { name: 'Science' } });
         
         const newSyllabus = await this.prisma.syllabus.create({
           data: {
             boardId: board.id,
             standardId: standard.id,
             subjectId: subject.id
           }
         });
         syllabusId = newSyllabus.id;
      } else {
         syllabusId = firstSyllabus.id;
      }
    }

    let academicYearId = data.academicYearId;
    if (!academicYearId) {
      const ay = await this.prisma.academicYear.findFirst() || await this.prisma.academicYear.create({ data: { name: '2025-26' } });
      academicYearId = ay.id;
    }

    return this.prisma.studyMaterial.create({
      data: {
        title: data.title,
        type: data.type || 'VIDEO',
        url: data.url, 
        academicYearId,
        syllabusId,
      }
    });
  }
}
