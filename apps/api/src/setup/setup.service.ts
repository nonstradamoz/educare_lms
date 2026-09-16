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
}
