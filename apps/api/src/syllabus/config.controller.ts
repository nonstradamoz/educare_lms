import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProgressService } from './progress.service';
import { PrismaService } from '../database/prisma.service';

@UseGuards(JwtAuthGuard)
@Controller('syllabus-config')
export class ConfigController {
  constructor(
    private progressService: ProgressService,
    private prisma: PrismaService
  ) {}

  @Get()
  getConfig() {
    return this.progressService.getConfiguration();
  }

  @Put()
  async updateConfig(@Body() data: any) {
    const config = await this.progressService.getConfiguration();
    return this.prisma.syllabusConfiguration.update({
      where: { id: config.id },
      data: data
    });
  }
}
