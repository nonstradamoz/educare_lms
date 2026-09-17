import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class StudyMaterialService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll() {
    try {
      return await this.prisma.studyMaterial.findMany({
        include: {
          academicYear: true,
          syllabus: true,
          chapter: true,
          topic: true,
        },
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      console.error(error);
      throw new HttpException('Failed to fetch study materials', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async create(data: any) {
    try {
      return await this.prisma.studyMaterial.create({
        data: {
          title: data.title,
          type: data.type,
          url: data.url,
          academicYearId: data.academicYearId,
          syllabusId: data.syllabusId,
          chapterId: data.chapterId,
          topicId: data.topicId,
        },
      });
    } catch (error) {
      console.error(error);
      throw new HttpException('Failed to create study material', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async delete(id: string) {
    try {
      return await this.prisma.studyMaterial.delete({
        where: { id },
      });
    } catch (error) {
      console.error(error);
      throw new HttpException('Failed to delete study material', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
